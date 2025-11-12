import * as React from "react";
import {
  Pressable,
  Platform,
  View,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../contexts/designContext";

type IconComp = React.ComponentType<{ color?: string; size?: number }>;
type Variant = "primary" | "secondary" | "destructive" | "surface";
type Size = "md" | "lg";
type Dock = "bottom" | "above" | "top";

type Props = {
  icon: IconComp;
  label?: string;
  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  size?: Size;
  dock?: Dock;
  offset?: number;
  tabBarHeight?: number;
  liftAboveNav?: number;
  stack?: number;
  gap?: number;
  style?: any;
  accessibilityLabel?: string;
};

export function Fab({
  icon: Icon,
  label,
  onPress,
  disabled,
  loading,
  variant = "primary",
  size = "md",
  dock = "bottom",
  offset,
  tabBarHeight = 64,
  liftAboveNav = 32,
  stack = 0,
  gap,
  style,
  accessibilityLabel,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { tokens } = useDesign();

  const [pressed, setPressed] = React.useState(false);

  const dims =
    size === "lg"
      ? Math.max(60, tokens.sizes.touch.minHeight + 8)
      : Math.max(56, tokens.sizes.touch.minHeight);
  const radius = dims / 2;

  const palette =
    variant === "primary"
      ? { bg: colors.primary, fg: colors.onPrimary, border: "transparent" }
      : variant === "secondary"
      ? { bg: colors.secondary, fg: colors.onSecondary, border: "transparent" }
      : variant === "destructive"
      ? { bg: colors.error, fg: colors.onError, border: "transparent" }
      : { bg: colors.surface, fg: colors.primary, border: colors.outline };

  const disabledPalette = {
    bg: colors.surfaceDisabled,
    fg: colors.onSurfaceDisabled,
    border: colors.surfaceDisabled,
  };

  const isExtended = !!label;

  const baseShadow = Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
    },
    android: { elevation: 6 },
    default: { elevation: 6 },
  });

  const g = offset ?? tokens.spacing.lg;
  const stackGap = gap ?? tokens.spacing.md;
  const bottomBase =
    Math.max(insets.bottom, g) +
    tabBarHeight +
    liftAboveNav +
    stack * (dims + stackGap);
  const pos =
    dock === "bottom"
      ? { right: g, bottom: bottomBase }
      : dock === "above"
      ? { right: g, bottom: bottomBase + dims + stackGap }
      : { right: g, top: Math.max(insets.top, g) };
  const iconSize = size === "lg" ? tokens.sizes.icon.lg : tokens.sizes.icon.md;
  const bg = disabled ? disabledPalette.bg : palette.bg;
  const fg = disabled ? disabledPalette.fg : palette.fg;
  const border = disabled ? disabledPalette.border : palette.border;

  return (
    <View
      pointerEvents="box-none"
      style={[
        {
          position: "absolute",
          zIndex: 1000,
          ...(Platform.OS === "android" ? { elevation: 1000 } : null),
        },
        pos,
        style,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          accessibilityLabel ??
          (label ? String(label) : "Floating Action Button")
        }
        disabled={disabled || loading}
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        android_ripple={
          disabled || loading
            ? undefined
            : { color: "#ffffff22", borderless: true }
        }
        style={[
          baseShadow as any,
          isExtended
            ? {
                minHeight: dims,
                borderRadius: tokens.radii.pill,
                backgroundColor: bg,
                borderWidth:
                  variant === "surface" ? StyleSheet.hairlineWidth : 0,
                borderColor: border as string,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: tokens.spacing.lg,
                gap: tokens.spacing.sm,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              }
            : {
                width: dims,
                height: dims,
                borderRadius: radius,
                backgroundColor: bg,
                borderWidth:
                  variant === "surface" ? StyleSheet.hairlineWidth : 0,
                borderColor: border as string,
                alignItems: "center",
                justifyContent: "center",
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={fg} />
        ) : (
          <>
            <Icon color={fg as string} size={iconSize} />
            {isExtended ? (
              <Text
                style={{
                  color: fg as string,
                  fontFamily: "Inter_600SemiBold",
                  fontWeight: "600",
                  fontSize: tokens.typography.sizes.md,
                }}
                numberOfLines={1}
              >
                {label}
              </Text>
            ) : null}
          </>
        )}
      </Pressable>
    </View>
  );
}
