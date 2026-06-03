import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { formatDuration } from "@/lib/breathEngine";
import type { BreathPhaseType } from "@/types/breath";

type BreathAnimatorProps = {
  phaseLabel: string;
  phaseType: BreathPhaseType;
  phaseRemaining: number;
  phaseSeconds: number;
  isActive: boolean;
};

function targetScaleForPhase(phaseType: BreathPhaseType): number {
  if (phaseType === "inhale" || phaseType === "topUpInhale") {
    return 1;
  }

  if (phaseType === "exhale") {
    return 0.58;
  }

  return 0.78;
}

export function BreathAnimator({
  phaseLabel,
  phaseType,
  phaseRemaining,
  phaseSeconds,
  isActive,
}: BreathAnimatorProps) {
  const [scale] = useState(() => new Animated.Value(0.7));

  useEffect(() => {
    Animated.timing(scale, {
      toValue: isActive ? targetScaleForPhase(phaseType) : 0.7,
      duration: Math.max(120, phaseSeconds * 1000),
      useNativeDriver: false,
    }).start();
  }, [isActive, phaseSeconds, phaseType, scale]);

  return (
    <View style={styles.stage}>
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale }],
          },
        ]}
      >
        <View style={styles.innerCircle}>
          <Text style={styles.phase}>{isActive ? phaseLabel : "Ready"}</Text>
          <Text style={styles.countdown}>
            {isActive ? Math.ceil(phaseRemaining).toString() : "Start"}
          </Text>
        </View>
      </Animated.View>
      <Text style={styles.caption}>
        {isActive ? `${formatDuration(phaseRemaining)} left in this phase` : "Choose a mode and begin"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
    paddingVertical: 16,
  },
  circle: {
    alignItems: "center",
    backgroundColor: "#D9F0EC",
    borderColor: "#2A6F68",
    borderRadius: 130,
    borderWidth: 2,
    height: 260,
    justifyContent: "center",
    width: 260,
  },
  innerCircle: {
    alignItems: "center",
    backgroundColor: "#F7F1E8",
    borderRadius: 90,
    height: 180,
    justifyContent: "center",
    width: 180,
  },
  phase: {
    color: "#163B35",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  countdown: {
    color: "#E06C5F",
    fontSize: 54,
    fontWeight: "800",
    lineHeight: 60,
  },
  caption: {
    color: "#5D6D69",
    fontSize: 14,
    marginTop: 10,
  },
});
