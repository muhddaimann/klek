import React from "react";
import { View, Pressable } from "react-native";
import { useTheme, Text, Divider } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useAuth } from "../../../contexts/authContext";
import { UserRound, Globe2, Wallet, Moon, LogOut } from "lucide-react-native";

export default function Settings() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { signOut } = useAuth();

  const card = { borderRadius: tokens.radii.lg } as const;

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
      <View style={{ gap: tokens.spacing["xxs"] }}>
        <Text
          style={{
            fontSize: tokens.typography.sizes.xl,
            fontWeight: tokens.typography.weights.semibold,
            color: colors.onSurface,
          }}
        >
          Settings
        </Text>
        <Text
          style={{
            fontSize: tokens.typography.sizes.xs,
            color: colors.onSurfaceVariant,
          }}
        >
          Tune how Klek works for you.
        </Text>
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
          onPress={() => {}}
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
          onPress={() => {}}
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
        <Text
          style={{
            fontSize: tokens.typography.sizes.sm,
            fontWeight: tokens.typography.weights.semibold,
            color: colors.onSurface,
          }}
        >
          {label}
        </Text>
        {value ? (
          <Text
            style={{
              marginTop: tokens.spacing["3xs"],
              fontSize: tokens.typography.sizes.xs,
              color: colors.onSurfaceVariant,
            }}
            numberOfLines={1}
          >
            {value}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
