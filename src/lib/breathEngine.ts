import type { BreathMode, BreathPhase } from "@/types/breath";

export type BreathPhaseProgress = {
  phase: BreathPhase;
  phaseIndex: number;
  phaseElapsed: number;
  phaseRemaining: number;
  cycleIndex: number;
};

export function getCycleSeconds(mode: BreathMode): number {
  return mode.phases.reduce((total, phase) => total + phase.seconds, 0);
}

export function getTargetSeconds(
  mode: BreathMode,
  minutesOverride?: number,
  cyclesOverride?: number,
): number {
  if (cyclesOverride) {
    return cyclesOverride * getCycleSeconds(mode);
  }

  if (mode.defaultCycles) {
    return mode.defaultCycles * getCycleSeconds(mode);
  }

  return (minutesOverride ?? mode.defaultMinutes ?? 5) * 60;
}

export function getPhaseAtElapsed(
  mode: BreathMode,
  elapsedSeconds: number,
): BreathPhaseProgress {
  const cycleSeconds = getCycleSeconds(mode);
  const normalizedElapsed = Math.max(0, elapsedSeconds);
  const cycleIndex = Math.floor(normalizedElapsed / cycleSeconds);
  const cycleElapsed = normalizedElapsed % cycleSeconds;
  let cursor = 0;

  for (let phaseIndex = 0; phaseIndex < mode.phases.length; phaseIndex += 1) {
    const phase = mode.phases[phaseIndex];
    const phaseEnd = cursor + phase.seconds;

    if (cycleElapsed < phaseEnd || phaseIndex === mode.phases.length - 1) {
      const phaseElapsed = Math.max(0, cycleElapsed - cursor);
      return {
        phase,
        phaseIndex,
        phaseElapsed,
        phaseRemaining: Math.max(0, phase.seconds - phaseElapsed),
        cycleIndex,
      };
    }

    cursor = phaseEnd;
  }

  return {
    phase: mode.phases[0],
    phaseIndex: 0,
    phaseElapsed: 0,
    phaseRemaining: mode.phases[0].seconds,
    cycleIndex,
  };
}

export function getCompletedCycles(
  mode: BreathMode,
  elapsedSeconds: number,
): number {
  return Math.floor(Math.max(0, elapsedSeconds) / getCycleSeconds(mode));
}

export function formatDuration(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
