import React from "react";
import { View, ScrollView } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTab } from "../../../hooks/useTab";

export default function Home() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { onScroll } = useTab();
  const HEADER = tokens.spacing["3xl"] * 3;
  const card = { borderRadius: tokens.radii.lg } as const;

  return (
    <View style={{ flex: 1, backgroundColor: colors.primaryContainer }}>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          paddingHorizontal: tokens.spacing.sm,
          justifyContent: "flex-start",
        }}
      >
        <View
          style={{
            minHeight: 180,
            backgroundColor: colors.surface,
            ...card,
          }}
        />
      </View>

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
          <View style={{ flexDirection: "row", gap: tokens.spacing.lg }}></View>

          <View
            style={{
              minHeight: 180,
              backgroundColor: colors.surface,
              ...card,
            }}
          />
          <View
            style={{
              minHeight: 180,
              backgroundColor: colors.surface,
              ...card,
            }}
          />
          <View
            style={{
              minHeight: 180,
              backgroundColor: colors.surface,
              ...card,
            }}
          />
          <View
            style={{
              minHeight: 180,
              backgroundColor: colors.surface,
              ...card,
            }}
          />
          <View
            style={{
              minHeight: 180,
              backgroundColor: colors.surface,
              ...card,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
