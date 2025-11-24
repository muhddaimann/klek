import React, { useState, useCallback } from "react";
import { View, ScrollView } from "react-native";
import { useTheme, Avatar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../../contexts/designContext";
import { HandCoins, AlertCircle, Clock3 } from "lucide-react-native";
import { EmptyState } from "../../../components/molecule/emptyState";
import { Header } from "../../../components/shared/header";
import { useTab } from "../../../hooks/useTab";
import { useFocusEffect, useRouter } from "expo-router";
import { useClaim, ClaimFilterKey } from "../../../hooks/useClaim";
import { Body, BodySmall, Caption } from "../../../components/atom/text";
import { Button } from "../../../components/atom/button";

export default function Claim() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const { summary, lenders, filters, useMock, toggleMock } = useClaim();
  const [activeFilter, setActiveFilter] = useState<ClaimFilterKey>("all");
  const router = useRouter();
  const { lockHidden, unlockHidden } = useTab();

  useFocusEffect(
    useCallback(() => {
      lockHidden();
      return () => unlockHidden();
    }, [lockHidden, unlockHidden])
  );

  const card = { borderRadius: tokens.radii.lg } as const;

  const filtered = lenders.filter((item) =>
    activeFilter === "all" ? true : item.status === activeFilter
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: tokens.spacing["3xl"] * 4,
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
            title="Claim dashboard"
            subtitle={useMock ? "Showing sample claims" : "No sample data"}
            rightSlot={
              <Button
                onPress={toggleMock}
                variant="outline"
                size="sm"
                rounded="pill"
                style={{
                  paddingHorizontal: tokens.spacing.sm,
                  paddingVertical: tokens.spacing.xs,
                  backgroundColor: useMock
                    ? colors.primaryContainer
                    : colors.surface,
                  borderColor: useMock ? colors.primary : colors.outlineVariant,
                }}
              >
                <BodySmall
                  weight="semibold"
                  color={useMock ? colors.primary : colors.onSurfaceVariant}
                >
                  {useMock ? "Mock on" : "Mock off"}
                </BodySmall>
              </Button>
            }
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: tokens.spacing.xs,
              }}
            >
              <Caption color={colors.onPrimaryContainer}>
                Total to claim
              </Caption>
              <HandCoins
                size={tokens.sizes.icon.sm}
                color={colors.onPrimaryContainer}
              />
            </View>
            <Body
              weight="semibold"
              color={colors.onPrimaryContainer}
              style={{
                fontSize: tokens.typography.sizes["2xl"],
              }}
            >
              {summary.totalToClaim}
            </Body>
            <Caption color={colors.onPrimaryContainer}>
              From {summary.activeFriends} friends this month.
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
                Log right after paying
              </BodySmall>
            </View>
            <Caption muted>So you don’t forget who owes what.</Caption>
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
            <Body
              weight="semibold"
              color={colors.onSurface}
              style={{ fontSize: tokens.typography.sizes.md }}
            >
              Friends who owe you
            </Body>
            <View style={{ flexDirection: "row", gap: tokens.spacing.xs }}>
              {filters.map((f) => {
                const active = activeFilter === f.key;
                return (
                  <Button
                    key={f.key}
                    onPress={() => setActiveFilter(f.key)}
                    variant="ghost"
                    size="sm"
                    rounded="pill"
                    style={{
                      paddingHorizontal: tokens.spacing.sm,
                      paddingVertical: tokens.spacing["xxs"],
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
                  </Button>
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
                title={useMock ? "No results" : "No claims yet"}
                subtitle={
                  useMock
                    ? "Try changing the filter to see other statuses."
                    : "When you pay first for friends, log it here to keep track."
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
                    label={item.name.charAt(0).toUpperCase()}
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
                      {item.name}
                    </BodySmall>
                    <Caption muted numberOfLines={1}>
                      {item.note}
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
                        {item.lastActivity}
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
                      {item.amount}
                    </BodySmall>
                    <Caption
                      color={
                        item.status === "overdue"
                          ? colors.error
                          : colors.onSurfaceVariant
                      }
                    >
                      {item.status === "pending"
                        ? "Pending"
                        : item.status === "overdue"
                        ? "Overdue"
                        : "Partially paid"}
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
          <Button
            onPress={() => router.push("/(modals)/manualClaim")}
            variant="secondary"
            rounded="lg"
            style={{
              flex: 1,
            }}
          >
            <BodySmall weight="semibold" color={colors.onSurface}>
              Manual claim
            </BodySmall>
          </Button>

          <Button
            onPress={() => router.push("/(modals)/billSplit")}
            variant="default"
            rounded="lg"
            style={{
              flex: 1,
            }}
          >
            <BodySmall weight="semibold" color={colors.onPrimary}>
              Bill split
            </BodySmall>
          </Button>
        </View>
      </View>
    </View>
  );
}
