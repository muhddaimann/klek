import React, { useEffect, useRef, useState } from "react";
import { View, Animated, Easing } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { router } from "expo-router";
import { useDesign } from "../contexts/designContext";
import { H1 } from "../components/atom/text";
import Logo from "../components/shared/logo";

export default function Goodbye() {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const [count, setCount] = useState(2);
  const fade = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const tick = setInterval(() => setCount((n) => (n > 1 ? n - 1 : n)), 1000);

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.06,
          duration: 400,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1.0,
          duration: 400,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );

    Animated.timing(fade, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    loop.start();

    const to = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => router.replace("/"));
    }, 2000);

    return () => {
      clearInterval(tick);
      clearTimeout(to);
      loop.stop();
    };
  }, [fade, pulse]);

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
      <Animated.View
        style={{
          opacity: fade,
          transform: [{ scale: pulse }],
          alignItems: "center",
          gap: tokens.spacing.sm,
        }}
      >
        <Logo size={tokens.typography.sizes["3xl"] * 2} />
        <H1 style={{ color: colors.onSurface }}>Goodbye</H1>
        <Text style={{ color: colors.onSurfaceVariant }}>
          Returning to start in {count}s
        </Text>
      </Animated.View>
    </View>
  );
}
