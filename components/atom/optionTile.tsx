import React from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { BodySmall } from "./text";

type OptionTileProps = {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
};

export function OptionTile({ active, label, icon, onPress }: OptionTileProps) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexBasis: "30%",
        maxWidth: "30%",
        aspectRatio: 1,
        borderRadius: tokens.radii.md,
        borderWidth: 1,
        borderColor: active ? colors.primary : colors.outlineVariant,
        backgroundColor: active ? colors.primaryContainer : colors.surface,
        padding: tokens.spacing.sm,
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: active
            ? colors.onPrimaryContainer + "10"
            : colors.outlineVariant + "20",
        }}
      >
        {icon}
      </View>
      <BodySmall
        weight="semibold"
        numberOfLines={2}
        style={{
          fontSize: tokens.typography.sizes.xs,
          color: active ? colors.onPrimaryContainer : colors.onSurfaceVariant,
        }}
      >
        {label}
      </BodySmall>
    </Pressable>
  );
}
