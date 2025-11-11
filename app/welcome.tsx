import React, { useEffect, useRef, useState } from "react";
import { View, Animated, Easing } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { router } from "expo-router";
import { useDesign } from "../contexts/designContext";
import { H1 } from "../components/atom/text";
import Logo from "../components/shared/logo";
import { IconCoin } from "tabler-icons-react-native";

export default function Welcome() {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const [rm, setRm] = useState(0);
  const fade = useRef(new Animated.Value(0)).current;
  const coin = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const stepMs = 60;
    const duration = 2400;
    const steps = Math.ceil(duration / stepMs);
    const inc = 128 / steps;

    const incTimer = setInterval(() => {
      setRm((n) => {
        const v = n + inc;
        return v >= 128 ? 128 : v;
      });
    }, stepMs);

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(coin, {
          toValue: 1.06,
          duration: 500,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(coin, {
          toValue: 1.0,
          duration: 500,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );

    Animated.timing(fade, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    loop.start();

    const to = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => router.replace("/(tabs)/a"));
    }, duration);

    return () => {
      clearInterval(incTimer);
      clearTimeout(to);
      loop.stop();
    };
  }, [coin, fade]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        alignItems: "center",
        gap: tokens.spacing.lg,
        paddingVertical: tokens.spacing["3xl"] * 3,
      }}
    >
      <Animated.View style={{ transform: [{ scale: coin }], opacity: fade }}>
        <IconCoin size={56} color={colors.primary} />
      </Animated.View>

      <Animated.View style={{ opacity: fade, alignItems: "center" }}>
        <H1 style={{ color: colors.onSurface }}>RM {rm.toFixed(2)}</H1>
        <Text style={{ color: colors.onSurfaceVariant }}>collecting back…</Text>
      </Animated.View>

      <Animated.View style={{ opacity: fade }}>
        <Logo size={tokens.typography.sizes["3xl"]} />
      </Animated.View>
    </View>
  );
}
