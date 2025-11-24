import React, { useCallback } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useTheme } from "react-native-paper";
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
import { Body, BodySmall, Caption } from "../../../components/atom/text";

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
    route: "/(modals)/saveEstimator",
  },
  {
    key: "compounding",
    label: "Compounding estimator",
    subtitle: "Estimate future value with compounding returns.",
    Icon: TrendingUp,
    route: "/(modals)/compoundEstimator",
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
          paddingBottom: insets.bottom + tokens.spacing["3xl"] * 9,
          gap: tokens.spacing.md,
        }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        bounces={false}
        stickyHeaderIndices={[0]}
      >
        <View
          style={{
            backgroundColor: colors.background,
            paddingTop: tokens.spacing.lg,
            paddingHorizontal: tokens.spacing.lg,
            paddingBottom: tokens.spacing.sm,
          }}
        >
          <Header
            title="Calculator tools"
            subtitle="Quick helpers for loans, savings, and planning"
            style={{ paddingHorizontal: 0 }}
          />
        </View>

        <View
          style={{
            paddingHorizontal: tokens.spacing.lg,
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
            <Caption color={colors.onPrimaryContainer}>Planner helpers</Caption>
            <Body
              weight="semibold"
              color={colors.onPrimaryContainer}
              style={{
                marginTop: tokens.spacing["xs"],
                fontSize: tokens.typography.sizes.lg,
              }}
            >
              Try different money scenarios before committing.
            </Body>
          </View>

          <View
            style={{
              width: 140,
              backgroundColor: colors.surface,
              padding: tokens.spacing.md,
              ...card,
              borderWidth: 1,
              borderColor: colors.outlineVariant,
              justifyContent: "space-between",
            }}
          >
            <View style={{ gap: tokens.spacing["xxs"] }}>
              <Caption muted>Tip</Caption>
              <BodySmall weight="med" color={colors.onSurface}>
                Start with safe commit to see how much you can handle.
              </BodySmall>
            </View>
            <Caption muted>
              Then use loan, saving, and compounding to test your plans.
            </Caption>
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: tokens.spacing.lg,
            gap: tokens.spacing.sm,
          }}
        >
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
                  backgroundColor: colors.background,
                }}
              >
                <tool.Icon size={tokens.sizes.icon.md} color={colors.primary} />
              </View>
              <View style={{ flex: 1, gap: tokens.spacing["xs"] }}>
                <BodySmall
                  weight="semibold"
                  color={colors.onSurface}
                  numberOfLines={1}
                >
                  {tool.label}
                </BodySmall>
                <Caption muted numberOfLines={2}>
                  {tool.subtitle}
                </Caption>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
