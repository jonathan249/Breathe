import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS, RADII } from "@/constants/theme";
import type { BreathSessionRecord } from "@/types/breath";

type CalendarHeatmapProps = {
  monthDate: Date;
  selectedDateKey: string;
  sessions: BreathSessionRecord[];
  onSelectDate: (dateKey: string) => void;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function CalendarHeatmap({
  monthDate,
  selectedDateKey,
  sessions,
  onSelectDate,
}: CalendarHeatmapProps) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();
  const todayKey = getLocalDateKey(new Date());
  const minutesByDay = new Map<string, number>();

  for (const session of sessions) {
    const dateKey = getLocalDateKey(new Date(session.startedAt));
    minutesByDay.set(
      dateKey,
      (minutesByDay.get(dateKey) ?? 0) + session.elapsedSeconds / 60,
    );
  }

  const cells = [
    ...Array.from({ length: leadingBlanks }, (_, index) => ({
      key: `blank-${index}`,
      day: null,
      dateKey: "",
    })),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      return {
        key: day.toString(),
        day,
        dateKey: getLocalDateKey(new Date(year, month, day)),
      };
    }),
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.weekRow}>
        {WEEKDAYS.map((weekday) => (
          <Text key={weekday} style={styles.weekday}>
            {weekday}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((cell) => {
          if (!cell.day) {
            return <View key={cell.key} style={styles.blankCell} />;
          }

          const minutes = minutesByDay.get(cell.dateKey) ?? 0;
          const selected = cell.dateKey === selectedDateKey;
          const today = cell.dateKey === todayKey;

          return (
            <Pressable
              key={cell.key}
              onPress={() => onSelectDate(cell.dateKey)}
              style={[
                styles.dayCell,
                minutes > 0 && styles.levelOne,
                minutes >= 5 && styles.levelTwo,
                minutes >= 15 && styles.levelThree,
                today && styles.today,
                selected && styles.selected,
              ]}
            >
              <Text style={[styles.dayText, minutes >= 15 && styles.dayTextStrong]}>
                {cell.day}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18,
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekday: {
    color: COLORS.dim,
    flex: 1,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  blankCell: {
    aspectRatio: 1,
    marginBottom: 6,
    marginHorizontal: "0.7%",
    width: "12.85%",
  },
  dayCell: {
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: COLORS.surfaceRaised,
    borderColor: COLORS.border,
    borderRadius: RADII.small,
    borderWidth: 1,
    justifyContent: "center",
    marginBottom: 6,
    marginHorizontal: "0.7%",
    width: "12.85%",
  },
  levelOne: {
    backgroundColor: "#0C3021",
    borderColor: "#145A3D",
  },
  levelTwo: {
    backgroundColor: "#087044",
    borderColor: "#0A9B5B",
  },
  levelThree: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  today: {
    borderColor: COLORS.amber,
    borderWidth: 2,
  },
  selected: {
    borderColor: COLORS.text,
    borderWidth: 2,
  },
  dayText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "800",
  },
  dayTextStrong: {
    color: COLORS.black,
  },
});
