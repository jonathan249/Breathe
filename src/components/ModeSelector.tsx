import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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
      <Text style={styles.label}>Mode</Text>
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
              style={[styles.card, selected && styles.cardSelected, disabled && styles.disabled]}
            >
              <Text style={[styles.name, selected && styles.nameSelected]}>
                {mode.name}
              </Text>
              <Text style={styles.pattern}>{mode.shortName}</Text>
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
    marginBottom: 14,
  },
  label: {
    color: "#163B35",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  list: {
    paddingRight: 20,
  },
  card: {
    backgroundColor: "#EEF5F2",
    borderColor: "#C9DAD5",
    borderRadius: 8,
    borderWidth: 1,
    height: 128,
    justifyContent: "space-between",
    marginRight: 10,
    padding: 12,
    width: 174,
  },
  cardSelected: {
    backgroundColor: "#D9F0EC",
    borderColor: "#2A6F68",
  },
  disabled: {
    opacity: 0.72,
  },
  name: {
    color: "#1D2523",
    fontSize: 18,
    fontWeight: "800",
  },
  nameSelected: {
    color: "#163B35",
  },
  pattern: {
    color: "#E06C5F",
    fontSize: 14,
    fontWeight: "700",
  },
  description: {
    color: "#5D6D69",
    fontSize: 12,
    lineHeight: 16,
  },
});
