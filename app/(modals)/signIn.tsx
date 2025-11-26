import React, { useRef, useState, useEffect } from "react";
import { ScrollView, View, TextInput as RNInput, Animated } from "react-native";
import { useTheme, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { useAuth } from "../../contexts/authContext";
import { useFocusEffect, useRouter } from "expo-router";
import { Header } from "../../components/shared/header";
import Logo from "../../components/shared/logo";
import { Body, BodySmall } from "../../components/atom/text";

export default function SignInModal() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signIn, loading, error, clearError } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [fieldErr, setFieldErr] = useState<{ user?: string; pass?: string }>(
    {}
  );
  const userRef = useRef<RNInput>(null);
  const passRef = useRef<RNInput>(null);
  const shake = useRef(new Animated.Value(0)).current;

  const isValid = username.trim().length > 0 && password.trim().length > 0;

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      userRef.current?.focus();
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
        setUsername("");
        setPassword("");
        setShowPass(false);
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
    const u = username.trim();
    const p = password.trim();
    const nextErr: typeof fieldErr = {};
    if (!u) nextErr.user = "Required";
    if (!p) nextErr.pass = "Required";
    setFieldErr(nextErr);
    if (Object.keys(nextErr).length) return;

    const ok = await signIn(u, p);
    if (!ok) {
      setPassword("");
      passRef.current?.focus();
    }
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
          title="Sign in"
          subtitle="Welcome back to Klek"
          showBack
          rightSlot={<Logo size={tokens.typography.sizes["3xl"] * 2} />}
        />
      </View>

      <ScrollView
        style={{ flex: 1, marginTop: -tokens.spacing["lg"] }}
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
            <View
              style={{
                marginBottom: tokens.spacing.sm,
              }}
            >
              <Body
                weight="semibold"
                color={colors.onSurface}
                style={{ fontSize: tokens.typography.sizes.lg }}
              >
                Welcome back
              </Body>
              <BodySmall
                muted
                style={{
                  marginTop: tokens.spacing["xxs"],
                  fontSize: tokens.typography.sizes.sm,
                }}
              >
                Sign in to see your budgets and fronts.
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
              }}
              secureTextEntry={!showPass}
              ref={passRef}
              returnKeyType="go"
              onSubmitEditing={onSubmit}
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

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: tokens.spacing.sm,
              }}
            >
              <BodySmall muted>New to Klek?</BodySmall>
              <Button
                variant="link"
                size="md"
                onPress={() => {
                  router.back();
                  setTimeout(() => {
                    router.push("/(modals)/signUp");
                  }, 150);
                }}
                style={{ paddingHorizontal: tokens.spacing["xxs"] }}
              >
                Create an account instead
              </Button>
            </View>
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
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </View>
      </View>
    </View>
  );
}
