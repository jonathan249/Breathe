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
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>History</Text>
            <Text style={styles.subtitle}>Local calendar view</Text>
          </View>
        </View>

        <HistorySummary
          totalSessions={sessions.length}
          totalMinutes={totalMinutes}
          currentStreak={getCurrentStreak(sessions)}
        />

        <View style={styles.monthHeader}>
          <Pressable
            accessibilityLabel="Previous month"
            style={styles.monthButton}
            onPress={() => setMonthDate((current) => addMonths(current, -1))}
          >
            <Text style={styles.monthButtonText}>{"<"}</Text>
          </Pressable>
          <Text style={styles.monthLabel}>{monthLabel}</Text>
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

        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>{selectedDateLabel}</Text>
          <Text style={styles.dayCount}>
            {selectedSessions.length} session{selectedSessions.length === 1 ? "" : "s"}
          </Text>
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
    backgroundColor: "#F7F1E8",
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: {
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
  monthHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  monthButton: {
    alignItems: "center",
    backgroundColor: "#EEF5F2",
    borderColor: "#D6E2DE",
    borderRadius: 8,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  monthButtonText: {
    color: "#163B35",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 24,
  },
  monthLabel: {
    color: "#163B35",
    fontSize: 20,
    fontWeight: "900",
  },
  dayHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayTitle: {
    color: "#1D2523",
    fontSize: 20,
    fontWeight: "900",
  },
  dayCount: {
    color: "#5D6D69",
    fontSize: 13,
    fontWeight: "700",
  },
  clearButton: {
    alignItems: "center",
    marginTop: 18,
    padding: 12,
  },
  clearText: {
    color: "#B24D43",
    fontSize: 14,
    fontWeight: "800",
  },
});
