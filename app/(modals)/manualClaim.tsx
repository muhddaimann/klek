import React, { useState, useRef, useMemo, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { Header } from "../../components/shared/header";
import {
  UtensilsCrossed,
  Dumbbell,
  Clapperboard,
  Plane,
  Shapes,
  Clock3,
} from "lucide-react-native";
import { OptionTile } from "../../components/atom/optionTile";
import type { ComponentType } from "react";
import { BodySmall } from "../../components/atom/text";

const CATEGORY_OPTIONS = [
  { key: "food", label: "Food" },
  { key: "sport", label: "Sport" },
  { key: "entertainment", label: "Entertainment" },
  { key: "travel", label: "Travel" },
  { key: "other", label: "Other" },
] as const;

const DUE_OPTIONS = [
  { key: "none", label: "None" },
  { key: "thisWeek", label: "This week" },
  { key: "nextTwoWeeks", label: "Next two weeks" },
  { key: "thisMonth", label: "This month" },
] as const;

type CategoryKey = (typeof CATEGORY_OPTIONS)[number]["key"];
type DueKey = (typeof DUE_OPTIONS)[number]["key"];

type IconComp = ComponentType<{ size?: number; color?: string }>;

const CATEGORY_ICON_MAP: Record<CategoryKey, IconComp> = {
  food: UtensilsCrossed,
  sport: Dumbbell,
  entertainment: Clapperboard,
  travel: Plane,
  other: Shapes,
};

function getDueDateFromKey(base: Date, key: DueKey): string | null {
  if (key === "none") return null;

  const d = new Date(base);

  if (key === "thisWeek") {
    const day = d.getDay();
    const daysToEnd = (7 - day) % 7;
    d.setDate(d.getDate() + daysToEnd);
    d.setHours(23, 59, 59, 999);
    return d.toISOString();
  }

  if (key === "nextTwoWeeks") {
    d.setDate(d.getDate() + 14);
    d.setHours(23, 59, 59, 999);
    return d.toISOString();
  }

  if (key === "thisMonth") {
    const year = d.getFullYear();
    const month = d.getMonth();
    const endOfMonth = new Date(year, month + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
    return endOfMonth.toISOString();
  }

  return null;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDateWithDay(date: Date): string {
  const dayName = DAY_NAMES[date.getDay()];
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  return `${dayName}, ${dd}/${mm}/${yy}`;
}

export default function ManualClaim() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const createdAtRef = useRef(new Date());
  const createdAt = createdAtRef.current;

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const [dueKey, setDueKey] = useState<DueKey>("none");

  const nameRef = useRef<any>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      nameRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const resetForm = () => {
    setName("");
    setAmount("");
    setCategory(null);
    setDueKey("none");
  };

  const handleAmountChange = (value: string) => {
    const digits = value.replace(/[^\d]/g, "");
    if (!digits) {
      setAmount("");
      return;
    }
    const num = Number(digits) / 100;
    const formatted = num.toLocaleString("en-MY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setAmount(formatted);
  };

  const numericAmount = Number(amount.replace(/,/g, ""));
  const isAmountValid = !Number.isNaN(numericAmount) && numericAmount > 0;

  const dueAt = useMemo(
    () => getDueDateFromKey(createdAt, dueKey),
    [createdAt, dueKey]
  );

  const hasDue = dueKey !== "none" && !!dueAt;
  const dueLabel = hasDue
    ? `Due ${DUE_OPTIONS.find((o) => o.key === dueKey)?.label.toLowerCase()}`
    : "No due date set";
  const dueDateText = hasDue
    ? formatDateWithDay(new Date(dueAt!))
    : formatDateWithDay(createdAt);

  const isValid = name.trim().length > 0 && isAmountValid && !!category;

  const handleSave = () => {
    if (!isValid) return;

    const payload = {
      name: name.trim(),
      category,
      amount: numericAmount,
      createdAt: createdAt.toISOString(),
      dueKey,
      dueAt,
      updatedAt: new Date().toISOString(),
    };
    console.log("manual-claim", payload);
    resetForm();
    router.back();
  };

  const handleClose = () => {
    resetForm();
    router.back();
  };

  const renderCategoryIcon = (key: CategoryKey) => {
    const Icon = CATEGORY_ICON_MAP[key];
    return <Icon size={tokens.sizes.icon.md} color={colors.primary} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + tokens.spacing["3xl"] * 2,
          gap: tokens.spacing.md,
        }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        bounces={false}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
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
            title="Add manual claim"
            subtitle="Track a front you paid for friends"
            onBackPress={handleClose}
          />
        </View>

        <View
          style={{
            paddingHorizontal: tokens.spacing.lg,
            gap: tokens.spacing.lg,
          }}
        >
          <View style={{ gap: tokens.spacing.md }}>
            <TextInput
              mode="outlined"
              label="Who owes you?"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              ref={nameRef}
            />
            <TextInput
              mode="outlined"
              label="Amount"
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="decimal-pad"
              error={amount.length > 0 && !isAmountValid}
            />

            {amount.length > 0 && !isAmountValid && (
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
          </View>

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
                justifyContent: "center",
                gap: tokens.spacing.xs,
              }}
            >
              {CATEGORY_OPTIONS.map((opt) => {
                const active = category === opt.key;

                return (
                  <OptionTile
                    key={opt.key}
                    label={opt.label}
                    active={active}
                    onPress={() => setCategory(opt.key)}
                    icon={renderCategoryIcon(opt.key)}
                  />
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
              Due
            </Text>
            <View style={{ gap: tokens.spacing["xs"] }}>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: tokens.spacing.xs,
                }}
              >
                {DUE_OPTIONS.map((opt) => {
                  const active = dueKey === opt.key;

                  const IconLeft = ({ size }: { size?: number }) => (
                    <Clock3
                      size={size ?? tokens.sizes.icon.sm}
                      color={active ? colors.primary : colors.onSurfaceVariant}
                    />
                  );

                  return (
                    <Button
                      key={opt.key}
                      onPress={() => setDueKey(opt.key)}
                      variant="outline"
                      size="sm"
                      rounded="pill"
                      IconLeft={IconLeft}
                      style={{
                        paddingHorizontal: tokens.spacing.sm,
                        paddingVertical: tokens.spacing["xs"],
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
                      <BodySmall
                        weight="semibold"
                        style={{
                          fontSize: tokens.typography.sizes.xs,
                          color: active
                            ? colors.primary
                            : colors.onSurfaceVariant,
                        }}
                      >
                        {opt.label}
                      </BodySmall>
                    </Button>
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
                      {dueLabel} · {dueDateText}
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
            fullWidth
            rounded="pill"
          >
            Save claim
          </Button>
        </View>
      </View>
    </View>
  );
}
