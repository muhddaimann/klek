import React, { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme, Text } from "react-native-paper";
import { useDesign } from "../contexts/designContext";
import { useAuth } from "../contexts/authContext";
import { Button } from "../components/atom/button";
import Logo from "../components/shared/logo";

export default function Index() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const router = useRouter();
  const { isAuthenticated, bootstrapped } = useAuth();

  useEffect(() => {
    if (bootstrapped && isAuthenticated) router.replace("/welcome");
  }, [bootstrapped, isAuthenticated, router]);

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
      <View style={{ alignItems: "center", gap: tokens.spacing.sm }}>
        <Logo size={tokens.typography.sizes["3xl"] * 2} />
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
          variant="default"
          fullWidth
          rounded="sm"
        >
          Sign In
        </Button>
        <Button
          onPress={() => router.push("/(modals)/signUp")}
          variant="secondary"
          fullWidth
          rounded="sm"
        >
          Create Account
        </Button>
      </View>

      <View style={{ alignItems: "center" }}>
        <Button variant="link" onPress={() => router.push("/(modals)/forgot")}>
          Forgot password?
        </Button>
      </View>
    </View>
  );
}
