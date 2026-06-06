import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS, RADII } from "@/constants/theme";
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
        <View style={styles.segmentHeader}>
          <Text style={styles.segmentLabel}>Session length</Text>
          <Text style={styles.segmentUnit}>{cycleBased ? "Cycles" : "Minutes"}</Text>
        </View>
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
    marginTop: 18,
  },
  segmentGroup: {
    marginBottom: 16,
  },
  segmentHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  segmentLabel: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 10,
  },
  segmentUnit: {
    color: COLORS.dim,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  segments: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADII.medium,
    borderWidth: 1,
    flexDirection: "row",
    padding: 5,
  },
  segment: {
    alignItems: "center",
    borderRadius: RADII.small,
    flex: 1,
    height: 44,
    justifyContent: "center",
  },
  segmentSelected: {
    backgroundColor: COLORS.greenMuted,
    borderColor: COLORS.green,
    borderWidth: 1,
  },
  segmentText: {
    color: COLORS.muted,
    fontSize: 15,
    fontWeight: "800",
  },
  segmentTextSelected: {
    color: COLORS.green,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: COLORS.green,
    borderRadius: RADII.medium,
    flex: 1,
    height: 58,
    justifyContent: "center",
  },
  primaryText: {
    color: COLORS.black,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderColor: COLORS.borderStrong,
    borderRadius: RADII.medium,
    borderWidth: 1,
    height: 58,
    justifyContent: "center",
    width: 100,
  },
  secondaryText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
  },
});
