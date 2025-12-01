import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { View, ScrollView } from "react-native";
import { useTheme, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { Header } from "../../components/shared/header";
import { Body, BodySmall } from "../../components/atom/text";
import {
  UtensilsCrossed,
  Car,
  Receipt,
  Clapperboard,
  PiggyBank,
  Shapes,
} from "lucide-react-native";
import type { ComponentType } from "react";
import {
  apiGetBudgets,
  apiCreateBudget,
  apiUpdateBudget,
  type Budget as ApiBudget,
} from "../../contexts/api/budgets";
import { useOverlay } from "../../hooks/useOverlay";

type CategoryKey = string;
type IconComp = ComponentType<{ color?: string; size?: number }>;

const CATEGORY_ICON_MAP: Record<CategoryKey, IconComp> = {
  food: UtensilsCrossed,
  transport: Car,
  bills: Receipt,
  entertainment: Clapperboard,
  savings: PiggyBank,
  other: Shapes,
};

const CATEGORY_OPTIONS = [
  { key: "food", label: "Food" },
  { key: "transport", label: "Transport" },
  { key: "bills", label: "Bills" },
  { key: "entertainment", label: "Entertainment" },
  { key: "savings", label: "Savings" },
  { key: "other", label: "Others" },
] as const;

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

function getMonthKeyFromDate(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  return `${y}-${String(m).padStart(2, "0")}`;
}

function getMonthKeyFromISO(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return getMonthKeyFromDate(d);
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
  const router = useRouter();
  const { toast } = useOverlay();

  const params = useLocalSearchParams<{ mode?: string | string[] }>();
  const rawMode = params.mode;
  const mode = Array.isArray(rawMode) ? rawMode[0] : rawMode;
  const isUpdateModeParam = mode === "update";

  const createdAtRef = useRef(new Date());
  const createdAt = createdAtRef.current;

  const [totalAmount, setTotalAmount] = useState("");
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [customMode, setCustomMode] = useState(false);
  const [hasSeededRandom, setHasSeededRandom] = useState(false);
  const [budgetId, setBudgetId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const totalRef = useRef<any>(null);

  const periodEnd = useMemo(() => getCurrentMonthEnd(createdAt), [createdAt]);
  const periodLabel = "This month";
  const periodDateText = formatDateWithDay(new Date(periodEnd));
  const currentMonthKey = useMemo(
    () => getMonthKeyFromDate(createdAt),
    [createdAt]
  );

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
    setCustomMode(false);
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

  const diff = numericTotal - numericCategoryTotal;
  const hasDiff = isTotalValid && diff !== 0;

  const isValid = isTotalValid && !saving;

  const loadExistingBudget = useCallback(async () => {
    if (!isUpdateModeParam) return;
    setLoading(true);
    try {
      const data: ApiBudget[] = await apiGetBudgets();
      const existing =
        data.find(
          (b) => getMonthKeyFromISO(b.budget_date) === currentMonthKey
        ) ?? null;

      if (existing) {
        setBudgetId(existing.id);
        const total = Number(existing.total_amount ?? 0) || 0;
        setTotalAmount(formatMoney(total));

        if (!hasSeededRandom) {
          const seeded = buildRandomBudget();
          setCategoryBudgets(seeded.categories);
          setHasSeededRandom(true);
        }
      }
    } catch (e: any) {
      toast({
        message: e?.message || "Failed to load budget",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [currentMonthKey, hasSeededRandom, isUpdateModeParam, toast]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      totalRef.current?.focus();
    });

    void loadExistingBudget();

    return () => cancelAnimationFrame(frame);
  }, [loadExistingBudget]);

  const handleSave = async () => {
    if (!isValid) return;

    setSaving(true);
    try {
      const budget_date = periodEnd;
      const label = "Monthly budget";
      const total_amount = numericTotal.toString();

      if (isUpdateModeParam && budgetId != null) {
        await apiUpdateBudget(budgetId, { label, total_amount });
        toast({ message: "Budget updated", variant: "success" });
      } else {
        await apiCreateBudget({ budget_date, label, total_amount });
        toast({ message: "Budget saved", variant: "success" });
      }

      router.back();
    } catch (e: any) {
      toast({
        message: e?.message || "Failed to save budget",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + tokens.spacing["3xl"] * 2,
          gap: tokens.spacing.xxs,
        }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        bounces={false}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
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
            title={
              isUpdateModeParam && budgetId != null
                ? "Update budget"
                : "Set budget"
            }
            subtitle={periodLabel}
            rightSlot={
              <BodySmall
                muted
                style={{
                  fontSize: tokens.typography.sizes.xs,
                }}
              >
                until {periodDateText}
              </BodySmall>
            }
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
              label="Total budget (RM)"
              value={totalAmount}
              onChangeText={handleTotalChange}
              keyboardType="decimal-pad"
              error={totalAmount.length > 0 && !isTotalValid}
              ref={totalRef}
              disabled={loading || saving}
            />

            {totalAmount.length > 0 && !isTotalValid && (
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

            {isTotalValid && (
              <BodySmall
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
              </BodySmall>
            )}
          </View>

          <View style={{ gap: tokens.spacing.sm }}>
            <BodySmall
              weight="semibold"
              color={colors.onSurface}
              style={{
                fontSize: tokens.typography.sizes.sm,
              }}
            >
              Suggested categories
            </BodySmall>
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

                const BaseIcon = CATEGORY_ICON_MAP[opt.key as CategoryKey];

                const IconLeft: IconComp = ({ size }) => (
                  <BaseIcon
                    size={size ?? tokens.sizes.icon.sm}
                    color={colors.primary}
                  />
                );

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
                      variant="outline"
                      size="md"
                      rounded="pill"
                      IconLeft={IconLeft}
                      style={{
                        paddingHorizontal: tokens.spacing.sm,
                        paddingVertical: tokens.spacing["xs"],
                      }}
                      disabled={loading || saving}
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
                    disabled={loading || saving}
                  />
                </View>
                <Button
                  onPress={handleAddCustomCategory}
                  variant="outline"
                  rounded="pill"
                  disabled={!newCategoryName.trim() || loading || saving}
                >
                  <Body weight="semibold">Add</Body>
                </Button>
              </View>
            )}
          </View>

          <View style={{ gap: tokens.spacing.sm }}>
            <BodySmall
              weight="semibold"
              color={colors.onSurface}
              style={{
                fontSize: tokens.typography.sizes.sm,
              }}
            >
              Category limits
            </BodySmall>

            {categoryBudgets.length === 0 ? (
              <BodySmall
                muted
                style={{
                  fontSize: tokens.typography.sizes.xs,
                }}
              >
                Pick or add categories to allocate your budget.
              </BodySmall>
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
                    <Body
                      style={{
                        fontSize: tokens.typography.sizes.sm,
                        color: colors.onSurface,
                      }}
                    >
                      {c.label}
                    </Body>
                  </View>
                  <View style={{ width: 140 }}>
                    <TextInput
                      mode="outlined"
                      label="RM"
                      value={c.amount}
                      onChangeText={(v) => handleCategoryAmountChange(c.key, v)}
                      keyboardType="decimal-pad"
                      disabled={loading || saving}
                    />
                  </View>
                </View>
              ))
            )}
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
            disabled={!isValid || loading}
            fullWidth
            rounded="pill"
          >
            <Body weight="semibold" color={colors.onPrimary}>
              {isUpdateModeParam && budgetId != null
                ? "Update budget"
                : "Save budget"}
            </Body>
          </Button>
        </View>
      </View>
    </View>
  );
}
