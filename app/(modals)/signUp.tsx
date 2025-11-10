import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useTheme, Text, TextInput, Divider } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/authContext";

export default function SignUpModal() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const router = useRouter();
  const { signIn, loading, error } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localErr, setLocalErr] = useState<string | null>(null);

  const onClose = () => router.back();

  const onSubmit = async () => {
    setLocalErr(null);
    if (!username.trim() || !password.trim() || !confirm.trim()) {
      setLocalErr("All fields are required");
      return;
    }
    if (password !== confirm) {
      setLocalErr("Passwords do not match");
      return;
    }
    const ok = await signIn(username.trim(), password.trim());
    if (ok) router.replace("/(tabs)/a");
  };

  const goSignIn = () => router.replace("/(modals)/signIn");

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
            Create account
          </Text>
          {!!(localErr || error) && (
            <Text style={{ color: colors.error }}>{localErr || error}</Text>
          )}
        </View>

        <View style={{ gap: tokens.spacing.md }}>
          <TextInput
            mode="outlined"
            label="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            mode="outlined"
            label="Confirm Password"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
          />
        </View>

        <View style={{ gap: tokens.spacing.sm }}>
          <Button onPress={onSubmit} mode="contained" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>
          <Button onPress={goSignIn} mode="text">
            Already have an account? Sign in
          </Button>
        </View>
        <Divider style={{ marginTop: tokens.spacing.sm }} />
      </View>
    </KeyboardAvoidingView>
  );
}
