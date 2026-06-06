import { StyleSheet, Switch, Text, View } from "react-native";

import { COLORS, RADII } from "@/constants/theme";
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
    <View style={styles.card}>
      <View style={styles.heading}>
        <Text style={styles.eyebrow}>Session cues</Text>
        <Text style={styles.title}>Feedback</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.toggleItem}>
          <Text style={styles.label}>Sound</Text>
          <Switch
            value={preferences.soundEnabled}
            onValueChange={(soundEnabled) =>
              onChange({ ...preferences, soundEnabled })
            }
            trackColor={{ false: COLORS.borderStrong, true: COLORS.greenMuted }}
            thumbColor={preferences.soundEnabled ? COLORS.green : COLORS.muted}
          />
        </View>
        <View style={styles.toggleItem}>
          <Text style={styles.label}>Haptics</Text>
          <Switch
            value={preferences.hapticsEnabled}
            onValueChange={(hapticsEnabled) =>
              onChange({ ...preferences, hapticsEnabled })
            }
            trackColor={{ false: COLORS.borderStrong, true: COLORS.greenMuted }}
            thumbColor={preferences.hapticsEnabled ? COLORS.green : COLORS.muted}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADII.medium,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    padding: 16,
  },
  heading: {
    marginRight: 12,
  },
  eyebrow: {
    color: COLORS.dim,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.3,
    textTransform: "uppercase",
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 3,
  },
  row: {
    flexDirection: "row",
  },
  toggleItem: {
    alignItems: "center",
    marginLeft: 12,
  },
  label: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 4,
    textTransform: "uppercase",
  },
});
