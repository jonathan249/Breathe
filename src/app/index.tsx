import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BreathAnimator } from "@/components/BreathAnimator";
import { ModeSelector } from "@/components/ModeSelector";
import { PreferenceToggles } from "@/components/PreferenceToggles";
import { SessionControls } from "@/components/SessionControls";
import { BREATH_MODES } from "@/constants/breathModes";
import { formatDuration } from "@/lib/breathEngine";
import {
  DEFAULT_PREFERENCES,
  loadPreferences,
  savePreferences,
} from "@/lib/historyStore";
import { useBreathSession } from "@/hooks/useBreathSession";
import type { BreathMode, BreathPreferences } from "@/types/breath";

export default function Index() {
  const [selectedMode, setSelectedMode] = useState<BreathMode>(BREATH_MODES[0]);
  const [targetMinutes, setTargetMinutes] = useState(5);
  const [targetCycles, setTargetCycles] = useState(4);
  const [preferences, setPreferences] =
    useState<BreathPreferences>(DEFAULT_PREFERENCES);
  const session = useBreathSession(preferences);
  const active = session.status === "running" || session.status === "paused";
  const displayMode = session.mode ?? selectedMode;
  const displayPhase = session.phaseInfo ?? {
    phase: displayMode.phases[0],
    phaseIndex: 0,
    phaseElapsed: 0,
    phaseRemaining: displayMode.phases[0].seconds,
    cycleIndex: 0,
  };
  const isRunning = session.status === "running";

  useEffect(() => {
    let mounted = true;

    loadPreferences()
      .then((storedPreferences) => {
        if (mounted) {
          setPreferences(storedPreferences);
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const progressLabel = useMemo(() => {
    if (session.status === "idle") {
      return selectedMode.defaultCycles
        ? `${targetCycles} cycles`
        : `${targetMinutes} minutes`;
    }

    return `${formatDuration(session.elapsedSeconds)} / ${formatDuration(session.targetSeconds)}`;
  }, [
    selectedMode.defaultCycles,
    session.elapsedSeconds,
    session.status,
    session.targetSeconds,
    targetCycles,
    targetMinutes,
  ]);

  function handlePreferenceChange(nextPreferences: BreathPreferences) {
    setPreferences(nextPreferences);
    void savePreferences(nextPreferences);
  }

  function handleSelectMode(mode: BreathMode) {
    setSelectedMode(mode);
    setTargetMinutes(mode.defaultMinutes ?? 5);
    setTargetCycles(mode.defaultCycles ?? 4);
  }

  function handleStart() {
    session.start(selectedMode, {
      targetMinutes: selectedMode.defaultCycles ? undefined : targetMinutes,
      targetCycles: selectedMode.defaultCycles ? targetCycles : undefined,
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Breathe</Text>
            <Text style={styles.subtitle}>Local breath work sessions</Text>
          </View>
          <PreferenceToggles
            preferences={preferences}
            onChange={handlePreferenceChange}
          />
        </View>

        <ModeSelector
          modes={BREATH_MODES}
          selectedModeId={selectedMode.id}
          disabled={active}
          onSelectMode={handleSelectMode}
        />

        <View style={styles.modeInfo}>
          <Text style={styles.modeTitle}>{displayMode.name}</Text>
          <Text style={styles.modeText}>{displayMode.description}</Text>
        </View>

        <BreathAnimator
          phaseLabel={displayPhase.phase.label}
          phaseType={displayPhase.phase.type}
          phaseRemaining={displayPhase.phaseRemaining}
          phaseSeconds={displayPhase.phase.seconds}
          isActive={session.status !== "idle"}
        />

        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{progressLabel}</Text>
            <Text style={styles.metricLabel}>Progress</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{session.completedCycles}</Text>
            <Text style={styles.metricLabel}>Cycles</Text>
          </View>
        </View>

        <SessionControls
          mode={selectedMode}
          status={session.status}
          targetMinutes={targetMinutes}
          targetCycles={targetCycles}
          onChangeTargetMinutes={setTargetMinutes}
          onChangeTargetCycles={setTargetCycles}
          onStart={handleStart}
          onPause={session.pause}
          onResume={session.resume}
          onStop={() => void session.stop()}
          onReset={session.reset}
        />

        <View style={styles.safety}>
          <Text style={styles.safetyText}>
            {displayMode.beginnerNote ??
              "Stop if you feel dizzy or light-headed. This is a wellness tool, not medical advice."}
          </Text>
          {isRunning ? (
            <Text style={styles.runningText}>Follow the cue at a comfortable pace.</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F7F1E8",
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    color: "#1D2523",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 38,
  },
  subtitle: {
    color: "#5D6D69",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
  },
  modeInfo: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E4DCD0",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  modeTitle: {
    color: "#163B35",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 5,
  },
  modeText: {
    color: "#5D6D69",
    fontSize: 14,
    lineHeight: 19,
  },
  metrics: {
    flexDirection: "row",
    marginBottom: 14,
  },
  metric: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E4DCD0",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    height: 72,
    justifyContent: "center",
    marginRight: 8,
    paddingHorizontal: 12,
  },
  metricValue: {
    color: "#163B35",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 2,
  },
  metricLabel: {
    color: "#5D6D69",
    fontSize: 12,
    fontWeight: "700",
  },
  safety: {
    marginTop: 16,
    paddingBottom: 8,
  },
  safetyText: {
    color: "#6B7976",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
  runningText: {
    color: "#B24D43",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
});
