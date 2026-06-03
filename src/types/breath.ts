export type BreathModeId =
  | "coherent"
  | "box"
  | "fourSevenEight"
  | "pursedLip"
  | "diaphragmatic"
  | "cyclicSigh";

export type BreathPhaseType =
  | "inhale"
  | "hold"
  | "exhale"
  | "rest"
  | "topUpInhale";

export type BreathPhase = {
  type: BreathPhaseType;
  label: string;
  seconds: number;
};

export type BreathMode = {
  id: BreathModeId;
  name: string;
  shortName: string;
  description: string;
  bestFor: string;
  defaultMinutes?: number;
  defaultCycles?: number;
  phases: BreathPhase[];
  beginnerNote?: string;
};

export type BreathSessionRecord = {
  id: string;
  modeId: BreathModeId;
  modeName: string;
  startedAt: string;
  endedAt: string;
  elapsedSeconds: number;
  completedCycles: number;
  targetSeconds?: number;
  targetCycles?: number;
  completed: boolean;
};

export type HistoryStateV1 = {
  version: 1;
  sessions: BreathSessionRecord[];
};

export type BreathPreferences = {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
};
