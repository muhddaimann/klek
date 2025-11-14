import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  View,
  ScrollView,
  TextInput as RNInput,
  StyleSheet,
} from "react-native";
import { useTheme, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { Header } from "../../components/shared/header";

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

  const createdAtRef = useRef(new Date());
  const createdAt = createdAtRef.current;

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const [dueKey, setDueKey] = useState<DueKey | null>(null);

  const nameRef = useRef<RNInput | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      nameRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const numericAmount = Number(amount.replace(/,/g, ""));
  const isAmountValid = !Number.isNaN(numericAmount) && numericAmount > 0;

  const dueAt = useMemo(
    () => (dueKey ? getDueDateFromKey(createdAt, dueKey) : null),
    [createdAt, dueKey]
  );

  const hasDue = !!dueKey && dueKey !== "none" && !!dueAt;
  const dueLabel = hasDue
    ? `Due ${DUE_OPTIONS.find((o) => o.key === dueKey)?.label.toLowerCase()}`
    : "Created today";
  const dueDateText = hasDue
    ? formatDateWithDay(new Date(dueAt!))
    : formatDateWithDay(createdAt);

  const isValid =
    name.trim().length > 0 && isAmountValid && !!category && !!dueKey;

  const handleSave = () => {
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
          title="Add manual claim"
          subtitle="Track a front you paid for friends"
        />

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
            onChangeText={setAmount}
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

        <View style={{ gap: tokens.spacing.sm }}>
          <Text
            style={{
              fontSize: tokens.typography.sizes.sm,
              fontWeight: tokens.typography.weights.semibold,
              color: colors.onSurface,
            }}
          >
            Dates
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
            rounded="sm"
          >
            Save claim
          </Button>
        </View>
      </View>
    </View>
  );
}
