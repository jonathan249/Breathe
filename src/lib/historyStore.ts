import AsyncStorage from "@react-native-async-storage/async-storage";

import type {
  BreathPreferences,
  BreathSessionRecord,
  HistoryStateV1,
} from "@/types/breath";

export const HISTORY_STORAGE_KEY = "@breathe/history:v1";
export const PREFERENCES_STORAGE_KEY = "@breathe/preferences:v1";

const EMPTY_HISTORY: HistoryStateV1 = {
  version: 1,
  sessions: [],
};

export const DEFAULT_PREFERENCES: BreathPreferences = {
  soundEnabled: true,
  hapticsEnabled: true,
};

function isHistoryState(value: unknown): value is HistoryStateV1 {
  return (
    typeof value === "object" &&
    value !== null &&
    "version" in value &&
    value.version === 1 &&
    "sessions" in value &&
    Array.isArray(value.sessions)
  );
}

export async function loadHistory(): Promise<HistoryStateV1> {
  const rawHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);

  if (!rawHistory) {
    return EMPTY_HISTORY;
  }

  try {
    const parsedHistory = JSON.parse(rawHistory);
    return isHistoryState(parsedHistory) ? parsedHistory : EMPTY_HISTORY;
  } catch {
    return EMPTY_HISTORY;
  }
}

export async function saveSession(
  record: BreathSessionRecord,
): Promise<void> {
  const history = await loadHistory();
  const sessions = [record, ...history.sessions].slice(0, 500);

  await AsyncStorage.setItem(
    HISTORY_STORAGE_KEY,
    JSON.stringify({ version: 1, sessions }),
  );
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(EMPTY_HISTORY));
}

export async function loadPreferences(): Promise<BreathPreferences> {
  const rawPreferences = await AsyncStorage.getItem(PREFERENCES_STORAGE_KEY);

  if (!rawPreferences) {
    return DEFAULT_PREFERENCES;
  }

  try {
    const parsedPreferences = JSON.parse(rawPreferences);
    return {
      soundEnabled:
        typeof parsedPreferences.soundEnabled === "boolean"
          ? parsedPreferences.soundEnabled
          : DEFAULT_PREFERENCES.soundEnabled,
      hapticsEnabled:
        typeof parsedPreferences.hapticsEnabled === "boolean"
          ? parsedPreferences.hapticsEnabled
          : DEFAULT_PREFERENCES.hapticsEnabled,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export async function savePreferences(
  preferences: BreathPreferences,
): Promise<void> {
  await AsyncStorage.setItem(
    PREFERENCES_STORAGE_KEY,
    JSON.stringify(preferences),
  );
}
