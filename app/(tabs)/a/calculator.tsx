import React, { useCallback } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../../contexts/designContext";
import { Header } from "../../../components/shared/header";
import { useTab } from "../../../hooks/useTab";
import { useFocusEffect, useRouter } from "expo-router";
import {
  Calculator as CalculatorIcon,
  PiggyBank,
  Wallet2,
  TrendingUp,
} from "lucide-react-native";

type ToolKey =
  | "safeCommit"
  | "loanEstimator"
  | "savingEstimator"
  | "compounding";

type ToolItem = {
  key: ToolKey;
  label: string;
  subtitle: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  route: string;
};

const TOOLS: ToolItem[] = [
  {
    key: "safeCommit",
    label: "Safe commit",
    subtitle: "Based on income, see how much you can commit monthly.",
    Icon: Wallet2,
    route: "/(modals)/safeCommit",
  },
  {
    key: "loanEstimator",
    label: "Loan estimator",
    subtitle: "Monthly payment and total interest for a simple loan.",
    Icon: CalculatorIcon,
    route: "/(modals)/loanEstimator",
  },
  {
    key: "savingEstimator",
    label: "Saving estimator",
    subtitle: "Plan monthly saving vs target amount or date.",
    Icon: PiggyBank,
    route: "/(modals)/savingEstimator",
  },
  {
    key: "compounding",
    label: "Compounding estimator",
    subtitle: "Estimate future value with compounding returns.",
    Icon: TrendingUp,
    route: "/(modals)/compoundingEstimator",
  },
];

export default function Calculator() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { lockHidden, unlockHidden } = useTab();

  useFocusEffect(
    useCallback(() => {
      lockHidden();
      return () => unlockHidden();
    }, [lockHidden, unlockHidden])
  );

  const card = {
    borderRadius: tokens.radii.lg,
  } as const;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingTop: tokens.spacing.lg,
          paddingBottom: insets.bottom + tokens.spacing["3xl"] * 2,
          gap: tokens.spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        bounces={false}
      >
        <Header
          title="Calculator tools"
          subtitle="Quick helpers for loans, savings, and planning"
        />

        <View
          style={{
            flexDirection: "row",
            gap: tokens.spacing.sm,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: colors.primaryContainer,
              padding: tokens.spacing.md,
              ...card,
            }}
          >
            <Text
              style={{
                fontSize: tokens.typography.sizes.xs,
                color: colors.onPrimaryContainer,
              }}
            >
              Planner helpers
            </Text>
            <Text
              style={{
                marginTop: tokens.spacing["xs"],
                fontSize: tokens.typography.sizes.lg,
                fontWeight: tokens.typography.weights.semibold,
                color: colors.onPrimaryContainer,
              }}
            >
              Try different money scenarios before committing.
            </Text>
          </View>

          <View
            style={{
              width: 120,
              backgroundColor: colors.surface,
              padding: tokens.spacing.md,
              ...card,
              borderWidth: 1,
              borderColor: colors.outlineVariant,
              justifyContent: "space-between",
            }}
          >
            <CalculatorIcon
              size={tokens.sizes.icon.lg}
              color={colors.onSurface}
            />
            <Text
              style={{
                fontSize: tokens.typography.sizes.xs,
                color: colors.onSurfaceVariant,
              }}
            >
              Use these tools to feed into Budget, Settlement, and Wishlist.
            </Text>
          </View>
        </View>

        <View style={{ gap: tokens.spacing.sm }}>
          {TOOLS.map((tool, idx) => (
            <Pressable
              key={tool.key}
              onPress={() => router.push(tool.route)}
              style={{
                backgroundColor: colors.surface,
                padding: tokens.spacing.md,
                ...card,
                borderWidth: 1,
                borderColor: colors.outlineVariant,
                flexDirection: "row",
                alignItems: "center",
                gap: tokens.spacing.md,
                marginTop: idx === 0 ? 0 : 0,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: tokens.radii.lg,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.primaryContainer,
                }}
              >
                <tool.Icon
                  size={tokens.sizes.icon.md}
                  color={colors.onPrimaryContainer}
                />
              </View>
              <View style={{ flex: 1, gap: tokens.spacing["xs"] }}>
                <Text
                  style={{
                    fontSize: tokens.typography.sizes.sm,
                    fontWeight: tokens.typography.weights.semibold,
                    color: colors.onSurface,
                  }}
                  numberOfLines={1}
                >
                  {tool.label}
                </Text>
                <Text
                  style={{
                    fontSize: tokens.typography.sizes.xs,
                    color: colors.onSurfaceVariant,
                  }}
                  numberOfLines={2}
                >
                  {tool.subtitle}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
