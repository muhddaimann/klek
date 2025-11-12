import React from "react";
import { View, Pressable } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import Logo from "./logo";

type Props = {
  name?: string;
  remainingSec?: number;
  onProfile?: () => void;
};

export default function HomeHeader({
  name = "User",
  remainingSec = 0,
  onProfile,
}: Props) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const total = 5 * 60;
  const left = Math.max(0, remainingSec);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const pct = Math.min(1, left / total);

  return (
    <View
      style={{
        backgroundColor: colors.primaryContainer,
        paddingTop: tokens.spacing["xs"],
        paddingBottom: tokens.spacing.lg,
        paddingHorizontal: tokens.spacing.lg,
        borderBottomLeftRadius: tokens.radii["2xl"],
        borderBottomRightRadius: tokens.radii["2xl"],
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: tokens.spacing.md,
        }}
      >
        <Logo size={tokens.typography.sizes["2xl"] * 2} />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.onPrimaryContainer,
              fontSize: tokens.typography.sizes.lg,
              fontWeight: "700",
            }}
          >
            Hi, {name}
          </Text>
          <Text
            style={{
              color: colors.onPrimaryContainer,
              opacity: 0.85,
              marginTop: 2,
            }}
          >
            Session ends in {mm}:{ss}
          </Text>
        </View>

        <Pressable
          onPress={onProfile}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: colors.onPrimary, fontWeight: "700" }}>
            {name.charAt(0).toUpperCase()}
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          marginTop: tokens.spacing.md,
          height: 8,
          borderRadius: 8,
          backgroundColor: colors.outlineVariant,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${pct * 100}%`,
            height: "100%",
            backgroundColor: colors.primary,
          }}
        />
      </View>
    </View>
  );
}
