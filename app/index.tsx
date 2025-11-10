import React from "react";
import { View } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { useTheme, Text } from "react-native-paper";
import { useAuth } from "../contexts/authContext";
import { useDesign } from "../contexts/designContext";
import { Button } from "../components/atom/button";

export default function Index() {
  const { isAuthenticated, bootstrapped } = useAuth();
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const router = useRouter();

  if (!bootstrapped) return null;
  if (isAuthenticated) return <Redirect href="/(tabs)/a" />;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: tokens.spacing.lg,
        justifyContent: "center",
        gap: tokens.spacing.xl,
      }}
    >
      <View style={{ alignItems: "center", gap: tokens.spacing.xs }}>
        <Text
          style={{
            color: colors.onBackground,
            fontSize: tokens.typography.sizes["2xl"],
            fontWeight: "700",
          }}
        >
          Welcome
        </Text>
        <Text style={{ color: colors.onSurfaceVariant }}>
          Sign in or create an account to continue
        </Text>
      </View>

      <View style={{ gap: tokens.spacing.md }}>
        <Button
          onPress={() => router.push("/(modals)/signIn")}
          mode="contained"
        >
          Sign In
        </Button>
        <Button onPress={() => router.push("/(modals)/signUp")} mode="outlined">
          Create Account
        </Button>
      </View>

      <View style={{ alignItems: "center" }}>
        <Button
          mode="text"
          onPress={() => router.push("/(modals)/forgot")}
        >
          Forgot password?
        </Button>
      </View>
    </View>
  );
}
