import { StyleSheet, Text, View } from "react-native";

import { COLORS, RADII } from "@/constants/theme";
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
            <View style={styles.sessionMarker} />
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
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADII.medium,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
    minHeight: 78,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sessionMarker: {
    backgroundColor: COLORS.green,
    borderRadius: RADII.pill,
    height: 36,
    opacity: 0.85,
    width: 4,
  },
  mode: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  meta: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  trailing: {
    alignItems: "flex-end",
    marginLeft: "auto",
  },
  duration: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: "800",
  },
  completed: {
    color: COLORS.green,
  },
  partial: {
    color: COLORS.amber,
  },
  empty: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADII.medium,
    borderWidth: 1,
    marginTop: 10,
    padding: 22,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: "center",
  },
});
