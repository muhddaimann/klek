import React from "react";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";
import { HomeIcon, CogIcon } from "lucide-react-native";
import { TabProvider } from "../../contexts/tabContext";
import FloatingTabBar from "../../components/shared/tabBar";

function InnerTabs() {
  const { colors } = useTheme();
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
      }}
    >
      <Tabs.Screen
        name="a"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="b"
        options={{
          title: "Settings",
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <CogIcon color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabsLayout() {
  return (
    <TabProvider>
      <InnerTabs />
    </TabProvider>
  );
}
