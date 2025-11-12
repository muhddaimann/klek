import * as React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";

export default function ALayout() {
  const { colors } = useTheme();

  return (
    <>
      <StatusBar style="light" backgroundColor={colors.primary} />
      <SafeAreaView
        edges={["top"]}
        style={{ backgroundColor: colors.primary }}
      />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        />
      </View>
    </>
  );
}
