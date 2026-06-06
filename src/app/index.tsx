import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BreathAnimator } from "@/components/BreathAnimator";
import { ModeSelector } from "@/components/ModeSelector";
import { PreferenceToggles } from "@/components/PreferenceToggles";
import { SessionControls } from "@/components/SessionControls";
import { BREATH_MODES } from "@/constants/breathModes";
import { COLORS, RADII } from "@/constants/theme";
import { useBreathSession } from "@/hooks/useBreathSession";
import { formatDuration } from "@/lib/breathEngine";
import {
  DEFAULT_PREFERENCES,
  loadPreferences,
  savePreferences,
} from "@/lib/historyStore";
import type { BreathMode, BreathPreferences } from "@/types/breath";

export default function Index() {
  const [selectedMode, setSelectedMode] = useState<BreathMode>(BREATH_MODES[0]);
  const [targetMinutes, setTargetMinutes] = useState(5);
  const [targetCycles, setTargetCycles] = useState(4);
  const [preferences, setPreferences] =
    useState<BreathPreferences>(DEFAULT_PREFERENCES);
  const session = useBreathSession(preferences);
  const active = session.status === "running" || session.status === "paused";
  const displayMode = session.mode ?? selectedMode;
  const displayPhase = session.phaseInfo ?? {
    phase: displayMode.phases[0],
    phaseIndex: 0,
    phaseElapsed: 0,
    phaseRemaining: displayMode.phases[0].seconds,
    cycleIndex: 0,
  };
  const isRunning = session.status === "running";
  const dateLabel = new Date().toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const progress =
    session.targetSeconds > 0
      ? Math.min(1, session.elapsedSeconds / session.targetSeconds)
      : 0;

  useEffect(() => {
    let mounted = true;

    loadPreferences()
      .then((storedPreferences) => {
        if (mounted) {
          setPreferences(storedPreferences);
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const progressLabel = useMemo(() => {
    if (session.status === "idle") {
      return selectedMode.defaultCycles
        ? `${targetCycles} cycles`
        : `${targetMinutes} minutes`;
    }

    return `${formatDuration(session.elapsedSeconds)} / ${formatDuration(session.targetSeconds)}`;
  }, [
    selectedMode.defaultCycles,
    session.elapsedSeconds,
    session.status,
    session.targetSeconds,
    targetCycles,
    targetMinutes,
  ]);

  function handlePreferenceChange(nextPreferences: BreathPreferences) {
    setPreferences(nextPreferences);
    void savePreferences(nextPreferences);
  }

  function handleSelectMode(mode: BreathMode) {
    setSelectedMode(mode);
    setTargetMinutes(mode.defaultMinutes ?? 5);
    setTargetCycles(mode.defaultCycles ?? 4);
  }

  function handleStart() {
    session.start(selectedMode, {
      targetMinutes: selectedMode.defaultCycles ? undefined : targetMinutes,
      targetCycles: selectedMode.defaultCycles ? targetCycles : undefined,
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.date}>{dateLabel}</Text>
            <Text style={styles.title}>Breathe</Text>
          </View>
          <View style={styles.statusOrb}>
            <View style={styles.statusOrbInner} />
          </View>
        </View>

        <View style={styles.snapshotHeader}>
          <Text style={styles.sectionTitle}>Snapshot</Text>
          <Text style={styles.snapshotMeta}>LOCAL SESSION</Text>
        </View>

        <View style={styles.snapshotRow}>
          <View style={[styles.snapshotCard, styles.snapshotCardAccent]}>
            <Text style={styles.snapshotLabel}>Mode</Text>
            <Text style={[styles.snapshotValue, styles.snapshotValueAccent]}>
              {selectedMode.shortName}
            </Text>
          </View>
          <View style={styles.snapshotCard}>
            <Text style={styles.snapshotLabel}>Target</Text>
            <Text style={styles.snapshotValue}>
              {selectedMode.defaultCycles ? targetCycles : targetMinutes}
              <Text style={styles.snapshotUnit}>
                {selectedMode.defaultCycles ? " cyc" : " min"}
              </Text>
            </Text>
          </View>
          <View style={styles.snapshotCard}>
            <Text style={styles.snapshotLabel}>Cycles</Text>
            <Text style={styles.snapshotValue}>{session.completedCycles}</Text>
          </View>
        </View>

        <ModeSelector
          modes={BREATH_MODES}
          selectedModeId={selectedMode.id}
          disabled={active}
          onSelectMode={handleSelectMode}
        />

        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroPill}>
              <View style={styles.liveDot} />
              <Text style={styles.heroPillText}>
                {active ? "Live session" : "Breath session"}
              </Text>
            </View>
            <Text style={styles.heroStatus}>
              {session.status === "idle" ? "READY" : session.status.toUpperCase()}
            </Text>
          </View>

          <Text style={styles.modeTitle}>{displayMode.name}</Text>
          <Text style={styles.modeText}>{displayMode.description}</Text>

          <BreathAnimator
            phaseLabel={displayPhase.phase.label}
            phaseType={displayPhase.phase.type}
            phaseRemaining={displayPhase.phaseRemaining}
            phaseSeconds={displayPhase.phase.seconds}
            isActive={session.status !== "idle"}
          />

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>

          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{progressLabel}</Text>
              <Text style={styles.metricLabel}>Session progress</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{session.completedCycles}</Text>
              <Text style={styles.metricLabel}>Cycles complete</Text>
            </View>
          </View>
        </View>

        <SessionControls
          mode={selectedMode}
          status={session.status}
          targetMinutes={targetMinutes}
          targetCycles={targetCycles}
          onChangeTargetMinutes={setTargetMinutes}
          onChangeTargetCycles={setTargetCycles}
          onStart={handleStart}
          onPause={session.pause}
          onResume={session.resume}
          onStop={() => void session.stop()}
          onReset={session.reset}
        />

        <PreferenceToggles
          preferences={preferences}
          onChange={handlePreferenceChange}
        />

        <View style={styles.safety}>
          <View style={styles.safetyLine} />
          <Text style={styles.safetyText}>
            {displayMode.beginnerNote ??
              "Stop if you feel dizzy or light-headed. This is a wellness tool, not medical advice."}
          </Text>
          {isRunning ? (
            <Text style={styles.runningText}>Follow cue at comfortable pace.</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 36,
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  date: {
    color: COLORS.dim,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  title: {
    color: COLORS.text,
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  statusOrb: {
    alignItems: "center",
    borderColor: COLORS.borderStrong,
    borderRadius: RADII.pill,
    borderWidth: 2,
    height: 48,
    justifyContent: "center",
    marginTop: 2,
    width: 48,
  },
  statusOrbInner: {
    borderColor: COLORS.green,
    borderRadius: RADII.pill,
    borderWidth: 3,
    height: 30,
    width: 30,
  },
  snapshotHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
  },
  snapshotMeta: {
    color: COLORS.dim,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  snapshotRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  snapshotCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: RADII.medium,
    borderWidth: 1,
    flex: 1,
    height: 96,
    justifyContent: "center",
    padding: 14,
  },
  snapshotCardAccent: {
    backgroundColor: COLORS.surfaceGreen,
    borderColor: "#145A3D",
  },
  snapshotLabel: {
    color: COLORS.dim,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  snapshotValue: {
    color: COLORS.text,
    fontSize: 21,
    fontVariant: ["tabular-nums"],
    fontWeight: "500",
  },
  snapshotValueAccent: {
    color: COLORS.green,
    fontSize: 18,
  },
  snapshotUnit: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  heroCard: {
    backgroundColor: COLORS.surfaceGreen,
    borderColor: "#123A2A",
    borderRadius: RADII.large,
    borderWidth: 1,
    overflow: "hidden",
    padding: 18,
  },
  heroHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  heroPill: {
    alignItems: "center",
    backgroundColor: "#102A20",
    borderRadius: RADII.pill,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  liveDot: {
    backgroundColor: COLORS.green,
    borderRadius: RADII.pill,
    height: 7,
    marginRight: 8,
    width: 7,
  },
  heroPillText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heroStatus: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  modeTitle: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  modeText: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 330,
  },
  progressTrack: {
    backgroundColor: "#163326",
    borderRadius: RADII.pill,
    height: 4,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: COLORS.green,
    borderRadius: RADII.pill,
    height: 4,
  },
  metrics: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  metric: {
    flex: 1,
  },
  metricValue: {
    color: COLORS.text,
    fontSize: 18,
    fontVariant: ["tabular-nums"],
    fontWeight: "600",
    marginBottom: 5,
  },
  metricLabel: {
    color: COLORS.dim,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  metricDivider: {
    backgroundColor: "#234233",
    height: 36,
    marginHorizontal: 18,
    width: 1,
  },
  safety: {
    marginTop: 22,
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
  safetyLine: {
    backgroundColor: COLORS.border,
    height: 1,
    marginBottom: 18,
  },
  safetyText: {
    color: COLORS.dim,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
  runningText: {
    color: COLORS.green,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginTop: 8,
    textAlign: "center",
    textTransform: "uppercase",
  },
});
