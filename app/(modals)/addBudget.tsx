import React, { useState, useRef, useMemo, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useTheme, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { Header } from "../../components/shared/header";

const CATEGORY_OPTIONS = [
  { key: "food", label: "Food" },
  { key: "transport", label: "Transport" },
  { key: "bills", label: "Bills" },
  { key: "fun", label: "Fun money" },
  { key: "savings", label: "Savings" },
  { key: "other", label: "Others" },
] as const;

type CategoryKey = string;

type CategoryBudget = {
  key: CategoryKey;
  label: string;
  amount: string;
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getCurrentMonthEnd(base: Date): string {
  const year = base.getFullYear();
  const month = base.getMonth();
  const endOfMonth = new Date(year, month + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);
  return endOfMonth.toISOString();
}

function formatDateWithDay(date: Date): string {
  const dayName = DAY_NAMES[date.getDay()];
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  return `${dayName}, ${dd}/${mm}/${yy}`;
}

function formatMoney(num: number): string {
  return num.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function buildRandomBudget(): {
  totalAmount: string;
  categories: CategoryBudget[];
} {
  const baseTotal = 1000 + Math.round(Math.random() * 4000);
  const baseCats = CATEGORY_OPTIONS.filter((c) => c.key !== "other");
  const weights = baseCats.map(() => Math.random());
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const rawBudgets = baseCats.map((c, i) =>
    Math.round((weights[i] / totalWeight) * baseTotal)
  );
  const diff = baseTotal - rawBudgets.reduce((s, n) => s + n, 0);
  if (rawBudgets.length > 0) rawBudgets[0] += diff;

  return {
    totalAmount: formatMoney(baseTotal),
    categories: baseCats.map((c, i) => ({
      key: c.key,
      label: c.label,
      amount: formatMoney(rawBudgets[i]),
    })),
  };
}

export default function AddBudget() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();

  const params = useLocalSearchParams<{ mode?: string | string[] }>();
  const rawMode = params.mode;
  const mode = Array.isArray(rawMode) ? rawMode[0] : rawMode;
  const isUpdateMode = mode === "update";

  const createdAtRef = useRef(new Date());
  const createdAt = createdAtRef.current;

  const [totalAmount, setTotalAmount] = useState("");
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [customMode, setCustomMode] = useState(false);
  const [hasSeededRandom, setHasSeededRandom] = useState(false);

  const totalRef = useRef<any>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      totalRef.current?.focus();
    });

    if (isUpdateMode && !hasSeededRandom) {
      const seeded = buildRandomBudget();
      setTotalAmount(seeded.totalAmount);
      setCategoryBudgets(seeded.categories);
      setHasSeededRandom(true);
    }

    return () => cancelAnimationFrame(frame);
  }, [isUpdateMode, hasSeededRandom]);

  const handleTotalChange = (value: string) => {
    const digits = value.replace(/[^\d]/g, "");
    if (!digits) {
      setTotalAmount("");
      return;
    }
    const num = Number(digits) / 100;
    setTotalAmount(formatMoney(num));
  };

  const handleCategoryAmountChange = (key: CategoryKey, value: string) => {
    const digits = value.replace(/[^\d]/g, "");
    const formatted = digits === "" ? "" : formatMoney(Number(digits) / 100);

    setCategoryBudgets((prev) =>
      prev.map((c) => (c.key === key ? { ...c, amount: formatted } : c))
    );
  };

  const toggleCategory = (key: CategoryKey, label: string) => {
    setCategoryBudgets((prev) => {
      const exists = prev.find((c) => c.key === key);
      if (exists) {
        return prev.filter((c) => c.key !== key);
      }
      return [...prev, { key, label, amount: "" }];
    });
  };

  const handleSuggestedPress = (key: CategoryKey, label: string) => {
    if (key === "other") {
      setCustomMode((v) => !v);
      return;
    }
    toggleCategory(key, label);
  };

  const handleAddCustomCategory = () => {
    const label = newCategoryName.trim();
    if (!label) return;
    const key = label.toLowerCase().replace(/\s+/g, "-");
    setCategoryBudgets((prev) => {
      if (prev.some((c) => c.key === key)) return prev;
      return [...prev, { key, label, amount: "" }];
    });
    setNewCategoryName("");
  };

  const numericTotal = Number(totalAmount.replace(/,/g, ""));
  const isTotalValid = !Number.isNaN(numericTotal) && numericTotal > 0;

  const numericCategoryTotal = useMemo(
    () =>
      categoryBudgets.reduce((sum, c) => {
        const n = Number(c.amount.replace(/,/g, ""));
        return sum + (Number.isNaN(n) ? 0 : n);
      }, 0),
    [categoryBudgets]
  );

  const periodEnd = useMemo(() => getCurrentMonthEnd(createdAt), [createdAt]);

  const periodLabel = "This month";
  const periodDateText = formatDateWithDay(new Date(periodEnd));

  const isValid = isTotalValid;

  const diff = numericTotal - numericCategoryTotal;
  const hasDiff = isTotalValid && diff !== 0;

  const handleSave = () => {
    if (!isValid) return;

    const payload = {
      totalBudget: numericTotal,
      periodKey: "thisMonth" as const,
      periodEnd,
      categories: categoryBudgets.map((c) => ({
        key: c.key,
        label: c.label,
        budget: Number(c.amount.replace(/,/g, "")) || 0,
      })),
      createdAt: createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
      mode: isUpdateMode ? "update" : "create",
    };

    console.log("budget-setup", payload);
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
          title={isUpdateMode ? "Update budget" : "Set budget"}
          subtitle="For this month"
        />

        <View style={{ gap: tokens.spacing["xs"] }}>
          <Text
            style={{
              fontSize: tokens.typography.sizes.xs,
              color: colors.onSurfaceVariant,
            }}
          >
            {periodLabel} · until {periodDateText}
          </Text>
        </View>

        <View style={{ gap: tokens.spacing.md }}>
          <TextInput
            mode="outlined"
            label="Total budget (RM)"
            value={totalAmount}
            onChangeText={handleTotalChange}
            keyboardType="decimal-pad"
            error={totalAmount.length > 0 && !isTotalValid}
            ref={totalRef}
          />

          {totalAmount.length > 0 && !isTotalValid && (
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

          {isTotalValid && (
            <Text
              style={{
                marginTop: tokens.spacing["xs"],
                fontSize: tokens.typography.sizes.xs,
                color: hasDiff ? colors.error : colors.onSurfaceVariant,
              }}
            >
              Categories total: RM {numericCategoryTotal.toFixed(2)}{" "}
              {hasDiff
                ? `(${
                    diff > 0
                      ? "RM " + diff.toFixed(2) + " unassigned"
                      : "RM " + Math.abs(diff).toFixed(2) + " over"
                  })`
                : "• Matches total budget"}
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
            Suggested categories
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: tokens.spacing.xs,
            }}
          >
            {CATEGORY_OPTIONS.map((opt) => {
              const isOther = opt.key === "other";
              const active = isOther
                ? customMode
                : categoryBudgets.some((c) => c.key === opt.key);
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
                    onPress={() => handleSuggestedPress(opt.key, opt.label)}
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

          {customMode && (
            <View
              style={{
                flexDirection: "row",
                marginTop: tokens.spacing.sm,
                gap: tokens.spacing.sm,
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <TextInput
                  mode="outlined"
                  label="Custom category"
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                  autoCapitalize="words"
                />
              </View>
              <Button
                onPress={handleAddCustomCategory}
                variant="outline"
                rounded="sm"
                disabled={!newCategoryName.trim()}
              >
                Add
              </Button>
            </View>
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
            Category limits
          </Text>

          {categoryBudgets.length === 0 ? (
            <Text
              style={{
                fontSize: tokens.typography.sizes.xs,
                color: colors.onSurfaceVariant,
              }}
            >
              Pick or add categories to allocate your budget.
            </Text>
          ) : (
            categoryBudgets.map((c) => (
              <View
                key={c.key}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: tokens.spacing.sm,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: tokens.typography.sizes.sm,
                      color: colors.onSurface,
                    }}
                  >
                    {c.label}
                  </Text>
                </View>
                <View style={{ width: 140 }}>
                  <TextInput
                    mode="outlined"
                    label="RM"
                    value={c.amount}
                    onChangeText={(v) => handleCategoryAmountChange(c.key, v)}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            ))
          )}
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
            {isUpdateMode ? "Update budget" : "Save budget"}
          </Button>
        </View>
      </View>
    </View>
  );
}
