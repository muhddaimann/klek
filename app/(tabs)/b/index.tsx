import React from "react";
import { View, Pressable } from "react-native";
import { useTheme, Divider } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useAlert, useModal } from "../../../hooks/useOverlay";
import { UserRound, Globe2, Wallet, Moon } from "lucide-react-native";
import { H2, Body, BodySmall, Caption } from "../../../components/atom/text";

export default function Settings() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { alert } = useAlert();
  const { modal, dismissModal } = useModal();

  const card = { borderRadius: tokens.radii.lg } as const;

  const handleBudgetAlert = () => {
    alert({
      title: "Monthly budget",
      message: "Budget setup will be available in the next version.",
      variant: "info",
    });
  };

  const handleCurrencyModal = () => {
    modal({
      dismissible: true,
      content: (
        <View
          style={{
            paddingHorizontal: tokens.spacing.lg,
            paddingTop: tokens.spacing.lg,
            paddingBottom: tokens.spacing.lg,
            gap: tokens.spacing.md,
          }}
        >
          <H2>Currency</H2>
          <BodySmall muted>
            For now, Klek only supports MYR. Multi-currency is planned later.
          </BodySmall>

          <View
            style={{
              flexDirection: "row",
              gap: tokens.spacing.md,
              marginTop: tokens.spacing.lg,
            }}
          >
            <Pressable
              onPress={() => {
                dismissModal();
              }}
              style={{
                flex: 1,
                borderRadius: tokens.radii.md,
                borderWidth: 1,
                borderColor: colors.primary,
                paddingVertical: tokens.spacing.lg,
                paddingHorizontal: tokens.spacing.md,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.primaryContainer,
              }}
            >
              <Body weight="semibold" color={colors.onPrimaryContainer}>
                MYR
              </Body>
            </Pressable>

            <Pressable
              disabled
              style={{
                flex: 1,
                borderRadius: tokens.radii.md,
                borderWidth: 1,
                borderColor: colors.outlineVariant,
                paddingVertical: tokens.spacing.lg,
                paddingHorizontal: tokens.spacing.md,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.surfaceVariant,
                opacity: 0.6,
              }}
            >
              <Body weight="semibold" color={colors.onSurfaceVariant}>
                USD
              </Body>
              <BodySmall muted>Coming soon</BodySmall>
            </Pressable>
          </View>
        </View>
      ),
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: tokens.spacing.lg,
        paddingTop: tokens.spacing.lg,
        paddingBottom: tokens.spacing["3xl"] * 2,
        gap: tokens.spacing.lg,
      }}
    >
      <View style={{ gap: tokens.spacing["xs"] }}>
        <H2>Settings</H2>
        <BodySmall muted>Tune how Klek works for you.</BodySmall>
      </View>

      <View
        style={{
          backgroundColor: colors.surface,
          ...card,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
          overflow: "hidden",
        }}
      >
        <Row
          icon={
            <UserRound size={tokens.sizes.icon.sm} color={colors.onSurface} />
          }
          label="Profile"
          value="Set your name"
          onPress={() => {}}
          colors={colors}
          tokens={tokens}
        />
        <Divider
          style={{ backgroundColor: colors.outlineVariant, opacity: 0.4 }}
        />
        <Row
          icon={<Globe2 size={tokens.sizes.icon.sm} color={colors.onSurface} />}
          label="Currency"
          value="MYR (Ringgit)"
          onPress={handleCurrencyModal}
          colors={colors}
          tokens={tokens}
        />
        <Divider
          style={{ backgroundColor: colors.outlineVariant, opacity: 0.4 }}
        />
        <Row
          icon={<Wallet size={tokens.sizes.icon.sm} color={colors.onSurface} />}
          label="Monthly budget"
          value="Not set"
          onPress={handleBudgetAlert}
          colors={colors}
          tokens={tokens}
        />
      </View>

      <View
        style={{
          backgroundColor: colors.surface,
          ...card,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
          overflow: "hidden",
        }}
      >
        <Row
          icon={<Moon size={tokens.sizes.icon.sm} color={colors.onSurface} />}
          label="Appearance"
          value="System default"
          onPress={() => {}}
          colors={colors}
          tokens={tokens}
        />
      </View>
    </View>
  );
}

function Row({
  icon,
  label,
  value,
  onPress,
  colors,
  tokens,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress: () => void;
  colors: any;
  tokens: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.md,
        gap: tokens.spacing.sm,
      }}
    >
      {icon}
      <View style={{ flex: 1 }}>
        <Body weight="semibold">{label}</Body>
        {value ? (
          <Caption
            muted
            numberOfLines={1}
            style={{ marginTop: tokens.spacing["3xs"] }}
          >
            {value}
          </Caption>
        ) : null}
      </View>
    </Pressable>
  );
}
