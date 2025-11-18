import * as React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { Body, BodySmall } from "../atom/text";
import { Button } from "../atom/button";

type IconComp = React.ComponentType<{ size?: number; color?: string }>;

type Props = {
  Icon?: IconComp;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  Icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: Props) {
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
            backgroundColor: colors.surfaceVariant,
          }}
        >
          <Icon size={tokens.sizes.icon.lg} color={colors.onSurfaceVariant} />
        </View>
      ) : null}

      <Body weight="semibold" align="center">
        {title}
      </Body>

      {subtitle ? (
        <BodySmall muted align="center">
          {subtitle}
        </BodySmall>
      ) : null}

      {actionLabel && onAction ? (
        <Button
          size="sm"
          rounded="pill"
          onPress={onAction}
          accessibilityLabel={actionLabel}
          style={{ marginTop: tokens.spacing.sm }}
        >
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}
