import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";

import { COLORS } from "@/constants/theme";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: COLORS.background,
        },
        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: COLORS.dim,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 76,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "800",
          letterSpacing: 1.2,
          textTransform: "uppercase",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Breathe",
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={{ ios: "wind", android: "air", web: "air" }}
              tintColor={color}
              size={focused ? 27 : 24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={{
                ios: "chart.bar.xaxis",
                android: "monitoring",
                web: "monitoring",
              }}
              tintColor={color}
              size={focused ? 27 : 24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
