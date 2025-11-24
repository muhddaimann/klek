import React, { useEffect, useMemo, useRef } from "react";
import { View, Pressable, Animated, Platform } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../contexts/designContext";
import type { ToastOptions } from "../../contexts/overlayContext";
import { Button } from "../../components/atom/button";
import { Body, BodySmall } from "../../components/atom/text";

const hex = (c: string) => {
  const s = c.replace("#", "");
  const n =
    s.length === 3
      ? s
          .split("")
          .map((x) => x + x)
          .join("")
      : s;
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
};

const mix = (a: string, b: string, t: number) => {
  const A = hex(a);
  const B = hex(b);
  const r = Math.round(A.r + (B.r - A.r) * t);
  const g = Math.round(A.g + (B.g - A.g) * t);
  const b2 = Math.round(A.b + (B.b - A.b) * t);
  return `rgb(${r}, ${g}, ${b2})`;
};

export function ToastBar({
  visible,
  state,
  onDismiss,
}: {
  visible: boolean;
  state: ToastOptions;
  onDismiss: () => void;
}) {
  const { colors, dark } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();

  const { bg, fg } = useMemo(() => {
    const base =
      state.variant === "success"
        ? colors.tertiary
        : state.variant === "warning"
        ? colors.secondary
        : state.variant === "error"
        ? colors.error
        : colors.primary;

    const t = dark ? 0.3 : 0.18;
    const softBg = mix(colors.surface, base, t);
    const fg = colors.onSurface;

    return { bg: softBg, fg };
  }, [state.variant, colors, dark]);

  const translateY = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    const show = Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]);
    const hide = Animated.parallel([
      Animated.timing(translateY, {
        toValue: 40,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.96,
        duration: 160,
        useNativeDriver: true,
      }),
    ]);
    (visible ? show : hide).start();
  }, [visible, translateY, opacity, scale]);

  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(onDismiss, state.duration ?? 2500);
    return () => clearTimeout(id);
  }, [visible, state.duration, onDismiss]);

  if (!visible) return null;

  return (
    <View
      pointerEvents="box-none"
      accessibilityLiveRegion="polite"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: tokens.spacing.lg,
        paddingBottom: Math.max(insets.bottom, tokens.spacing["2xl"]),
        zIndex: 9999,
        alignItems: "center",
        ...(Platform.OS === "android" ? { elevation: 9999 } : null),
      }}
    >
      <Animated.View
        style={{
          transform: [{ translateY }, { scale }],
          opacity,
          maxWidth: 480,
          width: "100%",
        }}
      >
        <View
          style={{
            borderRadius: tokens.radii["2xl"],
            backgroundColor: bg,
            paddingVertical: tokens.spacing.sm,
            paddingHorizontal: tokens.spacing.md,
            flexDirection: "row",
            alignItems: "center",
            gap: tokens.spacing.sm,
            ...Platform.select({
              ios: {
                shadowColor: colors.shadow,
                shadowOpacity: 0.16,
                shadowRadius: tokens.elevation.level5 * 1.8,
                shadowOffset: { width: 0, height: tokens.elevation.level5 },
              },
              android: { elevation: tokens.elevation.level5 },
              default: { elevation: tokens.elevation.level5 },
            }),
          }}
        >
          <Pressable
            onPress={onDismiss}
            accessibilityLabel="Dismiss notification"
            style={{
              flex: 1,
              paddingVertical: tokens.spacing.xs,
            }}
          >
            <Body color={fg} numberOfLines={2}>
              {state.message}
            </Body>
          </Pressable>

          {state.actionLabel ? (
            <Button
              variant="ghost"
              size="sm"
              onPress={() => {
                state.onAction?.();
                onDismiss();
              }}
              rounded="pill"
              style={{ paddingHorizontal: tokens.spacing.xs }}
            >
              <BodySmall color={fg} weight="semibold">
                {state.actionLabel}
              </BodySmall>
            </Button>
          ) : null}
        </View>
      </Animated.View>
    </View>
  );
}
