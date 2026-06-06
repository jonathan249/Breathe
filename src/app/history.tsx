import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  CalendarHeatmap,
  getLocalDateKey,
} from "@/components/CalendarHeatmap";
import { HistorySummary } from "@/components/HistorySummary";
import { SessionList } from "@/components/SessionList";
import { COLORS, RADII } from "@/constants/theme";
import { clearHistory, loadHistory } from "@/lib/historyStore";
import type { BreathSessionRecord } from "@/types/breath";

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function getCurrentStreak(sessions: BreathSessionRecord[]): number {
  const daysWithSessions = new Set(
    sessions.map((session) => getLocalDateKey(new Date(session.startedAt))),
  );
  let streak = 0;
  const cursor = new Date();

  while (daysWithSessions.has(getLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export default function HistoryScreen() {
  const [sessions, setSessions] = useState<BreathSessionRecord[]>([]);
  const [monthDate, setMonthDate] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    getLocalDateKey(new Date()),
  );

  const refreshHistory = useCallback(() => {
    loadHistory()
      .then((history) => setSessions(history.sessions))
      .catch(() => setSessions([]));
  }, []);

  useFocusEffect(refreshHistory);

  const selectedSessions = useMemo(
    () =>
      sessions
        .filter(
          (session) =>
            getLocalDateKey(new Date(session.startedAt)) === selectedDateKey,
        )
        .sort(
          (a, b) =>
            new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
        ),
    [selectedDateKey, sessions],
  );

  const totalMinutes = useMemo(
    () =>
      Math.round(
        sessions.reduce((total, session) => total + session.elapsedSeconds, 0) /
          60,
      ),
    [sessions],
  );

  const monthLabel = monthDate.toLocaleDateString([], {
    month: "long",
    year: "numeric",
  });
  const selectedDateLabel = new Date(`${selectedDateKey}T12:00:00`).toLocaleDateString(
    [],
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  function handleClearHistory() {
    Alert.alert("Clear history?", "This removes all locally saved sessions.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          clearHistory()
            .then(() => setSessions([]))
            .catch(() => undefined);
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Breathing data</Text>
            <Text style={styles.title}>History</Text>
            <Text style={styles.subtitle}>Your consistency, stored locally.</Text>
          </View>
          <View style={styles.dataBadge}>
            <View style={styles.dataDot} />
            <Text style={styles.dataBadgeText}>PRIVATE</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Overview</Text>
        <HistorySummary
          totalSessions={sessions.length}
          totalMinutes={totalMinutes}
          currentStreak={getCurrentStreak(sessions)}
        />

        <View style={styles.calendarCard}>
          <View style={styles.monthHeader}>
            <Pressable
              accessibilityLabel="Previous month"
              style={styles.monthButton}
              onPress={() => setMonthDate((current) => addMonths(current, -1))}
            >
              <Text style={styles.monthButtonText}>{"<"}</Text>
            </Pressable>
            <View style={styles.monthTitle}>
              <Text style={styles.monthEyebrow}>Activity map</Text>
              <Text style={styles.monthLabel}>{monthLabel}</Text>
            </View>
            <Pressable
              accessibilityLabel="Next month"
              style={styles.monthButton}
              onPress={() => setMonthDate((current) => addMonths(current, 1))}
            >
              <Text style={styles.monthButtonText}>{">"}</Text>
            </Pressable>
          </View>

          <CalendarHeatmap
            monthDate={monthDate}
            selectedDateKey={selectedDateKey}
            sessions={sessions}
            onSelectDate={setSelectedDateKey}
          />
        </View>

        <View style={styles.dayHeader}>
          <View>
            <Text style={styles.dayEyebrow}>Session log</Text>
            <Text style={styles.dayTitle}>{selectedDateLabel}</Text>
          </View>
          <View style={styles.dayCountBadge}>
            <Text style={styles.dayCount}>
              {selectedSessions.length} session
              {selectedSessions.length === 1 ? "" : "s"}
            </Text>
          </View>
        </View>

        <SessionList sessions={selectedSessions} />

        {sessions.length > 0 ? (
          <Pressable style={styles.clearButton} onPress={handleClearHistory}>
            <Text style={styles.clearText}>Clear history</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 36,
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  eyebrow: {
    color: COLORS.dim,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  title: {
    color: COLORS.text,
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  dataBadge: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADII.pill,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  dataDot: {
    backgroundColor: COLORS.green,
    borderRadius: RADII.pill,
    height: 6,
    marginRight: 7,
    width: 6,
  },
  dataBadgeText: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 12,
  },
  calendarCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADII.large,
    borderWidth: 1,
    marginBottom: 26,
    padding: 16,
  },
  monthHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  monthButton: {
    alignItems: "center",
    backgroundColor: COLORS.surfaceRaised,
    borderColor: COLORS.border,
    borderRadius: RADII.small,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  monthButtonText: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: "500",
    lineHeight: 24,
  },
  monthTitle: {
    alignItems: "center",
  },
  monthEyebrow: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  monthLabel: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },
  dayHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayEyebrow: {
    color: COLORS.dim,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  dayTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
  },
  dayCountBadge: {
    backgroundColor: COLORS.surfaceGreen,
    borderColor: "#145A3D",
    borderRadius: RADII.pill,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  dayCount: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  clearButton: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADII.medium,
    borderWidth: 1,
    marginTop: 18,
    padding: 14,
  },
  clearText: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});
