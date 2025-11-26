import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View, TextInput as RNInput, Animated } from "react-native";
import { useTheme, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { useAuth } from "../../contexts/authContext";
import { useFocusEffect } from "expo-router";
import { Header } from "../../components/shared/header";
import Logo from "../../components/shared/logo";
import { Body, BodySmall } from "../../components/atom/text";

export default function SignUpModal() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const { register, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErr, setFieldErr] = useState<{
    email?: string;
    user?: string;
    pass?: string;
    conf?: string;
  }>({});

  const emailRef = useRef<RNInput>(null);
  const userRef = useRef<RNInput>(null);
  const passRef = useRef<RNInput>(null);
  const confRef = useRef<RNInput>(null);
  const shake = useRef(new Animated.Value(0)).current;

  const mismatch =
    confirm.trim().length > 0 &&
    password.trim().length > 0 &&
    confirm !== password;

  useEffect(() => {
    setFieldErr((e) => ({
      ...e,
      conf: mismatch ? "Passwords do not match" : undefined,
    }));
  }, [mismatch]);

  const isValid =
    email.trim().length > 0 &&
    username.trim().length > 0 &&
    password.trim().length > 0 &&
    confirm.trim().length > 0 &&
    !mismatch;

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      emailRef.current?.focus();
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    clearError();
  }, [clearError]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        clearError();
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirm("");
        setShowPass(false);
        setShowConfirm(false);
        setFieldErr({});
        shake.setValue(0);
      };
    }, [clearError, shake])
  );

  useEffect(() => {
    if (!error) return;
    Animated.sequence([
      Animated.timing(shake, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: -6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 0,
        duration: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [error, shake]);

  const onSubmit = async () => {
    const e = email.trim();
    const u = username.trim();
    const p = password.trim();
    const c = confirm.trim();

    const nextErr: typeof fieldErr = {};
    if (!e) nextErr.email = "Required";
    if (!u) nextErr.user = "Required";
    if (!p) nextErr.pass = "Required";
    if (!c) nextErr.conf = "Required";

    setFieldErr(nextErr);
    if (Object.keys(nextErr).length || mismatch) {
      if (!e) emailRef.current?.focus();
      else if (!u) userRef.current?.focus();
      else if (!p) passRef.current?.focus();
      else confRef.current?.focus();
      return;
    }

    await register(u, e, p);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          paddingTop: tokens.spacing.lg,
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: tokens.spacing.lg,
          backgroundColor: colors.primaryContainer,
          borderBottomLeftRadius: tokens.radii["2xl"],
          borderBottomRightRadius: tokens.radii["2xl"],
        }}
      >
        <Header
          title="Sign up"
          subtitle="Create your Klek account"
          showBack
          rightSlot={<Logo size={tokens.typography.sizes["3xl"] * 2} />}
        />
      </View>

      <ScrollView
        style={{ flex: 1, marginTop: -tokens.spacing.lg }}
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: insets.bottom + tokens.spacing["xl"],
        }}
        bounces={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={{
            transform: [{ translateX: shake }],
          }}
        >
          <View
            style={{
              borderRadius: tokens.radii["2xl"],
              paddingHorizontal: tokens.spacing.lg,
              paddingVertical: tokens.spacing.lg,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.outlineVariant,
              gap: tokens.spacing.md,
              shadowColor: colors.shadow,
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <View>
              <Body
                weight="semibold"
                color={colors.onSurface}
                style={{
                  fontSize: tokens.typography.sizes.lg,
                }}
              >
                Complete this form
              </Body>
              <BodySmall
                muted
                style={{
                  fontSize: tokens.typography.sizes.sm,
                  marginTop: tokens.spacing["xxs"],
                }}
              >
                Verify your email later from settings.
              </BodySmall>
            </View>

            {!!error && (
              <View
                style={{
                  backgroundColor: colors.errorContainer,
                  borderColor: colors.error,
                  borderWidth: 1,
                  borderRadius: tokens.radii.lg,
                  paddingVertical: tokens.spacing.sm,
                  paddingHorizontal: tokens.spacing.md,
                }}
              >
                <BodySmall
                  style={{
                    color: colors.onErrorContainer,
                    fontWeight: "600",
                    fontSize: tokens.typography.sizes.sm,
                  }}
                >
                  {error}
                </BodySmall>
              </View>
            )}

            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (fieldErr.email)
                  setFieldErr((e) => ({ ...e, email: undefined }));
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => userRef.current?.focus()}
              error={!!fieldErr.email}
              ref={emailRef}
            />
            {fieldErr.email ? (
              <BodySmall
                style={{
                  color: colors.error,
                  marginTop: -8,
                  fontSize: tokens.typography.sizes.xs,
                }}
              >
                {fieldErr.email}
              </BodySmall>
            ) : null}

            <TextInput
              mode="outlined"
              label="Username"
              value={username}
              onChangeText={(t) => {
                setUsername(t);
                if (fieldErr.user)
                  setFieldErr((e) => ({ ...e, user: undefined }));
              }}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passRef.current?.focus()}
              error={!!fieldErr.user}
              ref={userRef}
            />
            {fieldErr.user ? (
              <BodySmall
                style={{
                  color: colors.error,
                  marginTop: -8,
                  fontSize: tokens.typography.sizes.xs,
                }}
              >
                {fieldErr.user}
              </BodySmall>
            ) : null}

            <TextInput
              mode="outlined"
              label="Password"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (fieldErr.pass)
                  setFieldErr((e) => ({ ...e, pass: undefined }));
                if (confirm && t === confirm)
                  setFieldErr((e) => ({ ...e, conf: undefined }));
              }}
              secureTextEntry={!showPass}
              ref={passRef}
              returnKeyType="next"
              onSubmitEditing={() => confRef.current?.focus()}
              error={!!fieldErr.pass}
              right={
                <TextInput.Icon
                  icon={showPass ? "eye-off" : "eye"}
                  onPress={() => setShowPass((v) => !v)}
                  forceTextInputFocus={false}
                />
              }
            />
            {fieldErr.pass ? (
              <BodySmall
                style={{
                  color: colors.error,
                  marginTop: -8,
                  fontSize: tokens.typography.sizes.xs,
                }}
              >
                {fieldErr.pass}
              </BodySmall>
            ) : null}

            <TextInput
              mode="outlined"
              label="Confirm password"
              value={confirm}
              onChangeText={(t) => {
                setConfirm(t);
                if (!t || t === password)
                  setFieldErr((e) => ({ ...e, conf: undefined }));
              }}
              secureTextEntry={!showConfirm}
              ref={confRef}
              returnKeyType="go"
              onSubmitEditing={onSubmit}
              error={!!fieldErr.conf}
              right={
                <TextInput.Icon
                  icon={showConfirm ? "eye-off" : "eye"}
                  onPress={() => setShowConfirm((v) => !v)}
                  forceTextInputFocus={false}
                />
              }
            />
            {fieldErr.conf ? (
              <BodySmall
                style={{
                  color: colors.error,
                  marginTop: -8,
                  fontSize: tokens.typography.sizes.xs,
                }}
              >
                {fieldErr.conf}
              </BodySmall>
            ) : confirm && !mismatch ? (
              <BodySmall
                style={{
                  color: colors.tertiary,
                  marginTop: -8,
                  fontSize: tokens.typography.sizes.xs,
                }}
              >
                Passwords match
              </BodySmall>
            ) : null}
          </View>
        </Animated.View>
      </ScrollView>

      <View
        pointerEvents="box-none"
        style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
      >
        <View
          style={{
            paddingHorizontal: tokens.spacing.lg,
            paddingTop: tokens.spacing.sm,
            paddingBottom: insets.bottom + tokens.spacing.lg,
            backgroundColor: colors.background,
            borderTopWidth: 0.5,
            borderTopColor: colors.outlineVariant,
          }}
        >
          <Button
            onPress={onSubmit}
            variant="default"
            disabled={loading || !isValid}
            fullWidth
            rounded="sm"
          >
            {loading ? "Creating..." : "Create account"}
          </Button>
        </View>
      </View>
    </View>
  );
}
