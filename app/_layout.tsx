import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "react-native-paper";
import { ThemeProvider } from "../contexts/themeContext";
import { DesignProvider } from "../contexts/designContext";

function AppShell() {
  const { dark, colors } = useTheme();
  return (
    <>
      <StatusBar style={dark ? "light" : "dark"} />
      <SafeAreaView
        edges={["top"]}
        style={{ backgroundColor: colors.background }}
      />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <DesignProvider>
            <AppShell />
          </DesignProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
