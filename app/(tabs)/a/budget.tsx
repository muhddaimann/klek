import React, { useState, useCallback } from "react";
import { View, ScrollView } from "react-native";
import { useTheme, Avatar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../../contexts/designContext";
import { PieChart, AlertCircle } from "lucide-react-native";
import { EmptyState } from "../../../components/molecule/emptyState";
import { Header } from "../../../components/shared/header";
import { useTab } from "../../../hooks/useTab";
import { useFocusEffect, useRouter } from "expo-router";
import { useBudget, BudgetFilterKey } from "../../../hooks/useBudget";
import { Body, BodySmall, Caption } from "../../../components/atom/text";
import { Button } from "../../../components/atom/button";

export default function Budget() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { summary, categories, filters, isSetup, useMock, toggleMock } =
    useBudget();
  const [activeFilter, setActiveFilter] = useState<BudgetFilterKey>("all");
  const { lockHidden, unlockHidden } = useTab();

  useFocusEffect(
    useCallback(() => {
      lockHidden();
      return () => unlockHidden();
    }, [lockHidden, unlockHidden])
  );

  const card = { borderRadius: tokens.radii.lg } as const;

  const filtered = categories.filter((item) =>
    activeFilter === "all" ? true : item.status === activeFilter
  );

  const renderStatusLabel = (status: (typeof categories)[number]["status"]) => {
    if (status === "over") return "Over budget";
    if (status === "high") return "Nearly used";
    return "On track";
  };

  const statusColor = (status: (typeof categories)[number]["status"]) => {
    if (status === "over") return colors.error;
    if (status === "high") return colors.primary;
    return colors.onSurfaceVariant;
  };

  const progressWidth = (percent: number): `${number}%` =>
    `${Math.min(100, Math.max(0, percent))}%` as `${number}%`;

  const canAddRecord = useMock || isSetup;
  const isUpdateMode = !useMock;
  const budgetCtaLabel = isUpdateMode ? "Update budget" : "Create budget";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: tokens.spacing["3xl"] * 2,
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
            title="Budget"
            subtitle={
              useMock
                ? "Showing sample monthly budget"
                : isSetup
                ? "Your monthly budget overview"
                : "No budget set yet"
            }
            rightSlot={
              <Button
                onPress={toggleMock}
                variant="outline"
                size="sm"
                rounded="pill"
                style={{
                  paddingHorizontal: tokens.spacing.sm,
                  paddingVertical: tokens.spacing["xs"],
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
                {summary.monthLabel}
              </Caption>
              <PieChart
                size={tokens.sizes.icon.sm}
                color={colors.onPrimaryContainer}
              />
            </View>
            <Body
              weight="semibold"
              color={colors.onPrimaryContainer}
              style={{ fontSize: tokens.typography.sizes["2xl"] }}
            >
              {summary.totalSpent}
            </Body>
            <BodySmall
              color={colors.onPrimaryContainer}
              style={{
                marginTop: tokens.spacing.xs,
                opacity: 0.85,
              }}
              numberOfLines={1}
            >
              Spent of {summary.totalBudget} • {summary.percentUsed}% used
            </BodySmall>
            <BodySmall
              color={colors.onPrimaryContainer}
              style={{
                marginTop: tokens.spacing["xs"],
                opacity: 0.9,
              }}
              numberOfLines={1}
            >
              Remaining {summary.remaining}
            </BodySmall>
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
                Set simple buckets
              </BodySmall>
            </View>
            <Caption muted style={{ marginTop: tokens.spacing.xs }}>
              Start with food, transport, bills, and fun money.
            </Caption>
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
            <Body weight="semibold" color={colors.onSurface}>
              Categories
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
                      paddingVertical: tokens.spacing["xs"],
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
                title={useMock ? "No results" : "No budget yet"}
                subtitle={
                  useMock
                    ? "Try changing the filter to see other statuses."
                    : "Set up your monthly budget to start tracking."
                }
              />
            ) : (
              filtered.map((item, idx) => (
                <View
                  key={item.id}
                  style={{
                    paddingHorizontal: tokens.spacing.md,
                    paddingVertical: tokens.spacing.sm,
                    borderTopWidth: idx === 0 ? 0 : 1,
                    borderTopColor: colors.outlineVariant,
                    gap: tokens.spacing["xs"],
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
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
                      <Body
                        color={colors.onSurface}
                        numberOfLines={1}
                        style={{ fontSize: tokens.typography.sizes.sm }}
                      >
                        {item.label}
                      </Body>
                      <Caption muted numberOfLines={1}>
                        {item.spent} of {item.budget} • {item.percentUsed}%
                      </Caption>
                    </View>
                    <BodySmall
                      weight="semibold"
                      color={statusColor(item.status)}
                    >
                      {renderStatusLabel(item.status)}
                    </BodySmall>
                  </View>

                  <View
                    style={{
                      marginTop: tokens.spacing["xs"],
                      height: 4,
                      borderRadius: 999,
                      backgroundColor: colors.outlineVariant,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        height: "100%",
                        width: progressWidth(item.percentUsed),
                        backgroundColor:
                          item.status === "over"
                            ? colors.error
                            : item.status === "high"
                            ? colors.primary
                            : colors.onSurfaceVariant,
                      }}
                    />
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
            disabled={!canAddRecord}
            onPress={() => {
              if (!canAddRecord) return;
              router.push("/(modals)/addRecord");
            }}
            variant="secondary"
            rounded="lg"
            style={{
              flex: 1,
            }}
          >
            <Body
              weight="semibold"
              color={colors.onSurface}
              style={{ fontSize: tokens.typography.sizes.sm }}
            >
              Add record
            </Body>
          </Button>

          <Button
            onPress={() =>
              router.push({
                pathname: "/(modals)/addBudget",
                params: { mode: isUpdateMode ? "update" : "create" },
              })
            }
            variant="default"
            rounded="lg"
            style={{
              flex: 1,
            }}
          >
            <Body
              weight="semibold"
              color={colors.onPrimary}
              style={{ fontSize: tokens.typography.sizes.sm }}
            >
              {budgetCtaLabel}
            </Body>
          </Button>
        </View>
      </View>
    </View>
  );
}
