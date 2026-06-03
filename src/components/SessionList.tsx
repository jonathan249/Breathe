import { StyleSheet, Text, View } from "react-native";

import { formatDuration } from "@/lib/breathEngine";
import type { BreathSessionRecord } from "@/types/breath";

type SessionListProps = {
  sessions: BreathSessionRecord[];
};

export function SessionList({ sessions }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No sessions</Text>
        <Text style={styles.emptyText}>Saved breath work sessions will appear here.</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {sessions.map((session) => {
        const startedAt = new Date(session.startedAt);

        return (
          <View key={session.id} style={styles.item}>
            <View>
              <Text style={styles.mode}>{session.modeName}</Text>
              <Text style={styles.meta}>
                {startedAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                | {session.completedCycles} cycles
              </Text>
            </View>
            <View style={styles.trailing}>
              <Text style={styles.duration}>
                {formatDuration(session.elapsedSeconds)}
              </Text>
              <Text
                style={[
                  styles.status,
                  session.completed ? styles.completed : styles.partial,
                ]}
              >
                {session.completed ? "Complete" : "Partial"}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 10,
  },
  item: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E4DCD0",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    minHeight: 70,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  mode: {
    color: "#1D2523",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  meta: {
    color: "#5D6D69",
    fontSize: 12,
    fontWeight: "600",
  },
  trailing: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  duration: {
    color: "#163B35",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: "800",
  },
  completed: {
    color: "#2A6F68",
  },
  partial: {
    color: "#B24D43",
  },
  empty: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E4DCD0",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
    padding: 22,
  },
  emptyTitle: {
    color: "#1D2523",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  emptyText: {
    color: "#5D6D69",
    fontSize: 13,
    textAlign: "center",
  },
});
