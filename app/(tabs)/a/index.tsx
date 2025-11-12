import React from "react";
import { View, ScrollView } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTab } from "../../../hooks/useTab";

export default function Atom() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { onScroll } = useTab();
  const HEADER = tokens.spacing["3xl"] * 3;
  const card = { borderRadius: tokens.radii.lg } as const;

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: HEADER }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: tokens.radii["2xl"],
            borderTopRightRadius: tokens.radii["2xl"],
            padding: tokens.spacing.lg,
            gap: tokens.spacing.lg,
            minHeight: "100%",
          }}
        >
          <View style={{ flexDirection: "row", gap: tokens.spacing.lg }}>
            <View
              style={{
                flex: 2,
                minHeight: 140,
                backgroundColor: colors.primaryContainer,
                ...card,
              }}
            />
            <View
              style={{
                flex: 1,
                minHeight: 140,
                backgroundColor: colors.tertiaryContainer,
                ...card,
              }}
            />
          </View>

          <View
            style={{
              minHeight: 180,
              backgroundColor: colors.surfaceVariant,
              ...card,
            }}
          />

          <View style={{ flexDirection: "row", gap: tokens.spacing.lg }}>
            <View
              style={{
                flex: 1,
                minHeight: 120,
                backgroundColor: colors.secondaryContainer,
                ...card,
              }}
            />
            <View
              style={{
                flex: 1,
                minHeight: 180,
                backgroundColor: colors.inversePrimary,
                ...card,
              }}
            />
          </View>

          <View
            style={{
              minHeight: 180,
              backgroundColor: colors.surfaceVariant,
              ...card,
            }}
          />

          <View style={{ flexDirection: "row", gap: tokens.spacing.lg }}>
            <View
              style={{
                flex: 1,
                minHeight: 120,
                backgroundColor: colors.secondaryContainer,
                ...card,
              }}
            />
            <View
              style={{
                flex: 1,
                minHeight: 180,
                backgroundColor: colors.inversePrimary,
                ...card,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
