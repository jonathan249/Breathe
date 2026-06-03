import type { BreathMode, BreathModeId } from "@/types/breath";

export const BREATH_MODES: BreathMode[] = [
  {
    id: "coherent",
    name: "Coherent",
    shortName: "5.5 / 5.5",
    description: "A steady slow-paced rhythm around five to six breaths per minute.",
    bestFor: "Settling into a calm, even cadence.",
    defaultMinutes: 5,
    phases: [
      { type: "inhale", label: "Inhale", seconds: 5.5 },
      { type: "exhale", label: "Exhale", seconds: 5.5 },
    ],
  },
  {
    id: "box",
    name: "Box",
    shortName: "4 / 4 / 4 / 4",
    description: "Equal inhale, hold, exhale, and rest counts.",
    bestFor: "Balanced focus and a predictable rhythm.",
    defaultMinutes: 5,
    phases: [
      { type: "inhale", label: "Inhale", seconds: 4 },
      { type: "hold", label: "Hold", seconds: 4 },
      { type: "exhale", label: "Exhale", seconds: 4 },
      { type: "rest", label: "Rest", seconds: 4 },
    ],
  },
  {
    id: "fourSevenEight",
    name: "4-7-8",
    shortName: "4 / 7 / 8",
    description: "A short cycle-based practice with a longer hold and exhale.",
    bestFor: "Brief downshifting when you already tolerate breath holds.",
    defaultCycles: 4,
    beginnerNote:
      "Start with 3 to 5 cycles and stop if you feel dizzy or light-headed.",
    phases: [
      { type: "inhale", label: "Inhale", seconds: 4 },
      { type: "hold", label: "Hold", seconds: 7 },
      { type: "exhale", label: "Exhale", seconds: 8 },
    ],
  },
  {
    id: "pursedLip",
    name: "Long Exhale",
    shortName: "3 / 6",
    description: "An exhale-focused pattern inspired by pursed-lip breathing.",
    bestFor: "Softening effort with a simple longer exhale.",
    defaultMinutes: 5,
    phases: [
      { type: "inhale", label: "Inhale", seconds: 3 },
      { type: "exhale", label: "Slow exhale", seconds: 6 },
    ],
  },
  {
    id: "diaphragmatic",
    name: "Belly Breath",
    shortName: "4 / 6",
    description: "Slow abdominal breathing with a relaxed longer exhale.",
    bestFor: "Gentle everyday diaphragmatic practice.",
    defaultMinutes: 5,
    phases: [
      { type: "inhale", label: "Belly expands", seconds: 4 },
      { type: "exhale", label: "Belly softens", seconds: 6 },
    ],
  },
  {
    id: "cyclicSigh",
    name: "Cyclic Sigh",
    shortName: "2 / 1 / 6",
    description: "A double inhale followed by a long, unforced exhale.",
    bestFor: "A short exhale-emphasized reset.",
    defaultMinutes: 5,
    phases: [
      { type: "inhale", label: "Inhale", seconds: 2 },
      { type: "topUpInhale", label: "Top-up inhale", seconds: 1 },
      { type: "exhale", label: "Long exhale", seconds: 6 },
    ],
  },
];

export function getBreathMode(id: BreathModeId): BreathMode {
  return BREATH_MODES.find((mode) => mode.id === id) ?? BREATH_MODES[0];
}
