// app/(modals)/forgotPassword.tsx
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useTheme, Text, TextInput, Divider } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { useRouter } from "expo-router";

export default function ForgotPasswordModal() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const router = useRouter();
  const [email, setEmail] = useState("");

  const onClose = () => router.back();
  const onSubmit = () => {
    if (!email.trim()) return;
    router.back();
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
            Reset password
          </Text>
          <Text style={{ color: colors.onSurfaceVariant }}>
            Enter your email to receive reset instructions
          </Text>
        </View>

        <View style={{ gap: tokens.spacing.md }}>
          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={{ gap: tokens.spacing.sm }}>
          <Button onPress={onSubmit} mode="contained">
            Send reset link
          </Button>
          <Button onPress={onClose} mode="text">
            Cancel
          </Button>
        </View>

        <Divider style={{ marginTop: tokens.spacing.xs }} />
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: colors.onSurfaceVariant,
              fontSize: tokens.typography.sizes.sm,
            }}
          >
            You’ll get an email if the account exists
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
