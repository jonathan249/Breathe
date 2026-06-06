import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { COLORS, RADII } from "@/constants/theme";
import type { BreathMode, BreathModeId } from "@/types/breath";

type ModeSelectorProps = {
  modes: BreathMode[];
  selectedModeId: BreathModeId;
  disabled?: boolean;
  onSelectMode: (mode: BreathMode) => void;
};

export function ModeSelector({
  modes,
  selectedModeId,
  disabled,
  onSelectMode,
}: ModeSelectorProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.sectionHeader}>
        <Text style={styles.label}>Breathing modes</Text>
        <Text style={styles.hint}>Swipe to explore</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {modes.map((mode) => {
          const selected = mode.id === selectedModeId;

          return (
            <Pressable
              key={mode.id}
              disabled={disabled}
              onPress={() => onSelectMode(mode)}
              style={[
                styles.card,
                selected && styles.cardSelected,
                disabled && styles.disabled,
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.dot, selected && styles.dotSelected]} />
                <Text
                  style={[styles.pattern, selected && styles.patternSelected]}
                >
                  {mode.shortName}
                </Text>
              </View>
              <Text style={[styles.name, selected && styles.nameSelected]}>
                {mode.name}
              </Text>
              <Text style={styles.description}>{mode.bestFor}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 22,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 12,
  },
  hint: {
    color: COLORS.dim,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.7,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  list: {
    paddingRight: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADII.medium,
    borderWidth: 1,
    height: 132,
    justifyContent: "space-between",
    marginRight: 12,
    padding: 14,
    width: 166,
  },
  cardSelected: {
    backgroundColor: COLORS.surfaceGreen,
    borderColor: COLORS.green,
  },
  disabled: {
    opacity: 0.72,
  },
  name: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
  },
  nameSelected: {
    color: COLORS.green,
  },
  pattern: {
    color: COLORS.dim,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  patternSelected: {
    color: COLORS.green,
  },
  description: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 15,
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
  },
  dot: {
    backgroundColor: COLORS.dim,
    borderRadius: RADII.pill,
    height: 6,
    marginRight: 7,
    width: 6,
  },
  dotSelected: {
    backgroundColor: COLORS.green,
  },
});
