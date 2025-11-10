import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useTheme, Text, TextInput, Divider } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/authContext";

export default function SignInModal() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const router = useRouter();
  const { signIn, loading, error } = useAuth();

  const [email, setEmail] = useState("user");
  const [password, setPassword] = useState("123");

  const onClose = () => router.back();

  const onSubmit = async () => {
    if (!email.trim() || !password.trim()) return;
    const ok = await signIn(email.trim(), password.trim());
    if (ok) router.replace("/(tabs)/a");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding" })}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <View
        style={{
          flex: 1,
          padding: tokens.spacing.lg,
          gap: tokens.spacing.lg,
          justifyContent: "center",
        }}
      >
        <View style={{ gap: tokens.spacing.xs, alignItems: "center" }}>
          <Text
            style={{
              color: colors.onBackground,
              fontSize: tokens.typography.sizes["2xl"],
              fontWeight: "700",
            }}
          >
            Sign in
          </Text>
          <Text style={{ color: colors.onSurfaceVariant }}>Welcome back</Text>
          {!!error && <Text style={{ color: colors.error }}>{error}</Text>}
        </View>

        <View style={{ gap: tokens.spacing.md }}>
          <TextInput
            mode="outlined"
            label="Username"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View>
          <Button onPress={onSubmit} mode="contained" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </View>
        <Divider style={{ marginTop: tokens.spacing.sm }} />
      </View>
    </KeyboardAvoidingView>
  );
}
