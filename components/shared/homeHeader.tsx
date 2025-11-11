import React from "react";
import { View, Pressable } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import Logo from "./logo";

type Props = {
  name?: string;
  owedToday?: number;
  totalBack?: number;
  onAdd?: () => void;
  onScan?: () => void;
  onProfile?: () => void;
  onFilterChange?: (f: "all" | "owedToMe" | "iOwe") => void;
};

export default function HomeHeader({
  name = "User",
  owedToday = 0,
  totalBack = 0,
  onAdd,
  onScan,
  onProfile,
  onFilterChange,
}: Props) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  return (
    <View
      style={{
        backgroundColor: colors.primaryContainer,
        paddingTop: tokens.spacing["sm"],
        paddingBottom: tokens.spacing.lg,
        paddingHorizontal: tokens.spacing.lg,
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
              fontSize: tokens.typography.sizes.md,
              opacity: 0.9,
            }}
          >
            Hi, {name}
          </Text>
          <Text
            style={{
              color: colors.onPrimaryContainer,
              fontSize: tokens.typography.sizes.lg,
              fontWeight: "700",
            }}
          >
            RM {owedToday.toFixed(2)} owed today
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
          marginTop: tokens.spacing.lg,
          backgroundColor: colors.surface,
          borderRadius: tokens.radii.lg,
          padding: tokens.spacing.md,
        }}
      >
        <Text
          style={{
            color: colors.onSurfaceVariant,
            fontSize: tokens.typography.sizes.sm,
          }}
        >
          Total to collect
        </Text>
        <Text
          style={{
            color: colors.onSurface,
            fontSize: tokens.typography.sizes["2xl"],
            fontWeight: "700",
            marginTop: tokens.spacing.xs,
          }}
        >
          RM {totalBack.toFixed(2)}
        </Text>

        <View
          style={{
            flexDirection: "row",
            gap: tokens.spacing.sm,
            marginTop: tokens.spacing.md,
          }}
        >
          <Pressable
            onPress={onAdd}
            style={{
              flex: 1,
              height: 44,
              borderRadius: tokens.radii.sm,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: colors.onPrimary, fontWeight: "700" }}>
              Quick Add
            </Text>
          </Pressable>

          <Pressable
            onPress={onScan}
            style={{
              height: 44,
              paddingHorizontal: tokens.spacing.lg,
              borderRadius: tokens.radii.sm,
              borderWidth: 1,
              borderColor: colors.outlineVariant,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: colors.onSurface, fontWeight: "600" }}>
              Scan
            </Text>
          </Pressable>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: tokens.spacing.sm,
          marginTop: tokens.spacing.md,
        }}
      >
        <Pressable
          onPress={() => onFilterChange?.("all")}
          style={{
            paddingHorizontal: tokens.spacing.md,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.surface,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: colors.onSurface }}>All</Text>
        </Pressable>
        <Pressable
          onPress={() => onFilterChange?.("owedToMe")}
          style={{
            paddingHorizontal: tokens.spacing.md,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.surface,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: colors.onSurface }}>Owed to Me</Text>
        </Pressable>
        <Pressable
          onPress={() => onFilterChange?.("iOwe")}
          style={{
            paddingHorizontal: tokens.spacing.md,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.surface,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: colors.onSurface }}>I Owe</Text>
        </Pressable>
      </View>
    </View>
  );
}
