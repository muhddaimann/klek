import { useCallback, useEffect, useMemo, useState } from "react";
import {
  apiGetBudgets,
  type Budget as ApiBudget,
} from "../contexts/api/budgets";

export type BudgetStatus = "onTrack" | "high" | "over";

export type BudgetCategory = {
  id: string;
  key: string;
  label: string;
  budget: string;
  spent: string;
  percentUsed: number;
  status: BudgetStatus;
};

export type BudgetSummary = {
  monthLabel: string;
  totalBudget: string;
  totalSpent: string;
  remaining: string;
  percentUsed: number;
  isOverBudget: boolean;
};

export type BudgetFilterKey = "all" | "onTrack" | "high" | "over";

export type BudgetFilter = {
  key: BudgetFilterKey;
  label: string;
};

const BUDGET_FILTERS: BudgetFilter[] = [
  { key: "all", label: "All" },
  { key: "onTrack", label: "On track" },
  { key: "high", label: "High" },
  { key: "over", label: "Over" },
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getInitialMonthKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  return `${y}-${String(m).padStart(2, "0")}`;
}

function formatMonthLabelFromKey(key: string) {
  const [yearStr, monthStr] = key.split("-");
  const monthIndex = Number(monthStr) - 1;
  const monthName =
    monthIndex >= 0 && monthIndex < 12 ? MONTH_NAMES[monthIndex] : "This month";
  return `${monthName} budget`;
}

function formatCurrency(amount: number) {
  if (!Number.isFinite(amount)) return "RM 0.00";
  return `RM ${amount.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getMonthKeyFromDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  return `${y}-${String(m).padStart(2, "0")}`;
}

export function useBudget() {
  const [summary, setSummary] = useState<BudgetSummary>({
    monthLabel: formatMonthLabelFromKey(getInitialMonthKey()),
    totalBudget: "RM 0.00",
    totalSpent: "RM 0.00",
    remaining: "RM 0.00",
    percentUsed: 0,
    isOverBudget: false,
  });
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [monthKey, setMonthKey] = useState<string>(getInitialMonthKey);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filters = useMemo(() => BUDGET_FILTERS, []);

  const loadBudgets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data: ApiBudget[] = await apiGetBudgets();

      const current =
        data.find((b) => getMonthKeyFromDate(b.budget_date) === monthKey) ??
        null;

      if (!current) {
        setSummary({
          monthLabel: formatMonthLabelFromKey(monthKey),
          totalBudget: "RM 0.00",
          totalSpent: "RM 0.00",
          remaining: "RM 0.00",
          percentUsed: 0,
          isOverBudget: false,
        });
        setCategories([]);
        setLoading(false);
        return;
      }

      const total = Number(current.total_amount ?? 0) || 0;
      const totalBudgetStr = formatCurrency(total);

      setSummary({
        monthLabel: current.label || formatMonthLabelFromKey(monthKey),
        totalBudget: totalBudgetStr,
        totalSpent: formatCurrency(0),
        remaining: totalBudgetStr,
        percentUsed: 0,
        isOverBudget: false,
      });

      setCategories([]);
    } catch (e: any) {
      setError(e?.message || "Failed to load budget");
    } finally {
      setLoading(false);
    }
  }, [monthKey]);

  useEffect(() => {
    void loadBudgets();
  }, [loadBudgets]);

  const isSetup = useMemo(() => {
    const numeric = Number(summary.totalBudget.replace(/[^\d.-]/g, ""));
    return numeric > 0;
  }, [summary.totalBudget]);

  const refresh = useCallback(() => {
    void loadBudgets();
  }, [loadBudgets]);

  return {
    summary,
    categories,
    filters,
    isSetup,
    loading,
    error,
    monthKey,
    setMonthKey,
    refresh,
  };
}
