import { useMemo, useState } from "react";

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

const MOCK_BUDGET_SUMMARY: BudgetSummary = {
  monthLabel: "November budget",
  totalBudget: "RM 2,500",
  totalSpent: "RM 1,480",
  remaining: "RM 1,020",
  percentUsed: 59,
  isOverBudget: false,
};

const MOCK_BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    id: "b1",
    key: "food",
    label: "Food",
    budget: "RM 800",
    spent: "RM 520",
    percentUsed: 65,
    status: "high",
  },
  {
    id: "b2",
    key: "transport",
    label: "Transport",
    budget: "RM 400",
    spent: "RM 210",
    percentUsed: 52,
    status: "onTrack",
  },
  {
    id: "b3",
    key: "bills",
    label: "Bills",
    budget: "RM 700",
    spent: "RM 580",
    percentUsed: 83,
    status: "over",
  },
  {
    id: "b4",
    key: "leisure",
    label: "Leisure",
    budget: "RM 300",
    spent: "RM 120",
    percentUsed: 40,
    status: "onTrack",
  },
  {
    id: "b5",
    key: "other",
    label: "Other",
    budget: "RM 300",
    spent: "RM 50",
    percentUsed: 17,
    status: "onTrack",
  },
];

const BUDGET_FILTERS: BudgetFilter[] = [
  { key: "all", label: "All" },
  { key: "onTrack", label: "On track" },
  { key: "high", label: "High" },
  { key: "over", label: "Over" },
];

export function useBudget() {
  const [useMock, setUseMock] = useState(true);

  const summary = useMemo<BudgetSummary>(
    () =>
      useMock
        ? MOCK_BUDGET_SUMMARY
        : {
            monthLabel: "This month",
            totalBudget: "RM 0",
            totalSpent: "RM 0",
            remaining: "RM 0",
            percentUsed: 0,
            isOverBudget: false,
          },
    [useMock]
  );

  const categories = useMemo<BudgetCategory[]>(
    () => (useMock ? MOCK_BUDGET_CATEGORIES : []),
    [useMock]
  );

  const filters = BUDGET_FILTERS;

  const isSetup = summary.totalBudget !== "RM 0";

  const toggleMock = () => setUseMock((v) => !v);

  return {
    summary,
    categories,
    filters,
    isSetup,
    useMock,
    toggleMock,
  };
}
