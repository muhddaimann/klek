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

export default function EditProfileModal() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const { user, loading, error, clearError, updateNickname } = useAuth();

  const [nickname, setNickname] = useState<string | null>(null);

  const nickRef = useRef<RNInput>(null);
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setNickname(user?.nickname ?? null);
  }, [user]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      nickRef.current?.focus();
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
        setNickname(user?.nickname ?? null);
        shake.setValue(0);
      };
    }, [clearError, shake, user])
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

  const normalizedNickname = (nickname ?? "").trim();
  const normalizedOriginal = (user?.nickname ?? "").trim();
  const hasChanges = normalizedNickname !== normalizedOriginal;

  const onSubmit = async () => {
    const trimmed = normalizedNickname;
    const valueOrNull = trimmed === "" ? null : trimmed;
    await updateNickname(valueOrNull);
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
          title="Edit profile"
          subtitle="Make Klek feel more like you"
          showBack
          rightSlot={<Logo size={tokens.typography.sizes["3xl"] * 2} />}
        />
      </View>

      <ScrollView
        style={{ flex: 1, marginTop: -tokens.spacing.lg }}
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: insets.bottom + tokens.spacing["xl"],
          gap: tokens.spacing.lg,
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
              gap: tokens.spacing.lg,
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
                What do we call you?
              </Body>
              <BodySmall
                muted
                style={{
                  fontSize: tokens.typography.sizes.sm,
                  marginTop: tokens.spacing["xxs"],
                }}
              >
                This nickname is what Klek will use inside the app.
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
              label="Nickname"
              value={nickname ?? ""}
              onChangeText={setNickname}
              placeholder={user?.username || "What do we call you?"}
              autoCapitalize="words"
              returnKeyType="done"
              ref={nickRef}
            />

            <View
              style={{
                gap: tokens.spacing["xxs"],
              }}
            >
              <BodySmall muted>Username</BodySmall>
              <Body>{user?.username}</Body>

              <BodySmall muted style={{ marginTop: tokens.spacing.sm }}>
                Email
              </BodySmall>
              <Body>{user?.email ?? "Not set"}</Body>

              <BodySmall muted style={{ marginTop: tokens.spacing.sm }}>
                User ID
              </BodySmall>
              <BodySmall>{user?.id}</BodySmall>
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
            disabled={loading || !hasChanges}
            fullWidth
            rounded="sm"
          >
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </View>
      </View>
    </View>
  );
}
