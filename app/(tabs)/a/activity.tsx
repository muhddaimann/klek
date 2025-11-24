import React, { useState, useCallback } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../../contexts/designContext";
import { useTab } from "../../../hooks/useTab";
import { Header } from "../../../components/shared/header";
import { EmptyState } from "../../../components/molecule/emptyState";
import {
  Sparkles,
  HandCoins,
  Wallet,
  PiggyBank,
  ArrowDownRight,
} from "lucide-react-native";
import {
  useActivity,
  type ActivityMonthKey,
  type ActivityItem,
} from "../../../hooks/useActivity";
import { Body, BodySmall, Caption } from "../../../components/atom/text";
import { useFocusEffect } from "expo-router";

export default function Activity() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const { onScroll, lockHidden, unlockHidden } = useTab();

  const [monthKey, setMonthKey] = useState<ActivityMonthKey>("november");
  const { items, filters, activeFilter, setActiveFilter, summary, hasData } =
    useActivity(monthKey);

  const card = { borderRadius: tokens.radii.lg } as const;

  useFocusEffect(
    useCallback(() => {
      lockHidden();
      return () => unlockHidden();
    }, [lockHidden, unlockHidden])
  );

  const toggleMonth = () => {
    setMonthKey((prev) => (prev === "november" ? "october" : "november"));
  };

  const monthLabel = monthKey === "november" ? "November" : "October";

  const renderKindLabel = (kind: ActivityItem["kind"]) => {
    if (kind === "expense") return "Spend";
    if (kind === "lent") return "Fronted";
    if (kind === "receive") return "Received";
    if (kind === "settlement") return "Settlement";
    return "Wishlist";
  };

  const renderKindIcon = (kind: ActivityItem["kind"]) => {
    if (kind === "expense") return Wallet;
    if (kind === "lent") return HandCoins;
    if (kind === "receive") return ArrowDownRight;
    if (kind === "settlement") return HandCoins;
    return PiggyBank;
  };

  const amountColor = (kind: ActivityItem["kind"]) => {
    if (kind === "receive") return colors.primary;
    if (kind === "wishlist") return colors.onSurface;
    return colors.onSurface;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + tokens.spacing["3xl"] * 9,
          gap: tokens.spacing.md,
        }}
        bounces={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
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
            title="Activity"
            subtitle={
              hasData
                ? `${summary.totalCount} items · ${summary.totalOut} out · ${summary.totalIn} in`
                : "No activity for this month yet"
            }
            rightSlot={
              <Pressable
                onPress={toggleMonth}
                style={{
                  borderRadius: tokens.radii.lg,
                  paddingHorizontal: tokens.spacing.sm,
                  paddingVertical: tokens.spacing.xs,
                  backgroundColor: colors.surface,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: tokens.spacing["xs"],
                }}
              >
                <BodySmall muted>{monthLabel}</BodySmall>
              </Pressable>
            }
            style={{ paddingHorizontal: 0 }}
          />
        </View>

        <View
          style={{
            paddingHorizontal: tokens.spacing.lg,
            gap: tokens.spacing.sm,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Body weight="semibold">Filters</Body>
            <Caption muted>Tap to focus on a type</Caption>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: tokens.spacing.xs,
            }}
          >
            {filters.map((f) => {
              const active = activeFilter === f.key;
              return (
                <Pressable
                  key={f.key}
                  onPress={() => setActiveFilter(f.key)}
                  style={{
                    paddingHorizontal: tokens.spacing.sm,
                    paddingVertical: tokens.spacing.xs,
                    borderRadius: tokens.radii.pill,
                    backgroundColor: active
                      ? colors.primaryContainer
                      : colors.surface,
                    borderWidth: 1,
                    borderColor: active
                      ? colors.primary
                      : colors.outlineVariant,
                  }}
                >
                  <BodySmall
                    weight="semibold"
                    color={active ? colors.primary : colors.onSurfaceVariant}
                  >
                    {f.label}
                  </BodySmall>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: tokens.spacing.lg,
            gap: tokens.spacing.sm,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Body weight="semibold">Timeline</Body>
            <BodySmall color={colors.primary}>Latest first</BodySmall>
          </View>

          <View
            style={{
              backgroundColor: colors.surface,
              ...card,
              paddingVertical: tokens.spacing.sm,
            }}
          >
            {items.length === 0 ? (
              <EmptyState
                Icon={Sparkles}
                title="No activity"
                subtitle={
                  hasData
                    ? "Try changing the filter to see other items."
                    : "Start by logging a spend, front, or settlement."
                }
              />
            ) : (
              items.map((item, idx) => {
                const Icon = renderKindIcon(item.kind);
                return (
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
                      <Icon
                        size={tokens.sizes.icon.sm}
                        color={colors.onSurfaceVariant}
                      />
                    </View>
                    <View style={{ flex: 1, gap: tokens.spacing["xs"] }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Body numberOfLines={1}>{item.label}</Body>
                        <Caption>{item.date}</Caption>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: tokens.spacing["xs"],
                        }}
                      >
                        <Caption>{renderKindLabel(item.kind)}</Caption>
                      </View>
                    </View>
                    <Body weight="semibold" color={amountColor(item.kind)}>
                      {item.amount}
                    </Body>
                  </View>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
