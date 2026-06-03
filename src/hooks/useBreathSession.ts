import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getCycleSeconds, getPhaseAtElapsed, getTargetSeconds } from "@/lib/breathEngine";
import { saveSession } from "@/lib/historyStore";
import type {
  BreathMode,
  BreathPreferences,
  BreathSessionRecord,
} from "@/types/breath";

const phaseCue = require("../../assets/audio/phase.wav");
const completeCue = require("../../assets/audio/complete.wav");

export type BreathSessionStatus = "idle" | "running" | "paused" | "finished";

type ActiveSession = {
  mode: BreathMode;
  startedAtMs: number;
  targetSeconds: number;
  targetCycles?: number;
};

type StartOptions = {
  targetMinutes?: number;
  targetCycles?: number;
};

export function useBreathSession(preferences: BreathPreferences) {
  const phasePlayer = useAudioPlayer(phaseCue);
  const completePlayer = useAudioPlayer(completeCue);
  const preferencesRef = useRef(preferences);
  const activeSessionRef = useRef<ActiveSession | null>(null);
  const runningStartedAtRef = useRef<number | null>(null);
  const elapsedBeforeRunRef = useRef(0);
  const lastPhaseKeyRef = useRef<string | null>(null);
  const savedSessionIdsRef = useRef(new Set<string>());

  const [status, setStatus] = useState<BreathSessionStatus>("idle");
  const [mode, setMode] = useState<BreathMode | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [targetSeconds, setTargetSeconds] = useState(0);
  const [targetCycles, setTargetCycles] = useState<number | undefined>();

  useEffect(() => {
    preferencesRef.current = preferences;
  }, [preferences]);

  const playPhaseCue = useCallback(async () => {
    if (!preferencesRef.current.soundEnabled) {
      return;
    }

    try {
      await phasePlayer.seekTo(0);
      phasePlayer.play();
    } catch {
      // Audio support varies by platform and browser permissions.
    }
  }, [phasePlayer]);

  const playCompleteCue = useCallback(async () => {
    if (!preferencesRef.current.soundEnabled) {
      return;
    }

    try {
      await completePlayer.seekTo(0);
      completePlayer.play();
    } catch {
      // Audio cue failures should not block saving the session.
    }
  }, [completePlayer]);

  const triggerPhaseHaptic = useCallback(async () => {
    if (!preferencesRef.current.hapticsEnabled) {
      return;
    }

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Unsupported haptics should be invisible to the session flow.
    }
  }, []);

  const triggerCompleteHaptic = useCallback(async () => {
    if (!preferencesRef.current.hapticsEnabled) {
      return;
    }

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Unsupported haptics should be invisible to the session flow.
    }
  }, []);

  const maybeSaveSession = useCallback(
    async (elapsed: number, completed: boolean) => {
      const activeSession = activeSessionRef.current;

      if (!activeSession) {
        return;
      }

      const cycleSeconds = getCycleSeconds(activeSession.mode);
      const minimumPartialSeconds = Math.min(30, cycleSeconds);

      if (!completed && elapsed < minimumPartialSeconds) {
        return;
      }

      const startedAt = new Date(activeSession.startedAtMs);
      const endedAt = new Date();
      const id = `${startedAt.toISOString()}-${activeSession.mode.id}`;

      if (savedSessionIdsRef.current.has(id)) {
        return;
      }

      savedSessionIdsRef.current.add(id);

      const record: BreathSessionRecord = {
        id,
        modeId: activeSession.mode.id,
        modeName: activeSession.mode.name,
        startedAt: startedAt.toISOString(),
        endedAt: endedAt.toISOString(),
        elapsedSeconds: Math.round(elapsed),
        completedCycles: Math.floor(elapsed / cycleSeconds),
        targetSeconds: Math.round(activeSession.targetSeconds),
        targetCycles: activeSession.targetCycles,
        completed,
      };

      await saveSession(record);
    },
    [],
  );

  const completeSession = useCallback(
    async (finalElapsed: number) => {
      const clippedElapsed = activeSessionRef.current
        ? Math.min(finalElapsed, activeSessionRef.current.targetSeconds)
        : finalElapsed;

      runningStartedAtRef.current = null;
      elapsedBeforeRunRef.current = clippedElapsed;
      setElapsedSeconds(clippedElapsed);
      setStatus("finished");
      await maybeSaveSession(clippedElapsed, true);
      await playCompleteCue();
      await triggerCompleteHaptic();
    },
    [maybeSaveSession, playCompleteCue, triggerCompleteHaptic],
  );

  useEffect(() => {
    if (status !== "running") {
      return undefined;
    }

    const intervalId = setInterval(() => {
      const activeSession = activeSessionRef.current;
      const runningStartedAt = runningStartedAtRef.current;

      if (!activeSession || runningStartedAt === null) {
        return;
      }

      const nextElapsed =
        elapsedBeforeRunRef.current + (Date.now() - runningStartedAt) / 1000;
      const clippedElapsed = Math.min(nextElapsed, activeSession.targetSeconds);
      const phaseInfo = getPhaseAtElapsed(activeSession.mode, clippedElapsed);
      const phaseKey = `${phaseInfo.cycleIndex}-${phaseInfo.phaseIndex}`;

      setElapsedSeconds(clippedElapsed);

      if (lastPhaseKeyRef.current && lastPhaseKeyRef.current !== phaseKey) {
        void playPhaseCue();
        void triggerPhaseHaptic();
      }

      lastPhaseKeyRef.current = phaseKey;

      if (nextElapsed >= activeSession.targetSeconds) {
        void completeSession(nextElapsed);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [completeSession, playPhaseCue, status, triggerPhaseHaptic]);

  const start = useCallback(
    (nextMode: BreathMode, options: StartOptions = {}) => {
      const startedAtMs = Date.now();
      const nextTargetSeconds = getTargetSeconds(
        nextMode,
        options.targetMinutes,
        options.targetCycles,
      );

      activeSessionRef.current = {
        mode: nextMode,
        startedAtMs,
        targetSeconds: nextTargetSeconds,
        targetCycles: options.targetCycles ?? nextMode.defaultCycles,
      };
      runningStartedAtRef.current = startedAtMs;
      elapsedBeforeRunRef.current = 0;
      lastPhaseKeyRef.current = "0-0";
      setMode(nextMode);
      setElapsedSeconds(0);
      setTargetSeconds(nextTargetSeconds);
      setTargetCycles(options.targetCycles ?? nextMode.defaultCycles);
      setStatus("running");
      void playPhaseCue();
      void triggerPhaseHaptic();
    },
    [playPhaseCue, triggerPhaseHaptic],
  );

  const pause = useCallback(() => {
    if (status !== "running" || runningStartedAtRef.current === null) {
      return;
    }

    elapsedBeforeRunRef.current +=
      (Date.now() - runningStartedAtRef.current) / 1000;
    runningStartedAtRef.current = null;
    setElapsedSeconds(Math.min(elapsedBeforeRunRef.current, targetSeconds));
    setStatus("paused");
  }, [status, targetSeconds]);

  const resume = useCallback(() => {
    if (status !== "paused") {
      return;
    }

    runningStartedAtRef.current = Date.now();
    setStatus("running");
  }, [status]);

  const stop = useCallback(async () => {
    const activeSession = activeSessionRef.current;
    const runningStartedAt = runningStartedAtRef.current;
    const finalElapsed =
      status === "running" && runningStartedAt !== null
        ? elapsedBeforeRunRef.current + (Date.now() - runningStartedAt) / 1000
        : elapsedSeconds;

    if (activeSession) {
      const clippedElapsed = Math.min(finalElapsed, activeSession.targetSeconds);
      await maybeSaveSession(clippedElapsed, false);
      elapsedBeforeRunRef.current = clippedElapsed;
      setElapsedSeconds(clippedElapsed);
    }

    runningStartedAtRef.current = null;
    setStatus("finished");
  }, [elapsedSeconds, maybeSaveSession, status]);

  const reset = useCallback(() => {
    activeSessionRef.current = null;
    runningStartedAtRef.current = null;
    elapsedBeforeRunRef.current = 0;
    lastPhaseKeyRef.current = null;
    setElapsedSeconds(0);
    setTargetSeconds(0);
    setTargetCycles(undefined);
    setStatus("idle");
  }, []);

  const phaseInfo = useMemo(() => {
    if (!mode) {
      return null;
    }

    return getPhaseAtElapsed(mode, elapsedSeconds);
  }, [elapsedSeconds, mode]);

  return {
    status,
    mode,
    elapsedSeconds,
    targetSeconds,
    targetCycles,
    phaseInfo,
    completedCycles: mode ? Math.floor(elapsedSeconds / getCycleSeconds(mode)) : 0,
    start,
    pause,
    resume,
    stop,
    reset,
  };
}
