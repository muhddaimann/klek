import React from "react";
import { View, Pressable, Platform, Animated, Easing } from "react-native";
import { useTheme, Divider } from "react-native-paper";
import { BlurView } from "expo-blur";
import { Button } from "../../components/atom/button";
import { Subtitle, Body } from "../../components/atom/text";
import { useDesign } from "../../contexts/designContext";
import type { ConfirmOptions } from "../../contexts/overlayContext";

const DURATION_IN = 220;
const DURATION_OUT = 180;

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

  const [mounted, setMounted] = React.useState(visible);
  const [internalState, setInternalState] =
    React.useState<ConfirmOptions | null>(state ?? null);

  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  const panelOpacity = React.useRef(new Animated.Value(0)).current;
  const panelScale = React.useRef(new Animated.Value(0.96)).current;
  const closingRef = React.useRef(false);

  React.useEffect(() => {
    if (state) setInternalState(state);
  }, [state]);

  const animateIn = React.useCallback(() => {
    closingRef.current = false;
    backdropOpacity.setValue(0);
    panelOpacity.setValue(0);
    panelScale.setValue(0.96);

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: DURATION_IN,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(panelOpacity, {
        toValue: 1,
        duration: DURATION_IN,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(panelScale, {
        toValue: 1,
        duration: DURATION_IN,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [backdropOpacity, panelOpacity, panelScale]);

  const animateOut = React.useCallback(
    (after?: () => void) => {
      if (closingRef.current) return;
      closingRef.current = true;

      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: DURATION_OUT,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(panelOpacity, {
          toValue: 0,
          duration: DURATION_OUT,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(panelScale, {
          toValue: 0.96,
          duration: DURATION_OUT,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished) return;
        closingRef.current = false;
        setMounted(false);
        setInternalState(null);
        after?.();
      });
    },
    [backdropOpacity, panelOpacity, panelScale]
  );

  React.useEffect(() => {
    if (visible) {
      if (!mounted) setMounted(true);
      requestAnimationFrame(animateIn);
    } else if (mounted && !closingRef.current) {
      animateOut();
    }
  }, [visible, mounted, animateIn, animateOut]);

  const handleBackdropPress = () => {
    if (closingRef.current) return;
    animateOut(onCancel);
  };

  if (!mounted || !internalState) return null;

  const okVariant =
    internalState.variant === "error" ? "destructive" : "default";

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
      accessibilityLabel={internalState.title ?? "Confirmation dialog"}
      accessibilityViewIsModal
      accessibilityLiveRegion="polite"
    >
      <Animated.View
        style={{
          position: "absolute",
          inset: 0,
          opacity: backdropOpacity,
        }}
      >
        {Platform.OS === "ios" || Platform.OS === "web" ? (
          <>
            <BlurView
              intensity={30}
              tint={dark ? "dark" : "light"}
              style={{ position: "absolute", inset: 0 }}
            />
            <Pressable
              onPress={handleBackdropPress}
              accessible={false}
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: dark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.20)",
              }}
            />
          </>
        ) : (
          <Pressable
            onPress={handleBackdropPress}
            accessible={false}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: dark ? "rgba(0,0,0,0.40)" : "rgba(0,0,0,0.24)",
            }}
          />
        )}
      </Animated.View>

      <Animated.View
        style={{
          width: "90%",
          maxWidth: 420,
          borderRadius: tokens.radii["2xl"],
          backgroundColor: "transparent",
          opacity: panelOpacity,
          transform: [{ scale: panelScale }],
        }}
      >
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: tokens.radii["2xl"],
            overflow: "hidden",
            borderWidth: 1,
            borderColor: colors.outlineVariant,
          }}
        >
          {internalState.title ? (
            <View
              style={{
                paddingHorizontal: tokens.spacing.lg,
                paddingTop: tokens.spacing.lg,
                paddingBottom: tokens.spacing.xs,
              }}
            >
              <Subtitle color={colors.onBackground} numberOfLines={2}>
                {internalState.title}
              </Subtitle>
            </View>
          ) : null}

          {internalState.message ? (
            <View
              style={{
                paddingHorizontal: tokens.spacing.lg,
                paddingBottom: tokens.spacing.lg,
              }}
            >
              <Body color={colors.onSurfaceVariant}>
                {internalState.message}
              </Body>
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
            <Button
              variant="secondary"
              onPress={() => animateOut(onCancel)}
              rounded="sm"
            >
              {internalState.cancelText ?? "Cancel"}
            </Button>
            <Button
              variant={okVariant as any}
              onPress={() => animateOut(onOk)}
              rounded="sm"
            >
              {internalState.okText ?? "OK"}
            </Button>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
