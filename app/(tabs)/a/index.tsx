import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useTheme, Text } from "react-native-paper";
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
              Good evening
            </Text>
            <Text
              style={{
                fontSize: tokens.typography.sizes.xl,
                fontWeight: tokens.typography.weights.semibold,
                color: colors.onSurface,
              }}
            >
              Your money at a glance
            </Text>
          </View>
          <Pressable
            onPress={toggleMonth}
            style={{
              borderRadius: tokens.radii.lg,
              paddingHorizontal: tokens.spacing.sm,
              paddingVertical: tokens.spacing.xs,
              backgroundColor: colors.surface,
              flexDirection: "row",
              alignItems: "center",
              gap: tokens.spacing.xs,
            }}
          >
            <Text
              style={{
                fontSize: tokens.typography.sizes.xs,
                color: colors.onSurfaceVariant,
              }}
            >
              {monthSummary.monthLabel}
            </Text>
          </Pressable>
        </View>

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
              <Text
                style={{
                  fontSize: tokens.typography.sizes.xs,
                  color: colors.onSurfaceVariant,
                }}
              >
                This month spent
              </Text>
              <Text
                style={{
                  marginTop: tokens.spacing.xs,
                  fontSize: tokens.typography.sizes["2xl"],
                  fontWeight: tokens.typography.weights.semibold,
                  color: colors.onSurface,
                }}
              >
                {monthSummary.spent}
              </Text>
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
              <Text
                style={{
                  fontSize: tokens.typography.sizes.xs,
                  color: colors.inverseSurface,
                }}
              >
                To claim
              </Text>
              <Text
                style={{
                  marginTop: tokens.spacing.xs,
                  fontSize: tokens.typography.sizes.lg,
                  fontWeight: tokens.typography.weights.semibold,
                  color: colors.onSurface,
                }}
              >
                {monthSummary.toClaim}
              </Text>
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
              <Text
                style={{
                  fontSize: tokens.typography.sizes.xs,
                  color: colors.onSurfaceVariant,
                }}
              >
                To pay
              </Text>
              <Text
                style={{
                  marginTop: tokens.spacing.xs,
                  fontSize: tokens.typography.sizes.lg,
                  fontWeight: tokens.typography.weights.semibold,
                  color: colors.onSurface,
                }}
              >
                {monthSummary.toPay}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={{ gap: tokens.spacing.xs }}>
          <Text
            style={{
              fontSize: tokens.typography.sizes.md,
              fontWeight: tokens.typography.weights.semibold,
              color: colors.onBackground,
            }}
          >
            Overview
          </Text>

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
                  <Text
                    style={{
                      fontSize: tokens.typography.sizes.xs,
                      fontWeight: tokens.typography.weights.semibold,
                      color: colors.onSurface,
                    }}
                  >
                    Profile & setup
                  </Text>
                  <UserRound
                    size={tokens.sizes.icon.sm}
                    color={colors.onSurfaceVariant}
                  />
                </View>
                <Text
                  style={{
                    fontSize: tokens.typography.sizes.xs,
                    color: colors.onSurfaceVariant,
                  }}
                  numberOfLines={2}
                >
                  Complete profile to unlock smarter suggestions.
                </Text>
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
                  <Text
                    style={{
                      fontSize: tokens.typography.sizes.xs,
                      fontWeight: tokens.typography.weights.semibold,
                      color: colors.onSurface,
                    }}
                  >
                    Budget
                  </Text>
                  <Wallet
                    size={tokens.sizes.icon.sm}
                    color={colors.onSurfaceVariant}
                  />
                </View>
                <Text
                  style={{
                    fontSize: tokens.typography.sizes.sm,
                    fontWeight: tokens.typography.weights.semibold,
                    color: colors.onSurface,
                  }}
                  numberOfLines={1}
                >
                  {overview.budget.primary}
                </Text>
                <Text
                  style={{
                    marginTop: tokens.spacing["xs"],
                    fontSize: tokens.typography.sizes.xs,
                    color: colors.onSurfaceVariant,
                  }}
                  numberOfLines={1}
                >
                  {overview.budget.secondary}
                </Text>
                {overview.budget.topCategory && (
                  <Text
                    style={{
                      marginTop: tokens.spacing["xs"],
                      fontSize: tokens.typography.sizes.xs,
                      color: colors.onSurfaceVariant,
                    }}
                    numberOfLines={1}
                  >
                    Top spend: {overview.budget.topCategory}
                  </Text>
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
                  <Text
                    style={{
                      fontSize: tokens.typography.sizes.xs,
                      fontWeight: tokens.typography.weights.semibold,
                      color: colors.onSurface,
                    }}
                  >
                    Wishlist
                  </Text>
                  <PiggyBank
                    size={tokens.sizes.icon.sm}
                    color={colors.onSurfaceVariant}
                  />
                </View>
                <Text
                  style={{
                    fontSize: tokens.typography.sizes.sm,
                    fontWeight: tokens.typography.weights.semibold,
                    color: colors.onSurface,
                  }}
                  numberOfLines={1}
                >
                  {overview.wishlist.itemsCount} items ·{" "}
                  {overview.wishlist.totalSaved}
                </Text>
                <Text
                  style={{
                    marginTop: tokens.spacing["xs"],
                    fontSize: tokens.typography.sizes.xs,
                    color: colors.onSurfaceVariant,
                  }}
                  numberOfLines={1}
                >
                  {overview.wishlist.fundedPercent}% of wishes funded
                </Text>
                <Text
                  style={{
                    marginTop: tokens.spacing["xs"],
                    fontSize: tokens.typography.sizes.xs,
                    color: colors.onSurfaceVariant,
                  }}
                  numberOfLines={1}
                >
                  {overview.wishlist.secondary}
                </Text>
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
                  <Text
                    style={{
                      fontSize: tokens.typography.sizes.xs,
                      fontWeight: tokens.typography.weights.semibold,
                      color: colors.onSurface,
                    }}
                  >
                    Claims
                  </Text>
                  <ReceiptText
                    size={tokens.sizes.icon.sm}
                    color={colors.onSurfaceVariant}
                  />
                </View>
                <Text
                  style={{
                    fontSize: tokens.typography.sizes.sm,
                    fontWeight: tokens.typography.weights.semibold,
                    color: colors.onSurface,
                  }}
                  numberOfLines={1}
                >
                  {overview.claim.totalToClaim}
                </Text>
                <Text
                  style={{
                    marginTop: tokens.spacing["xs"],
                    fontSize: tokens.typography.sizes.xs,
                    color: colors.onSurfaceVariant,
                  }}
                  numberOfLines={1}
                >
                  {overview.claim.secondary}
                </Text>
                {overview.claim.lastLabel && (
                  <Text
                    style={{
                      marginTop: tokens.spacing["xs"],
                      fontSize: tokens.typography.sizes.xs,
                      color: colors.onSurfaceVariant,
                    }}
                    numberOfLines={1}
                  >
                    Last: {overview.claim.lastLabel}
                  </Text>
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
                  <Text
                    style={{
                      fontSize: tokens.typography.sizes.xs,
                      fontWeight: tokens.typography.weights.semibold,
                      color: colors.onSurface,
                    }}
                  >
                    Settlements
                  </Text>
                  <HandCoins
                    size={tokens.sizes.icon.sm}
                    color={colors.onSurfaceVariant}
                  />
                </View>
                <Text
                  style={{
                    fontSize: tokens.typography.sizes.sm,
                    fontWeight: tokens.typography.weights.semibold,
                    color: colors.onSurface,
                  }}
                  numberOfLines={1}
                >
                  {overview.settlement.totalToPay}
                </Text>
                <Text
                  style={{
                    marginTop: tokens.spacing["xs"],
                    fontSize: tokens.typography.sizes.xs,
                    color: colors.onSurfaceVariant,
                  }}
                  numberOfLines={1}
                >
                  {overview.settlement.breakdownLabel}
                </Text>
                <Text
                  style={{
                    marginTop: tokens.spacing["xs"],
                    fontSize: tokens.typography.sizes.xs,
                    color: colors.onSurfaceVariant,
                  }}
                  numberOfLines={1}
                >
                  {overview.settlement.secondary}
                </Text>
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
                  <Text
                    style={{
                      fontSize: tokens.typography.sizes.xs,
                      fontWeight: tokens.typography.weights.semibold,
                      color: colors.onSurface,
                    }}
                  >
                    Calculator tools
                  </Text>
                  <CalculatorIcon
                    size={tokens.sizes.icon.sm}
                    color={colors.onSurfaceVariant}
                  />
                </View>
                <Text
                  style={{
                    fontSize: tokens.typography.sizes.sm,
                    fontWeight: tokens.typography.weights.semibold,
                    color: colors.onSurface,
                  }}
                  numberOfLines={1}
                >
                  {overview.calculator.primary}
                </Text>
                <Text
                  style={{
                    marginTop: tokens.spacing["xs"],
                    fontSize: tokens.typography.sizes.xs,
                    color: colors.onSurfaceVariant,
                  }}
                  numberOfLines={2}
                >
                  {overview.calculator.secondary}
                </Text>
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
            <Text
              style={{
                fontSize: tokens.typography.sizes.md,
                fontWeight: tokens.typography.weights.semibold,
                color: colors.onSurface,
              }}
            >
              Recent activity
            </Text>

            <Pressable onPress={() => router.push("/(tabs)/a/activity")}>
              <Text
                style={{
                  fontSize: tokens.typography.sizes.xs,
                  color: colors.primary,
                }}
              >
                View all
              </Text>
            </Pressable>
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
                    <Text
                      style={{
                        fontSize: tokens.typography.sizes.xs,
                        color: colors.onPrimaryContainer,
                      }}
                    >
                      –
                    </Text>
                  </View>
                  <View style={{ flex: 1, gap: tokens.spacing.xs }}>
                    <Text
                      style={{
                        fontSize: tokens.typography.sizes.sm,
                        color: colors.onSurface,
                      }}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: tokens.typography.sizes.xs,
                        color: colors.onSurfaceVariant,
                      }}
                    >
                      {item.date}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: tokens.typography.sizes.sm,
                      fontWeight: tokens.typography.weights.semibold,
                      color: colors.onSurface,
                    }}
                  >
                    {item.amount}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
