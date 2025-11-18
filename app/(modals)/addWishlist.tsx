import React, { useState, useRef, useMemo } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { Header } from "../../components/shared/header";

const CATEGORY_OPTIONS = [
  { key: "travel", label: "Travel" },
  { key: "gadget", label: "Gadget" },
  { key: "hobby", label: "Hobby" },
  { key: "home", label: "Home" },
  { key: "other", label: "Other" },
] as const;

const PRIORITY_OPTIONS = [
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
] as const;

const TENURE_OPTIONS = [
  { key: "flexible", label: "Anytime" },
  { key: "threeMonths", label: "Within 3 months" },
  { key: "sixMonths", label: "Within 6 months" },
  { key: "oneYear", label: "Within 12 months" },
] as const;

type CategoryKey = (typeof CATEGORY_OPTIONS)[number]["key"];
type PriorityKey = (typeof PRIORITY_OPTIONS)[number]["key"];
type TenureKey = (typeof TENURE_OPTIONS)[number]["key"];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getTargetDateFromKey(base: Date, key: TenureKey): string | null {
  const d = new Date(base);

  if (key === "flexible") return null;
  if (key === "threeMonths") {
    d.setMonth(d.getMonth() + 3);
  } else if (key === "sixMonths") {
    d.setMonth(d.getMonth() + 6);
  } else if (key === "oneYear") {
    d.setFullYear(d.getFullYear() + 1);
  }

  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

function formatDateWithDay(date: Date): string {
  const dayName = DAY_NAMES[date.getDay()];
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  return `${dayName}, ${dd}/${mm}/${yy}`;
}

function formatCents(value: string): string {
  if (!value) return "";
  const cents = Number(value);
  if (Number.isNaN(cents)) return "";
  return (cents / 100).toFixed(2);
}

export default function AddWishlist() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();

  const createdAtRef = useRef(new Date());
  const createdAt = createdAtRef.current;

  const [name, setName] = useState("");
  const [amountCents, setAmountCents] = useState("");
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const [priority, setPriority] = useState<PriorityKey>("medium");
  const [tenureKey, setTenureKey] = useState<TenureKey>("flexible");
  const [monthlyCents, setMonthlyCents] = useState("");

  const numericAmount = amountCents ? Number(amountCents) / 100 : 0;
  const isAmountValid = numericAmount > 0;
  const hasAmountInput = amountCents !== "";

  const numericMonthly = monthlyCents ? Number(monthlyCents) / 100 : 0;
  const hasMonthlyInput = monthlyCents !== "" && numericMonthly > 0;

  const targetAt = useMemo(
    () => getTargetDateFromKey(createdAt, tenureKey),
    [createdAt, tenureKey]
  );

  const hasTarget = tenureKey !== "flexible" && !!targetAt;
  const tenureLabel = hasTarget
    ? TENURE_OPTIONS.find((o) => o.key === tenureKey)?.label
    : "Flexible target";
  const targetDateText = hasTarget
    ? formatDateWithDay(new Date(targetAt!))
    : formatDateWithDay(createdAt);

  const isValid = name.trim().length > 0 && isAmountValid;

  const handleAmountChange = (text: string) => {
    const digits = text.replace(/\D/g, "");
    setAmountCents(digits);
  };

  const handleMonthlyChange = (text: string) => {
    const digits = text.replace(/\D/g, "");
    setMonthlyCents(digits);
  };

  const handleSave = () => {
    if (!isValid) return;

    const payload = {
      name: name.trim(),
      targetAmount: numericAmount,
      category,
      priority,
      tenureKey,
      targetAt,
      monthlyPlan: hasMonthlyInput ? numericMonthly : null,
      createdAt: createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("wishlist-add", payload);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingTop: tokens.spacing.lg,
          paddingBottom: insets.bottom + tokens.spacing["3xl"] * 2,
          gap: tokens.spacing.lg,
        }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <Header
          title="Add to wishlist"
          subtitle="Plan what you want and how to fund it"
        />

        <View style={{ gap: tokens.spacing.sm }}>
          <Text
            style={{
              fontSize: tokens.typography.sizes.sm,
              fontWeight: tokens.typography.weights.semibold,
              color: colors.onSurface,
            }}
          >
            Category
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: tokens.spacing.xs,
            }}
          >
            {CATEGORY_OPTIONS.map((opt) => {
              const active = category === opt.key;
              return (
                <View
                  key={opt.key}
                  style={{
                    borderRadius: tokens.radii.pill,
                    borderWidth: 1,
                    borderColor: active
                      ? colors.primary
                      : colors.outlineVariant,
                    backgroundColor: active
                      ? colors.primaryContainer
                      : colors.surface,
                  }}
                >
                  <Button
                    onPress={() => setCategory(opt.key)}
                    variant="ghost"
                    size="sm"
                    rounded="pill"
                    style={{
                      paddingHorizontal: tokens.spacing.sm,
                      paddingVertical: tokens.spacing["xs"],
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
                      {opt.label}
                    </Text>
                  </Button>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ gap: tokens.spacing.md }}>
          <TextInput
            mode="outlined"
            label="Wishlist item"
            value={name}
            onChangeText={setName}
            autoCapitalize="sentences"
          />
          <TextInput
            mode="outlined"
            label="Target amount"
            value={formatCents(amountCents)}
            onChangeText={handleAmountChange}
            keyboardType="number-pad"
            error={hasAmountInput && !isAmountValid}
          />
          {hasAmountInput && !isAmountValid && (
            <Text
              style={{
                marginTop: -tokens.spacing["xs"],
                color: colors.error,
                fontSize: tokens.typography.sizes.xs,
              }}
            >
              Enter a valid amount above 0
            </Text>
          )}
          <TextInput
            mode="outlined"
            label="Optional monthly top-up"
            value={formatCents(monthlyCents)}
            onChangeText={handleMonthlyChange}
            keyboardType="number-pad"
          />
        </View>

        <View style={{ gap: tokens.spacing.sm }}>
          <Text
            style={{
              fontSize: tokens.typography.sizes.sm,
              fontWeight: tokens.typography.weights.semibold,
              color: colors.onSurface,
            }}
          >
            Priority
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: tokens.spacing.xs,
            }}
          >
            {PRIORITY_OPTIONS.map((opt) => {
              const active = priority === opt.key;
              return (
                <View
                  key={opt.key}
                  style={{
                    borderRadius: tokens.radii.pill,
                    borderWidth: 1,
                    borderColor: active
                      ? colors.primary
                      : colors.outlineVariant,
                    backgroundColor: active
                      ? colors.primaryContainer
                      : colors.surface,
                  }}
                >
                  <Button
                    onPress={() => setPriority(opt.key)}
                    variant="ghost"
                    size="sm"
                    rounded="pill"
                    style={{
                      paddingHorizontal: tokens.spacing.sm,
                      paddingVertical: tokens.spacing["xs"],
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
                      {opt.label}
                    </Text>
                  </Button>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ gap: tokens.spacing.sm }}>
          <Text
            style={{
              fontSize: tokens.typography.sizes.sm,
              fontWeight: tokens.typography.weights.semibold,
              color: colors.onSurface,
            }}
          >
            Tenure estimate
          </Text>
          <View style={{ gap: tokens.spacing["xs"] }}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: tokens.spacing.xs,
              }}
            >
              {TENURE_OPTIONS.map((opt) => {
                const active = tenureKey === opt.key;
                return (
                  <View
                    key={opt.key}
                    style={{
                      borderRadius: tokens.radii.pill,
                      borderWidth: 1,
                      borderColor: active
                        ? colors.primary
                        : colors.outlineVariant,
                      backgroundColor: active
                        ? colors.primaryContainer
                        : colors.surface,
                    }}
                  >
                    <Button
                      onPress={() => setTenureKey(opt.key)}
                      variant="ghost"
                      size="sm"
                      rounded="pill"
                      style={{
                        paddingHorizontal: tokens.spacing.sm,
                        paddingVertical: tokens.spacing["xs"],
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
                        {opt.label}
                      </Text>
                    </Button>
                  </View>
                );
              })}
            </View>

            <View
              style={{
                marginTop: tokens.spacing.sm,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: colors.outlineVariant,
                  }}
                />
                <View
                  style={{
                    paddingHorizontal: tokens.spacing.sm,
                  }}
                >
                  <Text
                    style={{
                      fontSize: tokens.typography.sizes.xs,
                      color: colors.onSurfaceVariant,
                      textAlign: "center",
                    }}
                  >
                    {tenureLabel} · {targetDateText}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: colors.outlineVariant,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        pointerEvents="box-none"
        style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
      >
        <View
          style={{
            paddingHorizontal: tokens.spacing.lg,
            paddingTop: tokens.spacing.sm,
            paddingBottom: insets.bottom + tokens.spacing.lg,
            backgroundColor: colors.background,
            borderTopWidth: 0.5,
            borderTopColor: colors.outlineVariant,
          }}
        >
          <Button
            onPress={handleSave}
            variant="default"
            disabled={!isValid}
            rounded="sm"
            fullWidth
          >
            Save wishlist item
          </Button>
        </View>
      </View>
    </View>
  );
}
