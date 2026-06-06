import { StyleSheet, Text, View } from "react-native";

import { COLORS, RADII } from "@/constants/theme";

type HistorySummaryProps = {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
};

export function HistorySummary({
  totalSessions,
  totalMinutes,
  currentStreak,
}: HistorySummaryProps) {
  return (
    <View style={styles.row}>
      <SummaryItem label="Sessions" value={totalSessions.toString()} accent />
      <SummaryItem label="Minutes" value={totalMinutes.toString()} />
      <SummaryItem label="Streak" value={`${currentStreak}d`} />
    </View>
  );
}

function SummaryItem({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View style={[styles.item, accent && styles.itemAccent]}>
      <View style={[styles.indicator, accent && styles.indicatorAccent]} />
      <Text style={[styles.value, accent && styles.valueAccent]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  item: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADII.medium,
    borderWidth: 1,
    flex: 1,
    height: 112,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  itemAccent: {
    backgroundColor: COLORS.surfaceGreen,
    borderColor: "#135A3E",
  },
  indicator: {
    backgroundColor: COLORS.borderStrong,
    borderRadius: RADII.pill,
    height: 4,
    marginBottom: 13,
    width: 22,
  },
  indicatorAccent: {
    backgroundColor: COLORS.green,
  },
  value: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "500",
    marginBottom: 2,
  },
  valueAccent: {
    color: COLORS.green,
  },
  label: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});
