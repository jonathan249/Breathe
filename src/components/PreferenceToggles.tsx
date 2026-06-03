import { StyleSheet, Switch, Text, View } from "react-native";

import type { BreathPreferences } from "@/types/breath";

type PreferenceTogglesProps = {
  preferences: BreathPreferences;
  onChange: (preferences: BreathPreferences) => void;
};

export function PreferenceToggles({
  preferences,
  onChange,
}: PreferenceTogglesProps) {
  return (
    <View style={styles.row}>
      <View style={styles.toggleItem}>
        <Text style={styles.label}>Sound</Text>
        <Switch
          value={preferences.soundEnabled}
          onValueChange={(soundEnabled) =>
            onChange({ ...preferences, soundEnabled })
          }
          trackColor={{ false: "#CCD4D1", true: "#9DD5CC" }}
          thumbColor={preferences.soundEnabled ? "#2A6F68" : "#F7F1E8"}
        />
      </View>
      <View style={styles.toggleItem}>
        <Text style={styles.label}>Haptics</Text>
        <Switch
          value={preferences.hapticsEnabled}
          onValueChange={(hapticsEnabled) =>
            onChange({ ...preferences, hapticsEnabled })
          }
          trackColor={{ false: "#CCD4D1", true: "#9DD5CC" }}
          thumbColor={preferences.hapticsEnabled ? "#2A6F68" : "#F7F1E8"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  toggleItem: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 14,
  },
  label: {
    color: "#5D6D69",
    fontSize: 13,
    fontWeight: "700",
    marginRight: 6,
  },
});
