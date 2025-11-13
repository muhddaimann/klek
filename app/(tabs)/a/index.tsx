import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTab } from "../../../hooks/useTab";
import { Sparkles, HandCoins, Wallet, UserRound } from "lucide-react-native";
import { EmptyState } from "../../../components/molecule/emptyState";

const INITIAL_SUMMARY = {
  month: "November",
  spent: "RM 0",
  toClaim: "RM -",
  toPay: "RM -",
};

const INITIAL_TIMELINE: {
  id: string;
  type: "lent" | "expense" | "receive";
  label: string;
  amount: string;
  date: string;
}[] = [];

export default function Home() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { onScroll } = useTab();

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
        bounces={false}
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
                fontSize: tokens.typography.sizes["xs"],
                color: colors.onSurfaceVariant,
              }}
            >
              Good evening
            </Text>
            <Text
              style={{
                fontSize: tokens.typography.sizes["xl"],
                fontWeight: tokens.typography.weights.semibold,
                color: colors.onSurface,
              }}
            >
              Your money at a glance
            </Text>
          </View>
          <Pressable
            style={{
              borderRadius: tokens.radii.lg,
              paddingHorizontal: tokens.spacing.sm,
              paddingVertical: tokens.spacing["xs"],
              backgroundColor: colors.surface,
              flexDirection: "row",
              alignItems: "center",
              gap: tokens.spacing["xs"],
            }}
          >
            <Text
              style={{
                fontSize: tokens.typography.sizes["xs"],
                color: colors.onSurfaceVariant,
              }}
            >
              {INITIAL_SUMMARY.month}
            </Text>
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: tokens.spacing.sm,
          }}
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
                fontSize: tokens.typography.sizes["xs"],
                color: colors.onPrimaryContainer,
              }}
            >
              This month spent
            </Text>
            <Text
              style={{
                marginTop: tokens.spacing["xs"],
                fontSize: tokens.typography.sizes["2xl"],
                fontWeight: tokens.typography.weights.semibold,
                color: colors.onPrimaryContainer,
              }}
            >
              {INITIAL_SUMMARY.spent}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              gap: tokens.spacing.sm,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: colors.inverseOnSurface,
                padding: tokens.spacing.md,
                ...card,
                borderWidth: 1,
                borderColor: colors.outlineVariant,
              }}
            >
              <Text
                style={{
                  fontSize: tokens.typography.sizes["xs"],
                  color: colors.inverseSurface,
                }}
              >
                To claim
              </Text>
              <Text
                style={{
                  marginTop: tokens.spacing["xs"],
                  fontSize: tokens.typography.sizes["lg"],
                  fontWeight: tokens.typography.weights.semibold,
                  color: colors.onSurface,
                }}
              >
                {INITIAL_SUMMARY.toClaim}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.surfaceVariant,
                padding: tokens.spacing.md,
                ...card,
                borderWidth: 1,
                borderColor: colors.outlineVariant,
              }}
            >
              <Text
                style={{
                  fontSize: tokens.typography.sizes["xs"],
                  color: colors.onSurfaceVariant,
                }}
              >
                To pay
              </Text>
              <Text
                style={{
                  marginTop: tokens.spacing["xs"],
                  fontSize: tokens.typography.sizes["lg"],
                  fontWeight: tokens.typography.weights.semibold,
                  color: colors.onSurface,
                }}
              >
                {INITIAL_SUMMARY.toPay}
              </Text>
            </View>
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
                }}
                onPress={() => {}}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minHeight: tokens.spacing["2xl"],
                  }}
                >
                  <Text
                    style={{
                      fontSize: tokens.typography.sizes.xs,
                      fontWeight: tokens.typography.weights.semibold,
                      color: colors.onSurface,
                    }}
                  >
                    Complete profile
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
                  Verify your email +2
                </Text>
              </Pressable>
              <Pressable
                style={{
                  borderRadius: tokens.radii.lg,
                  padding: tokens.spacing.md,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.outlineVariant,
                  minHeight: tokens.spacing.xl,
                }}
                onPress={() => {}}
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
                    Wishlists
                  </Text>
                  <Sparkles
                    size={tokens.sizes.icon.sm}
                    color={colors.onSurfaceVariant}
                  />
                </View>
                <Text
                  style={{
                    fontSize: tokens.typography.sizes.lg,
                    fontWeight: tokens.typography.weights.semibold,
                    color: colors.onSurface,
                  }}
                >
                  0 items
                </Text>
                <Text
                  style={{
                    marginTop: tokens.spacing.xs,
                    fontSize: tokens.typography.sizes.xs,
                    color: colors.onSurfaceVariant,
                  }}
                  numberOfLines={2}
                >
                  Save trips, eats, and things you’re planning for.
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
                  minHeight: tokens.spacing.xl,
                }}
                onPress={() => {}}
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
                    fontSize: tokens.typography.sizes.lg,
                    fontWeight: tokens.typography.weights.semibold,
                    color: colors.onSurface,
                  }}
                >
                  0 this month
                </Text>
                <Text
                  style={{
                    marginTop: tokens.spacing.xs,
                    fontSize: tokens.typography.sizes.xs,
                    color: colors.onSurfaceVariant,
                  }}
                  numberOfLines={2}
                >
                  Track who’s fully settled and what’s still pending.
                </Text>
              </Pressable>

              <Pressable
                style={{
                  borderRadius: tokens.radii.lg,
                  padding: tokens.spacing.md,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.outlineVariant,
                }}
                onPress={() => {}}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minHeight: tokens.spacing["xl"],
                  }}
                >
                  <Text
                    style={{
                      fontSize: tokens.typography.sizes.xs,
                      fontWeight: tokens.typography.weights.semibold,
                      color: colors.onSurface,
                    }}
                  >
                    Your budget
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
                >
                  Not set
                </Text>
                <Text
                  style={{
                    marginTop: tokens.spacing.xs,
                    fontSize: tokens.typography.sizes.xs,
                    color: colors.onSurfaceVariant,
                  }}
                  numberOfLines={2}
                >
                  Set a monthly cap to keep fronts under control.
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
            <Text
              style={{
                fontSize: tokens.typography.sizes.xs,
                color: colors.primary,
              }}
            >
              View all
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colors.surface,
              ...card,
              paddingVertical: tokens.spacing.sm,
            }}
          >
            {INITIAL_TIMELINE.length === 0 ? (
              <EmptyState
                Icon={Sparkles}
                title="No activity yet"
                subtitle="Start by logging a spend or a front."
              />
            ) : (
              INITIAL_TIMELINE.map((item, idx) => (
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
