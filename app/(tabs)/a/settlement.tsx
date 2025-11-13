import React, { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useTheme, Text, Avatar } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { CheckCircle2, AlertCircle, Clock3 } from "lucide-react-native";
import { EmptyState } from "../../../components/molecule/emptyState";

const MOCK_SUMMARY = {
  monthLabel: "November settlements",
  totalSettled: "RM 0",
  friendsSettled: 0,
};

const MOCK_SETTLEMENTS: {
  id: string;
  name: string;
  note: string;
  amount: string;
  status: "settled" | "overpaid" | "writtenOff";
  lastActivity: string;
}[] = [];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "settled", label: "Settled" },
  { key: "overpaid", label: "Overpaid" },
  { key: "writtenOff", label: "Written off" },
];

export default function Settlements() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const [activeFilter, setActiveFilter] = useState<
    "all" | "settled" | "overpaid" | "writtenOff"
  >("all");

  const card = { borderRadius: tokens.radii.lg } as const;

  const filtered = MOCK_SETTLEMENTS.filter((item) =>
    activeFilter === "all" ? true : item.status === activeFilter
  );

  const statusLabel = (s: typeof MOCK_SETTLEMENTS[number]["status"]) => {
    if (s === "settled") return "Settled";
    if (s === "overpaid") return "Overpaid";
    return "Written off";
  };

  const statusColor = (s: typeof MOCK_SETTLEMENTS[number]["status"]) => {
    if (s === "overpaid") return colors.secondary ?? colors.primary;
    if (s === "writtenOff") return colors.error;
    return colors.onSurfaceVariant;
  };

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
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: tokens.spacing.md,
          }}
        >
          <View style={{ flex: 1, gap: tokens.spacing["xxs"] }}>
            <Text
              style={{
                fontSize: tokens.typography.sizes.xs,
                color: colors.onSurfaceVariant,
              }}
            >
              Fully or partially settled
            </Text>
            <Text
              style={{
                fontSize: tokens.typography.sizes.xl,
                fontWeight: tokens.typography.weights.semibold,
                color: colors.onSurface,
              }}
            >
              Settlements dashboard
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: tokens.spacing.sm,
              paddingVertical: tokens.spacing.xs,
              borderRadius: tokens.radii.lg,
              backgroundColor: colors.surface,
            }}
          >
            <Text
              style={{
                fontSize: tokens.typography.sizes.xs,
                color: colors.onSurfaceVariant,
              }}
            >
              {MOCK_SUMMARY.monthLabel}
            </Text>
          </View>
        </View>

        {/* Summary row */}
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
                Settled this month
              </Text>
              <CheckCircle2
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
              {MOCK_SUMMARY.totalSettled}
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
              With {MOCK_SUMMARY.friendsSettled} friends this month.
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
                Mark as settled ASAP
              </Text>
            </View>
            <Text
              style={{
                marginTop: tokens.spacing.xs,
                fontSize: tokens.typography.sizes.xs,
                color: colors.onSurfaceVariant,
              }}
            >
              So your “to claim” stays clean and accurate.
            </Text>
          </View>
        </View>

        {/* List + filters */}
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
              Settled with friends
            </Text>
            <View style={{ flexDirection: "row", gap: tokens.spacing.xs }}>
              {FILTERS.map((f) => {
                const active = activeFilter === (f.key as any);
                return (
                  <Pressable
                    key={f.key}
                    onPress={() =>
                      setActiveFilter(f.key as any)
                    }
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
                title="No settlements yet"
                subtitle="When someone pays you back or you close a claim, mark it as settled here."
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
                  <View style={{ flex: 1, gap: tokens.spacing.xs }}>
                    <Text
                      style={{
                        fontSize: tokens.typography.sizes.sm,
                        color: colors.onSurface,
                      }}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: tokens.typography.sizes.xs,
                        color: colors.onSurfaceVariant,
                      }}
                      numberOfLines={1}
                    >
                      {item.note}
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
                        color: statusColor(item.status),
                      }}
                    >
                      {statusLabel(item.status)}
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
