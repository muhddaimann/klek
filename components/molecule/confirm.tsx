import React from "react";
import { View, Pressable, Platform } from "react-native";
import { useTheme, Divider } from "react-native-paper";
import { BlurView } from "expo-blur";
import { Button } from "../../components/atom/button";
import { Subtitle, Body } from "../../components/atom/text";
import { useDesign } from "../../contexts/designContext";
import type { ConfirmOptions } from "../../contexts/overlayContext";

export function ConfirmDialog({
  visible,
  state,
  onOk,
  onCancel,
}: {
  visible: boolean;
  state: ConfirmOptions | null;
  onOk: () => void;
  onCancel: () => void;
}) {
  const { colors, dark } = useTheme();
  const { tokens } = useDesign();
  if (!visible || !state) return null;

  const okVariant = state.variant === "error" ? "destructive" : "default";

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        inset: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      accessible
      accessibilityLabel={state.title ?? "Confirmation dialog"}
      accessibilityViewIsModal
      accessibilityLiveRegion="polite"
    >
      {Platform.OS === "ios" || Platform.OS === "web" ? (
        <>
          <BlurView
            intensity={40}
            tint={dark ? "dark" : "light"}
            style={{ position: "absolute", inset: 0 }}
          />
          <Pressable
            onPress={onCancel}
            accessible={false}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: dark ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.30)",
            }}
          />
        </>
      ) : (
        <Pressable
          onPress={onCancel}
          accessible={false}
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: dark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.35)",
          }}
        />
      )}

      <View
        style={{
          width: "90%",
          maxWidth: 420,
          borderRadius: tokens.radii["2xl"],
          backgroundColor: "transparent",
          ...Platform.select({
            ios: {
              shadowColor: colors.shadow,
              shadowOpacity: 0.24,
              shadowRadius: tokens.elevation.level5 * 2.2,
              shadowOffset: { width: 0, height: tokens.elevation.level5 },
            },
            android: { elevation: tokens.elevation.level5 },
            default: { elevation: tokens.elevation.level5 },
          }),
        }}
      >
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: tokens.radii["2xl"],
            overflow: "hidden",
          }}
        >
          {state.title ? (
            <View
              style={{
                paddingHorizontal: tokens.spacing.lg,
                paddingTop: tokens.spacing.lg,
                paddingBottom: tokens.spacing.xs,
              }}
            >
              <Subtitle color={colors.onBackground} numberOfLines={2}>
                {state.title}
              </Subtitle>
            </View>
          ) : null}

          {state.message ? (
            <View
              style={{
                paddingHorizontal: tokens.spacing.lg,
                paddingBottom: tokens.spacing.lg,
              }}
            >
              <Body color={colors.onSurfaceVariant}>{state.message}</Body>
            </View>
          ) : null}

          <Divider
            style={{ backgroundColor: colors.outlineVariant, opacity: 0.35 }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: tokens.spacing.sm,
              padding: tokens.spacing.md,
              paddingHorizontal: tokens.spacing.lg,
            }}
          >
            <Button variant="secondary" onPress={onCancel} rounded="sm">
              {state.cancelText ?? "Cancel"}
            </Button>
            <Button variant={okVariant as any} onPress={onOk} rounded="sm">
              {state.okText ?? "OK"}
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}
