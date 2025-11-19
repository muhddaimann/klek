import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTab } from "../../../hooks/useTab";
import {
  Sparkles,
  HandCoins,
  Wallet,
  UserRound,
  PiggyBank,
  ReceiptText,
  Calculator as CalculatorIcon,
} from "lucide-react-native";
import { EmptyState } from "../../../components/molecule/emptyState";
import { useRouter } from "expo-router";
import { useHome } from "../../../hooks/useHome";
import { Body, BodySmall, Caption } from "../../../components/atom/text";
import { Button } from "../../../components/atom/button";
import { MainHeader } from "../../../components/shared/homeHeader";

export default function Home() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { onScroll } = useTab();
  const router = useRouter();
  const { monthSummary, overview, timeline, toggleMonth } = useHome();

  const card = { borderRadius: tokens.radii.lg } as const;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingTop: tokens.spacing.lg,
          paddingBottom: tokens.spacing["3xl"] * 2,
          gap: tokens.spacing.lg,
        }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        <MainHeader
          username="Aiman"
          monthLabel={monthSummary.monthLabel}
          onToggleMonth={toggleMonth}
          onBellPress={() => router.push("/(tabs)/a/notification")}
        />

        <View
          style={{
            flexDirection: "row",
            gap: tokens.spacing.sm,
          }}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={() => router.push("/(tabs)/a/budget")}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                padding: tokens.spacing.md,
                ...card,
              }}
            >
              <Caption muted>This month spent</Caption>
              <Body
                weight="semibold"
                style={{
                  marginTop: tokens.spacing.xs,
                  fontSize: tokens.typography.sizes["2xl"],
                }}
              >
                {monthSummary.spent}
              </Body>
            </View>
          </Pressable>

          <View
            style={{
              flex: 1,
              gap: tokens.spacing.sm,
            }}
          >
            <Pressable
              style={{
                flex: 1,
                backgroundColor: colors.inverseOnSurface,
                padding: tokens.spacing.md,
                ...card,
                borderWidth: 1,
                borderColor: colors.outlineVariant,
                justifyContent: "center",
              }}
              onPress={() => router.push("/(tabs)/a/claim")}
            >
              <BodySmall color={colors.inverseSurface}>To claim</BodySmall>
              <Body weight="semibold" style={{ marginTop: tokens.spacing.xs }}>
                {monthSummary.toClaim}
              </Body>
            </Pressable>

            <Pressable
              style={{
                flex: 1,
                backgroundColor: colors.surfaceVariant,
                padding: tokens.spacing.md,
                ...card,
                borderWidth: 1,
                borderColor: colors.outlineVariant,
                justifyContent: "center",
              }}
              onPress={() => router.push("/(tabs)/a/settlement")}
            >
              <BodySmall muted>To pay</BodySmall>
              <Body weight="semibold" style={{ marginTop: tokens.spacing.xs }}>
                {monthSummary.toPay}
              </Body>
            </Pressable>
          </View>
        </View>

        <View style={{ gap: tokens.spacing.xs }}>
          <Body weight="semibold">Overview</Body>

          <View
            style={{
              flexDirection: "row",
              gap: tokens.spacing.sm,
            }}
          >
            <View style={{ flex: 1, gap: tokens.spacing.sm }}>
              <Pressable
                style={{
                  borderRadius: tokens.radii.lg,
                  padding: tokens.spacing.md,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.outlineVariant,
                  minHeight: tokens.spacing["2xl"],
                }}
                onPress={() => {}}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: tokens.spacing["xs"],
                  }}
                >
                  <BodySmall weight="semibold">Profile & setup</BodySmall>
                  <UserRound
                    size={tokens.sizes.icon.sm}
                    color={colors.onSurfaceVariant}
                  />
                </View>
                <Caption>
                  Complete profile to unlock smarter suggestions.
                </Caption>
              </Pressable>

              <Pressable
                style={{
                  borderRadius: tokens.radii.lg,
                  padding: tokens.spacing.md,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.outlineVariant,
                  minHeight: tokens.spacing["3xl"],
                }}
                onPress={() => router.push("/(tabs)/a/budget")}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: tokens.spacing.sm,
                  }}
                >
                  <BodySmall weight="semibold">Budget</BodySmall>
                  <Wallet
                    size={tokens.sizes.icon.sm}
                    color={colors.onSurfaceVariant}
                  />
                </View>
                <Body weight="semibold" numberOfLines={1}>
                  {overview.budget.primary}
                </Body>
                <Caption numberOfLines={1}>{overview.budget.secondary}</Caption>
                {overview.budget.topCategory && (
                  <Caption numberOfLines={1}>
                    Top spend: {overview.budget.topCategory}
                  </Caption>
                )}
              </Pressable>

              <Pressable
                style={{
                  borderRadius: tokens.radii.lg,
                  padding: tokens.spacing.md,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.outlineVariant,
                  minHeight: tokens.spacing["2xl"],
                }}
                onPress={() => router.push("/(tabs)/a/wishlist")}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: tokens.spacing.sm,
                  }}
                >
                  <BodySmall weight="semibold">Wishlist</BodySmall>
                  <PiggyBank
                    size={tokens.sizes.icon.sm}
                    color={colors.onSurfaceVariant}
                  />
                </View>
                <Body weight="semibold" numberOfLines={1}>
                  {overview.wishlist.itemsCount} items ·{" "}
                  {overview.wishlist.totalSaved}
                </Body>
                <Caption numberOfLines={1}>
                  {overview.wishlist.fundedPercent}% of wishes funded
                </Caption>
                <Caption numberOfLines={1}>
                  {overview.wishlist.secondary}
                </Caption>
              </Pressable>
            </View>

            <View style={{ flex: 1, gap: tokens.spacing.sm }}>
              <Pressable
                style={{
                  borderRadius: tokens.radii.lg,
                  padding: tokens.spacing.md,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.outlineVariant,
                  minHeight: tokens.spacing["2xl"],
                }}
                onPress={() => router.push("/(tabs)/a/claim")}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: tokens.spacing.sm,
                  }}
                >
                  <BodySmall weight="semibold">Claims</BodySmall>
                  <ReceiptText
                    size={tokens.sizes.icon.sm}
                    color={colors.onSurfaceVariant}
                  />
                </View>
                <Body weight="semibold" numberOfLines={1}>
                  {overview.claim.totalToClaim}
                </Body>
                <Caption numberOfLines={1}>{overview.claim.secondary}</Caption>
                {overview.claim.lastLabel && (
                  <Caption numberOfLines={1}>
                    Last: {overview.claim.lastLabel}
                  </Caption>
                )}
              </Pressable>

              <Pressable
                style={{
                  borderRadius: tokens.radii.lg,
                  padding: tokens.spacing.md,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.outlineVariant,
                  minHeight: tokens.spacing["3xl"],
                }}
                onPress={() => router.push("/(tabs)/a/settlement")}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: tokens.spacing.sm,
                  }}
                >
                  <BodySmall weight="semibold">Settlements</BodySmall>
                  <HandCoins
                    size={tokens.sizes.icon.sm}
                    color={colors.onSurfaceVariant}
                  />
                </View>
                <Body weight="semibold" numberOfLines={1}>
                  {overview.settlement.totalToPay}
                </Body>
                <Caption numberOfLines={1}>
                  {overview.settlement.breakdownLabel}
                </Caption>
                <Caption numberOfLines={1}>
                  {overview.settlement.secondary}
                </Caption>
              </Pressable>

              <Pressable
                style={{
                  borderRadius: tokens.radii.lg,
                  padding: tokens.spacing.md,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.outlineVariant,
                  minHeight: tokens.spacing["2xl"],
                }}
                onPress={() => router.push("/(tabs)/a/calculator")}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: tokens.spacing["xs"],
                  }}
                >
                  <BodySmall weight="semibold">Calculator tools</BodySmall>
                  <CalculatorIcon
                    size={tokens.sizes.icon.sm}
                    color={colors.onSurfaceVariant}
                  />
                </View>
                <Body weight="semibold" numberOfLines={1}>
                  {overview.calculator.primary}
                </Body>
                <Caption numberOfLines={2}>
                  {overview.calculator.secondary}
                </Caption>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={{ gap: tokens.spacing.sm }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Body weight="semibold">Recent activity</Body>

            <Button
              variant="secondary"
              size="sm"
              onPress={() => router.push("/(tabs)/a/activity")}
              accessibilityLabel="View all activity"
            >
              View all
            </Button>
          </View>

          <View
            style={{
              backgroundColor: colors.surface,
              ...card,
              paddingVertical: tokens.spacing.sm,
            }}
          >
            {timeline.length === 0 ? (
              <EmptyState
                Icon={Sparkles}
                title="No activity yet"
                subtitle="Start by logging a spend or a front."
              />
            ) : (
              timeline.map((item, idx) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: tokens.spacing.md,
                    paddingVertical: tokens.spacing.sm,
                    borderTopWidth: idx === 0 ? 0 : 1,
                    borderTopColor: colors.outlineVariant,
                    gap: tokens.spacing.md,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: colors.surfaceVariant,
                    }}
                  >
                    <BodySmall color={colors.onPrimaryContainer}>–</BodySmall>
                  </View>
                  <View style={{ flex: 1, gap: tokens.spacing.xs }}>
                    <Body numberOfLines={1}>{item.label}</Body>
                    <Caption>{item.date}</Caption>
                  </View>
                  <Body weight="semibold">{item.amount}</Body>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
