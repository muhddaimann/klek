import React, { useState, useRef, useMemo } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { Header } from "../../components/shared/header";

const DUE_OPTIONS = [
  { key: "none", label: "None" },
  { key: "thisWeek", label: "This week" },
  { key: "nextTwoWeeks", label: "Next two weeks" },
  { key: "thisMonth", label: "This month" },
] as const;

const CATEGORY_OPTIONS = [
  { key: "bill", label: "Bill" },
  { key: "loan", label: "Loan" },
  { key: "subscription", label: "Subscription" },
  { key: "friend", label: "Friend" },
  { key: "other", label: "Other" },
] as const;

const RECURRENCE_OPTIONS = [
  { key: "once", label: "One-time" },
  { key: "monthly", label: "Monthly" },
  { key: "weekly", label: "Weekly" },
  { key: "yearly", label: "Yearly" },
] as const;

type DueKey = (typeof DUE_OPTIONS)[number]["key"];
type CategoryKey = (typeof CATEGORY_OPTIONS)[number]["key"];
type RecurrenceKey = (typeof RECURRENCE_OPTIONS)[number]["key"];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

export default function AddCommitment() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();

  const createdAtRef = useRef(new Date());
  const createdAt = createdAtRef.current;

  const [reference, setReference] = useState("");
  const [amountCents, setAmountCents] = useState("");
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const [dueKey, setDueKey] = useState<DueKey>("none");
  const [recurrence, setRecurrence] = useState<RecurrenceKey>("once");

  const numericAmount = amountCents ? Number(amountCents) / 100 : 0;
  const isAmountValid = numericAmount > 0;
  const hasAmountInput = amountCents !== "";

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

  const isValid = reference.trim().length > 0 && isAmountValid;

  const handleAmountChange = (text: string) => {
    const digits = text.replace(/\D/g, "");
    setAmountCents(digits);
  };

  const handleSave = () => {
    if (!isValid) return;

    const payload = {
      reference: reference.trim(),
      amount: numericAmount,
      category,
      dueKey,
      dueAt,
      recurrence,
      createdAt: createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("commitment-add", payload);
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
          title="Add commitment"
          subtitle="Keep track of what you need to pay"
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
            label="Reference (friend, loan, bill, etc.)"
            value={reference}
            onChangeText={setReference}
            autoCapitalize="sentences"
          />
          <TextInput
            mode="outlined"
            label="Amount"
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
                      onPress={() => setDueKey(opt.key)}
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

        <View style={{ gap: tokens.spacing.sm }}>
          <Text
            style={{
              fontSize: tokens.typography.sizes.sm,
              fontWeight: tokens.typography.weights.semibold,
              color: colors.onSurface,
            }}
          >
            Recurrence
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: tokens.spacing.xs,
            }}
          >
            {RECURRENCE_OPTIONS.map((opt) => {
              const active = recurrence === opt.key;
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
                    onPress={() => setRecurrence(opt.key)}
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
            Save commitment
          </Button>
        </View>
      </View>
    </View>
  );
}
