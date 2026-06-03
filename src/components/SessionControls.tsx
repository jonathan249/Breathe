import { Pressable, StyleSheet, Text, View } from "react-native";

import type { BreathSessionStatus } from "@/hooks/useBreathSession";
import type { BreathMode } from "@/types/breath";

type SessionControlsProps = {
  mode: BreathMode;
  status: BreathSessionStatus;
  targetMinutes: number;
  targetCycles: number;
  onChangeTargetMinutes: (minutes: number) => void;
  onChangeTargetCycles: (cycles: number) => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
};

const DURATION_OPTIONS = [3, 5, 10];
const CYCLE_OPTIONS = [3, 4, 5];

export function SessionControls({
  mode,
  status,
  targetMinutes,
  targetCycles,
  onChangeTargetMinutes,
  onChangeTargetCycles,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
}: SessionControlsProps) {
  const active = status === "running" || status === "paused";
  const cycleBased = Boolean(mode.defaultCycles);

  return (
    <View style={styles.wrapper}>
      <View style={styles.segmentGroup}>
        <Text style={styles.segmentLabel}>{cycleBased ? "Cycles" : "Minutes"}</Text>
        <View style={styles.segments}>
          {(cycleBased ? CYCLE_OPTIONS : DURATION_OPTIONS).map((value) => {
            const selected = cycleBased
              ? value === targetCycles
              : value === targetMinutes;

            return (
              <Pressable
                key={value}
                disabled={active}
                onPress={() =>
                  cycleBased
                    ? onChangeTargetCycles(value)
                    : onChangeTargetMinutes(value)
                }
                style={[styles.segment, selected && styles.segmentSelected]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    selected && styles.segmentTextSelected,
                  ]}
                >
                  {value}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.actionRow}>
        {status === "running" ? (
          <Pressable style={styles.primaryButton} onPress={onPause}>
            <Text style={styles.primaryText}>Pause</Text>
          </Pressable>
        ) : status === "paused" ? (
          <Pressable style={styles.primaryButton} onPress={onResume}>
            <Text style={styles.primaryText}>Resume</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.primaryButton} onPress={onStart}>
            <Text style={styles.primaryText}>
              {status === "finished" ? "Start again" : "Start"}
            </Text>
          </Pressable>
        )}

        {active ? (
          <Pressable style={styles.secondaryButton} onPress={onStop}>
            <Text style={styles.secondaryText}>Stop</Text>
          </Pressable>
        ) : status === "finished" ? (
          <Pressable style={styles.secondaryButton} onPress={onReset}>
            <Text style={styles.secondaryText}>Reset</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 6,
  },
  segmentGroup: {
    marginBottom: 14,
  },
  segmentLabel: {
    color: "#163B35",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  segments: {
    backgroundColor: "#EEF5F2",
    borderRadius: 8,
    flexDirection: "row",
    padding: 4,
  },
  segment: {
    alignItems: "center",
    borderRadius: 6,
    flex: 1,
    height: 40,
    justifyContent: "center",
  },
  segmentSelected: {
    backgroundColor: "#2A6F68",
  },
  segmentText: {
    color: "#5D6D69",
    fontSize: 15,
    fontWeight: "800",
  },
  segmentTextSelected: {
    color: "#FFFFFF",
  },
  actionRow: {
    flexDirection: "row",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#2A6F68",
    borderRadius: 8,
    flex: 1,
    height: 54,
    justifyContent: "center",
    marginRight: 10,
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#E06C5F",
    borderRadius: 8,
    borderWidth: 1,
    height: 54,
    justifyContent: "center",
    width: 92,
  },
  secondaryText: {
    color: "#B24D43",
    fontSize: 15,
    fontWeight: "800",
  },
});
