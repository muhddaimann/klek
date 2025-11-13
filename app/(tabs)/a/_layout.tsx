import * as React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";

export default function HomeLayout() {
  const { colors, dark } = useTheme();

  return (
    <>
      <StatusBar
        style={dark ? "light" : "dark"}
        backgroundColor={colors.background}
      />
      <SafeAreaView
        edges={["top"]}
        style={{ backgroundColor: colors.background }}
      />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="claim"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="settlement"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </View>
    </>
  );
}
