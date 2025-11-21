import React from "react";
import { View, Animated, Easing, Pressable, Platform } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useDesign } from "../../contexts/designContext";
import type { ModalOptions } from "../../contexts/overlayContext";

const DURATION_IN = 260;
const DURATION_OUT = 200;

export function ModalSheet({
  visible,
  state,
  onDismiss,
}: {
  visible: boolean;
  state: ModalOptions | null;
  onDismiss: () => void;
}) {
  const { colors, dark } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();

  const canDismiss = state?.dismissible !== false;

  const translateY = React.useRef(new Animated.Value(40)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  const sheetOpacity = React.useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = React.useState(visible);
  const closingRef = React.useRef(false);

  const [internalState, setInternalState] = React.useState<ModalOptions | null>(
    state ?? null
  );

  React.useEffect(() => {
    if (state) setInternalState(state);
  }, [state]);

  const animateIn = React.useCallback(() => {
    closingRef.current = false;
    translateY.setValue(40);
    backdropOpacity.setValue(0);
    sheetOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: DURATION_IN,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(sheetOpacity, {
        toValue: 1,
        duration: DURATION_IN,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: DURATION_IN,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [backdropOpacity, sheetOpacity, translateY]);

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
        Animated.timing(sheetOpacity, {
          toValue: 0,
          duration: DURATION_OUT,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 40,
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
    [backdropOpacity, sheetOpacity, translateY]
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
    if (!canDismiss || closingRef.current) return;
    animateOut(onDismiss);
  };

  if (!mounted || !internalState) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{ position: "absolute", inset: 0, justifyContent: "flex-end" }}
    >
      <Animated.View
        style={{ position: "absolute", inset: 0, opacity: backdropOpacity }}
      >
        {Platform.OS === "ios" || Platform.OS === "web" ? (
          <>
            <BlurView
              intensity={40}
              tint={dark ? "dark" : "light"}
              style={{ position: "absolute", inset: 0 }}
            />
            <Pressable
              onPress={handleBackdropPress}
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: dark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.32)",
              }}
            />
          </>
        ) : (
          <Pressable
            onPress={handleBackdropPress}
            style={{
              flex: 1,
              backgroundColor: dark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.35)",
            }}
          />
        )}
      </Animated.View>

      <Animated.View
        style={{
          transform: [{ translateY }],
          opacity: sheetOpacity,
        }}
      >
        <View style={{ width: "100%", backgroundColor: "transparent" }}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: tokens.radii.xl,
              borderTopRightRadius: tokens.radii.xl,
              paddingBottom: insets.bottom + tokens.spacing.sm,
            }}
          >
            {internalState.content}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
