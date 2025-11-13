import React, { useState, useCallback } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useTheme, Text, Avatar } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { HandCoins, AlertCircle, Clock3 } from "lucide-react-native";
import { EmptyState } from "../../../components/molecule/emptyState";
import { Header } from "../../../components/shared/header";
import { useTab } from "../../../hooks/useTab";
import { useFocusEffect } from "expo-router";

const MOCK_SUMMARY = {
  monthLabel: "November fronts",
  totalToClaim: "RM 0",
  activeFriends: 0,
};

const MOCK_LENDERS: {
  id: string;
  name: string;
  note: string;
  amount: string;
  status: "pending" | "overdue" | "partial";
  lastActivity: string;
}[] = [];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "overdue", label: "Overdue" },
];

export default function Claim() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "overdue"
  >("all");

  const { lockHidden, unlockHidden } = useTab();

  useFocusEffect(
    useCallback(() => {
      lockHidden();
      return () => unlockHidden();
    }, [lockHidden, unlockHidden])
  );

  const card = { borderRadius: tokens.radii.lg } as const;

  const filtered = MOCK_LENDERS.filter((item) =>
    activeFilter === "all" ? true : item.status === activeFilter
  );

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
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        bounces={false}
      >
        <Header title="Claim dashboard" subtitle="Subs" />

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
              <Text
                style={{
                  fontSize: tokens.typography.sizes.xs,
                  color: colors.onPrimaryContainer,
                }}
              >
                Total to claim
              </Text>
              <HandCoins
                size={tokens.sizes.icon.sm}
                color={colors.onPrimaryContainer}
              />
            </View>
            <Text
              style={{
                fontSize: tokens.typography.sizes["2xl"],
                fontWeight: tokens.typography.weights.semibold,
                color: colors.onPrimaryContainer,
              }}
            >
              {MOCK_SUMMARY.totalToClaim}
            </Text>
            <Text
              style={{
                marginTop: tokens.spacing.xs,
                fontSize: tokens.typography.sizes.xs,
                color: colors.onPrimaryContainer,
                opacity: 0.85,
              }}
              numberOfLines={1}
            >
              From {MOCK_SUMMARY.activeFriends} friends this month.
            </Text>
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
              <Text
                style={{
                  fontSize: tokens.typography.sizes.xs,
                  color: colors.onSurfaceVariant,
                }}
              >
                Tip
              </Text>
              <Text
                style={{
                  fontSize: tokens.typography.sizes.sm,
                  color: colors.onSurface,
                  fontWeight: tokens.typography.weights.med,
                }}
              >
                Log right after paying
              </Text>
            </View>
            <Text
              style={{
                marginTop: tokens.spacing.xs,
                fontSize: tokens.typography.sizes.xs,
                color: colors.onSurfaceVariant,
              }}
            >
              So you don’t forget who owes what.
            </Text>
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
            <Text
              style={{
                fontSize: tokens.typography.sizes.md,
                fontWeight: tokens.typography.weights.semibold,
                color: colors.onSurface,
              }}
            >
              Friends who owe you
            </Text>
            <View style={{ flexDirection: "row", gap: tokens.spacing.xs }}>
              {FILTERS.map((f) => {
                const active = activeFilter === f.key;
                return (
                  <Pressable
                    key={f.key}
                    onPress={() => setActiveFilter(f.key as any)}
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
                    <Text
                      style={{
                        fontSize: tokens.typography.sizes.xs,
                        color: active
                          ? colors.primary
                          : colors.onSurfaceVariant,
                        fontWeight: tokens.typography.weights.semibold,
                      }}
                    >
                      {f.label}
                    </Text>
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
                title="No claims yet"
                subtitle="When you pay first for friends, log it here to keep track."
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
                    <Text
                      style={{
                        fontSize: tokens.typography.sizes.sm,
                        color: colors.onSurface,
                      }}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
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
                      <Text
                        style={{
                          fontSize: tokens.typography.sizes.xs,
                          color: colors.onSurfaceVariant,
                        }}
                        numberOfLines={1}
                      >
                        {item.lastActivity}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      alignItems: "flex-end",
                      gap: tokens.spacing["xs"],
                    }}
                  >
                    <Text
                      style={{
                        fontSize: tokens.typography.sizes.sm,
                        fontWeight: tokens.typography.weights.semibold,
                        color: colors.onSurface,
                      }}
                    >
                      {item.amount}
                    </Text>
                    <Text
                      style={{
                        fontSize: tokens.typography.sizes.xs,
                        color:
                          item.status === "overdue"
                            ? colors.error
                            : colors.onSurfaceVariant,
                      }}
                    >
                      {item.status === "pending"
                        ? "Pending"
                        : item.status === "overdue"
                        ? "Overdue"
                        : "Partially paid"}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
