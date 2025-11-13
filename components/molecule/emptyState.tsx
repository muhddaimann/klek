import * as React from "react";
import { View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";

type IconComp = React.ComponentType<{ size?: number; color?: string }>;

type Props = {
  Icon?: IconComp;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ Icon, title, subtitle, actionLabel, onAction }: Props) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  return (
    <View
      style={{
        paddingVertical: tokens.spacing.lg,
        paddingHorizontal: tokens.spacing.md,
        alignItems: "center",
        justifyContent: "center",
        gap: tokens.spacing.sm,
      }}
    >
      {Icon ? (
        <View
          style={{
            width: tokens.sizes.icon.lg * 2,
            height: tokens.sizes.icon.lg * 2,
            borderRadius: tokens.radii.full,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: tokens.spacing.xs,
          }}
        >
          <Icon size={tokens.sizes.icon.lg} color={colors.onSurfaceVariant} />
        </View>
      ) : null}

      <Text
        style={{
          fontSize: tokens.typography.sizes.sm,
          fontWeight: tokens.typography.weights.semibold,
          color: colors.onSurface,
          textAlign: "center",
        }}
      >
        {title}
      </Text>

      {subtitle ? (
        <Text
          style={{
            fontSize: tokens.typography.sizes.xs,
            color: colors.onSurfaceVariant,
            textAlign: "center",
          }}
        >
          {subtitle}
        </Text>
      ) : null}

      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          style={{
            marginTop: tokens.spacing.sm,
            paddingHorizontal: tokens.spacing.md,
            paddingVertical: tokens.spacing.xs,
            borderRadius: tokens.radii.pill,
            backgroundColor: colors.primary,
          }}
        >
          <Text
            style={{
              fontSize: tokens.typography.sizes.xs,
              fontWeight: tokens.typography.weights.semibold,
              color: colors.onPrimary,
            }}
          >
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
