import { StyleSheet, Text, View } from "react-native";

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
      <SummaryItem label="Sessions" value={totalSessions.toString()} />
      <SummaryItem label="Minutes" value={totalMinutes.toString()} />
      <SummaryItem label="Streak" value={`${currentStreak}d`} />
    </View>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.item}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 18,
  },
  item: {
    backgroundColor: "#EEF5F2",
    borderColor: "#D6E2DE",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    height: 76,
    justifyContent: "center",
    marginRight: 8,
    paddingHorizontal: 12,
  },
  value: {
    color: "#163B35",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 2,
  },
  label: {
    color: "#5D6D69",
    fontSize: 12,
    fontWeight: "700",
  },
});
