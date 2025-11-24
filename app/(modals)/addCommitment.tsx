import React, { useState, useRef, useMemo, ComponentType } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ReceiptText,
  Landmark,
  BadgeCheck,
  Users2,
  Shapes,
  Clock3,
} from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { Header } from "../../components/shared/header";
import { OptionTile } from "../../components/atom/optionTile";
import { BodySmall } from "../../components/atom/text";

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

type CategoryIconComp = ComponentType<{ size?: number; color?: string }>;

const CATEGORY_ICON_MAP: Record<CategoryKey, CategoryIconComp> = {
  bill: ReceiptText,
  loan: Landmark,
  subscription: BadgeCheck,
  friend: Users2,
  other: Shapes,
};

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

  const renderCategoryIcon = (key: CategoryKey) => {
    const Icon = CATEGORY_ICON_MAP[key];
    return <Icon size={tokens.sizes.icon.md} color={colors.primary} />;
  };

  const IconLeftClock = ({ size }: { size?: number }) => (
    <Clock3
      size={size ?? tokens.sizes.icon.sm}
      color={colors.onSurfaceVariant}
    />
  );

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
            title="Add commitment"
            subtitle="Keep track of what you need to pay"
            style={{ paddingHorizontal: 0 }}
          />
        </View>

        <View
          style={{
            paddingHorizontal: tokens.spacing.lg,
            gap: tokens.spacing.lg,
          }}
        >
          <View style={{ gap: tokens.spacing.sm }}>
            <BodySmall
              weight="semibold"
              color={colors.onSurface}
              style={{ fontSize: tokens.typography.sizes.sm }}
            >
              Category
            </BodySmall>
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
              <BodySmall
                color={colors.error}
                style={{
                  marginTop: -tokens.spacing["xs"],
                  fontSize: tokens.typography.sizes.xs,
                }}
              >
                Enter a valid amount above 0
              </BodySmall>
            )}
          </View>

          <View style={{ gap: tokens.spacing.sm }}>
            <BodySmall
              weight="semibold"
              color={colors.onSurface}
              style={{ fontSize: tokens.typography.sizes.sm }}
            >
              Due
            </BodySmall>
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
                    <Button
                      key={opt.key}
                      onPress={() => setDueKey(opt.key)}
                      variant="outline"
                      size="sm"
                      rounded="pill"
                      IconLeft={IconLeftClock}
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
                    <BodySmall
                      style={{
                        fontSize: tokens.typography.sizes.xs,
                        color: colors.onSurfaceVariant,
                        textAlign: "center",
                      }}
                    >
                      {dueLabel} · {dueDateText}
                    </BodySmall>
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
            <BodySmall
              weight="semibold"
              color={colors.onSurface}
              style={{ fontSize: tokens.typography.sizes.sm }}
            >
              Recurrence
            </BodySmall>
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
                  <Button
                    key={opt.key}
                    onPress={() => setRecurrence(opt.key)}
                    variant="outline"
                    size="sm"
                    rounded="pill"
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
