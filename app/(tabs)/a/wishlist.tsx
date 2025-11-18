import React, { useState, useCallback } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useTheme, Avatar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../../contexts/designContext";
import { HandCoins, AlertCircle, Clock3 } from "lucide-react-native";
import { EmptyState } from "../../../components/molecule/emptyState";
import { Header } from "../../../components/shared/header";
import { useTab } from "../../../hooks/useTab";
import { useFocusEffect, useRouter } from "expo-router";
import { useWishlist, WishlistFilterKey } from "../../../hooks/useWishlist";
import { Body, BodySmall, Caption } from "../../../components/atom/text";

export default function Wishlist() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { summary, items, filters, useMock, toggleMock } = useWishlist();
  const [activeFilter, setActiveFilter] = useState<WishlistFilterKey>("all");
  const { lockHidden, unlockHidden } = useTab();

  useFocusEffect(
    useCallback(() => {
      lockHidden();
      return () => unlockHidden();
    }, [lockHidden, unlockHidden])
  );

  const card = { borderRadius: tokens.radii.lg } as const;

  const filtered = items.filter((item) =>
    activeFilter === "all" ? true : item.status === activeFilter
  );

  const renderStatusLabel = (status: (typeof items)[number]["status"]) => {
    if (status === "notStarted") return "Not started";
    if (status === "inProgress") return "In progress";
    if (status === "almost") return "Almost there";
    return "Done";
  };

  const statusColor = (status: (typeof items)[number]["status"]) => {
    if (status === "done") return colors.primary;
    if (status === "almost") return colors.secondary;
    return colors.onSurfaceVariant;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingTop: tokens.spacing.lg,
          paddingBottom: tokens.spacing["3xl"] * 4,
          gap: tokens.spacing.md,
        }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        bounces={false}
      >
        <Header
          title="Wishlist"
          subtitle={
            useMock ? "Showing sample wishlist items" : "Your current wishlist"
          }
          rightSlot={
            <Pressable
              onPress={toggleMock}
              style={{
                paddingHorizontal: tokens.spacing.sm,
                paddingVertical: tokens.spacing.xs,
                borderRadius: tokens.radii.pill,
                backgroundColor: useMock
                  ? colors.primaryContainer
                  : colors.surface,
                borderWidth: 1,
                borderColor: useMock ? colors.primary : colors.outlineVariant,
              }}
            >
              <BodySmall
                weight="semibold"
                color={useMock ? colors.primary : colors.onSurfaceVariant}
              >
                {useMock ? "Mock on" : "Mock off"}
              </BodySmall>
            </Pressable>
          }
          style={{ paddingHorizontal: 0, paddingBottom: tokens.spacing.sm }}
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: tokens.spacing.xs,
              }}
            >
              <Caption color={colors.onPrimaryContainer}>
                {summary.title}
              </Caption>
              <HandCoins
                size={tokens.sizes.icon.sm}
                color={colors.onPrimaryContainer}
              />
            </View>
            <Body
              weight="semibold"
              color={colors.onPrimaryContainer}
              style={{ fontSize: tokens.typography.sizes["2xl"] }}
            >
              {summary.totalSavedAmount}
            </Body>
            <Caption color={colors.onPrimaryContainer}>
              {summary.totalItems} items • {summary.itemsDone} reached
            </Caption>
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
                Rank your wishes
              </BodySmall>
            </View>
            <Caption muted>Focus on 2–3 high priority items at a time.</Caption>
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
            <Body
              weight="semibold"
              color={colors.onSurface}
              style={{ fontSize: tokens.typography.sizes.md }}
            >
              Things you are saving for
            </Body>
            <View style={{ flexDirection: "row", gap: tokens.spacing.xs }}>
              {filters.map((f) => {
                const active = activeFilter === f.key;
                return (
                  <Pressable
                    key={f.key}
                    onPress={() => setActiveFilter(f.key)}
                    style={{
                      paddingHorizontal: tokens.spacing.sm,
                      paddingVertical: tokens.spacing["xs"],
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
              backgroundColor: colors.surface,
              ...card,
              paddingVertical: tokens.spacing.sm,
            }}
          >
            {filtered.length === 0 ? (
              <EmptyState
                Icon={AlertCircle}
                title={useMock ? "No results" : "No wishlist items yet"}
                subtitle={
                  useMock
                    ? "Try changing the filter to see other statuses."
                    : "Add things you want and start planning how to fund them."
                }
              />
            ) : (
              filtered.map((item, idx) => (
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
                  <Avatar.Text
                    size={32}
                    label={item.label.charAt(0).toUpperCase()}
                    style={{
                      backgroundColor: colors.primaryContainer,
                    }}
                    color={colors.onPrimaryContainer}
                  />
                  <View style={{ flex: 1, gap: tokens.spacing["xs"] }}>
                    <BodySmall
                      weight="semibold"
                      color={colors.onSurface}
                      numberOfLines={1}
                    >
                      {item.label}
                    </BodySmall>
                    <Caption muted numberOfLines={1}>
                      {item.category} · {item.monthlyPlan}
                    </Caption>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: tokens.spacing["xs"],
                      }}
                    >
                      <Clock3
                        size={tokens.sizes.icon.md}
                        color={colors.onSurfaceVariant}
                      />
                      <Caption muted numberOfLines={1}>
                        {item.targetDateLabel} • {item.percentFunded}% funded
                      </Caption>
                    </View>
                  </View>
                  <View
                    style={{
                      alignItems: "flex-end",
                      gap: tokens.spacing["xs"],
                    }}
                  >
                    <BodySmall weight="semibold" color={colors.onSurface}>
                      {item.savedAmount} / {item.targetAmount}
                    </BodySmall>
                    <Caption color={statusColor(item.status)}>
                      {renderStatusLabel(item.status)}
                    </Caption>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <View
        pointerEvents="box-none"
        style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: tokens.spacing.sm,
            paddingHorizontal: tokens.spacing.lg,
            paddingTop: tokens.spacing.sm,
            paddingBottom: insets.bottom + tokens.spacing.sm,
            backgroundColor: colors.background,
            borderTopWidth: 0.5,
            borderTopColor: colors.outlineVariant,
          }}
        >
          <Pressable
            style={{
              flex: 1,
              paddingVertical: tokens.spacing.sm,
              borderRadius: tokens.radii.lg,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.outlineVariant,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => router.push("/(modals)/addWishlist")}
          >
            <BodySmall weight="semibold" color={colors.onSurface}>
              Add to wishlist
            </BodySmall>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
