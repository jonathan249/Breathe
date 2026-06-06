import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { formatDuration } from "@/lib/breathEngine";
import { COLORS, RADII } from "@/constants/theme";
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
      useNativeDriver: true,
    }).start();
  }, [isActive, phaseSeconds, phaseType, scale]);

  return (
    <View style={styles.stage}>
      <View style={styles.orbit}>
        <View style={[styles.orbitDot, styles.orbitDotTop]} />
        <View style={[styles.orbitDot, styles.orbitDotRight]} />
        <View style={[styles.orbitDot, styles.orbitDotBottom]} />
        <Animated.View
          style={[
            styles.aura,
            {
              transform: [{ scale }],
            },
          ]}
        />
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
              {isActive ? Math.ceil(phaseRemaining).toString() : "GO"}
            </Text>
            <Text style={styles.unit}>{isActive ? "SECONDS" : "WHEN READY"}</Text>
          </View>
        </Animated.View>
      </View>
      <Text style={styles.caption}>
        {isActive
          ? `${formatDuration(phaseRemaining)} remaining in phase`
          : "Follow ring at comfortable pace"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 330,
    paddingTop: 8,
  },
  orbit: {
    alignItems: "center",
    height: 286,
    justifyContent: "center",
    width: 286,
  },
  aura: {
    backgroundColor: COLORS.greenMuted,
    borderRadius: RADII.pill,
    height: 246,
    opacity: 0.58,
    position: "absolute",
    width: 246,
  },
  circle: {
    alignItems: "center",
    backgroundColor: "#0B2B1E",
    borderColor: COLORS.green,
    borderRadius: RADII.pill,
    borderWidth: 3,
    height: 230,
    justifyContent: "center",
    shadowColor: COLORS.green,
    shadowOpacity: 0.35,
    shadowRadius: 28,
    width: 230,
  },
  innerCircle: {
    alignItems: "center",
    backgroundColor: COLORS.black,
    borderColor: "#145A3D",
    borderRadius: RADII.pill,
    borderWidth: 1,
    height: 174,
    justifyContent: "center",
    width: 174,
  },
  phase: {
    color: COLORS.green,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginBottom: 2,
    textAlign: "center",
    textTransform: "uppercase",
  },
  countdown: {
    color: COLORS.text,
    fontSize: 70,
    fontVariant: ["tabular-nums"],
    fontWeight: "300",
    lineHeight: 76,
  },
  unit: {
    color: COLORS.dim,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.6,
  },
  caption: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    marginTop: 4,
    textTransform: "uppercase",
  },
  orbitDot: {
    backgroundColor: COLORS.green,
    borderRadius: RADII.pill,
    height: 7,
    position: "absolute",
    width: 7,
  },
  orbitDotTop: {
    left: 139,
    top: 5,
  },
  orbitDotRight: {
    opacity: 0.45,
    right: 20,
    top: 70,
  },
  orbitDotBottom: {
    bottom: 19,
    left: 64,
    opacity: 0.2,
  },
});
