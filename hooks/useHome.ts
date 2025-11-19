import { useMemo, useState, useCallback } from "react";

export type HomeMonthSummary = {
  monthLabel: string;
  spent: string;
  toClaim: string;
  toPay: string;
};

export type HomeBudgetOverview = {
  title: string;
  primary: string;
  secondary: string;
  statusLabel: string;
  percentUsed: number;
  topCategory: string | null;
};

export type HomeClaimOverview = {
  title: string;
  totalToClaim: string;
  secondary: string;
  count: number;
  overdueCount: number;
  lastLabel: string | null;
};

export type HomeSettlementOverview = {
  title: string;
  totalToPay: string;
  secondary: string;
  nextDueLabel: string | null;
  breakdownLabel: string;
};

export type HomeWishlistOverview = {
  title: string;
  itemsCount: number;
  totalSaved: string;
  secondary: string;
  nextTargetLabel: string | null;
  fundedPercent: number;
};

export type HomeCalculatorOverview = {
  title: string;
  primary: string;
  secondary: string;
};

export type HomeTimelineItem = {
  id: string;
  type: "lent" | "expense" | "receive";
  label: string;
  amount: string;
  date: string;
};

export type HomeOverview = {
  budget: HomeBudgetOverview;
  claim: HomeClaimOverview;
  settlement: HomeSettlementOverview;
  wishlist: HomeWishlistOverview;
  calculator: HomeCalculatorOverview;
};

const formatMoney = (num: number) => {
  return `RM ${num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

const generateMonthData = (month: string) => {
  const hasDataForMonth = month === "November";

  const spent = hasDataForMonth ? 1000 + Math.random() * 1500 : 0;
  const toClaim = hasDataForMonth ? Math.random() * 500 : 0;
  const toPay = hasDataForMonth ? Math.random() * 1000 : 0;

  const monthSummary: HomeMonthSummary = {
    monthLabel: month,
    spent: formatMoney(spent),
    toClaim: formatMoney(toClaim),
    toPay: formatMoney(toPay),
  };

  const totalBudget = hasDataForMonth ? 2500 + Math.random() * 1000 : 0;
  const percentUsed = totalBudget > 0 ? (spent / totalBudget) * 100 : 0;
  const budgetStatus =
    percentUsed > 90 ? "High" : percentUsed > 60 ? "On track" : "Low";

  const overview: HomeOverview = {
    budget: {
      title: "Budget",
      primary: `${formatMoney(spent)} / ${formatMoney(totalBudget)}`,
      secondary:
        totalBudget > 0
          ? `${percentUsed.toFixed(0)}% used · ${budgetStatus}`
          : "No budget data",
      statusLabel: budgetStatus,
      percentUsed: percentUsed,
      topCategory: hasDataForMonth ? "Food" : null,
    },
    claim: {
      title: "To claim",
      totalToClaim: formatMoney(toClaim),
      secondary: hasDataForMonth ? "3 claims · 1 overdue" : "No claims",
      count: hasDataForMonth ? 3 : 0,
      overdueCount: hasDataForMonth ? 1 : 0,
      lastLabel: hasDataForMonth ? "Lunch with team" : null,
    },
    settlement: {
      title: "To pay",
      totalToPay: formatMoney(toPay),
      secondary: hasDataForMonth ? "Next due: 25 Nov" : "No commitments",
      nextDueLabel: hasDataForMonth ? "25 Nov" : null,
      breakdownLabel: hasDataForMonth ? "2 loans · 1 sub" : "0 items",
    },
    wishlist: {
      title: "Wishlist",
      itemsCount: hasDataForMonth ? 3 : 0,
      totalSaved: hasDataForMonth ? formatMoney(3200) : formatMoney(0),
      secondary: hasDataForMonth ? "Next: Europe trip" : "No wishlist",
      nextTargetLabel: hasDataForMonth ? "Europe trip" : null,
      fundedPercent: hasDataForMonth ? 34 : 0,
    },
    calculator: {
      title: "Calculator tools",
      primary: "Try a scenario",
      secondary: "Safe commit, loans, savings, compounding",
    },
  };

  const timeline: HomeTimelineItem[] = hasDataForMonth
    ? [
        {
          id: "t1",
          type: "expense",
          label: "Groceries – Jaya Grocer",
          amount: formatMoney(120),
          date: "12 Nov",
        },
        {
          id: "t2",
          type: "lent",
          label: "Brunch – Fronted for friends",
          amount: formatMoney(85),
          date: "10 Nov",
        },
        {
          id: "t3",
          type: "receive",
          label: "Reimbursed – Team dinner",
          amount: formatMoney(150),
          date: "08 Nov",
        },
      ]
    : [];

  return { monthSummary, overview, timeline };
};

export function useHome() {
  const [selectedMonth, setSelectedMonth] = useState<string>("November");

  const { monthSummary, overview, timeline } = useMemo(() => {
    return generateMonthData(selectedMonth);
  }, [selectedMonth]);

  const hasData = useMemo(() => timeline.length > 0, [timeline]);

  const setMonth = useCallback((month: string) => {
    setSelectedMonth(month);
  }, []);

  return {
    selectedMonth,
    monthSummary,
    overview,
    timeline,
    hasData,
    setMonth,
  };
}
