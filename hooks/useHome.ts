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

type HomeMonthKey = "october" | "november";

const NOVEMBER_MONTH: HomeMonthSummary = {
  monthLabel: "November",
  spent: "RM 1,480",
  toClaim: "RM 320",
  toPay: "RM 540",
};

const NOVEMBER_OVERVIEW: HomeOverview = {
  budget: {
    title: "Budget",
    primary: "RM 1,480 / RM 2,500",
    secondary: "59% used · On track",
    statusLabel: "On track",
    percentUsed: 59,
    topCategory: "Food",
  },
  claim: {
    title: "To claim",
    totalToClaim: "RM 320",
    secondary: "3 claims · 1 overdue",
    count: 3,
    overdueCount: 1,
    lastLabel: "Lunch with team",
  },
  settlement: {
    title: "To pay",
    totalToPay: "RM 540",
    secondary: "Next due: 25 Nov",
    nextDueLabel: "25 Nov",
    breakdownLabel: "2 loans · 1 sub",
  },
  wishlist: {
    title: "Wishlist",
    itemsCount: 3,
    totalSaved: "RM 3,200",
    secondary: "Next: Europe trip",
    nextTargetLabel: "Europe trip",
    fundedPercent: 34,
  },
  calculator: {
    title: "Calculator tools",
    primary: "Try a scenario",
    secondary: "Safe commit, loans, savings, compounding",
  },
};

const NOVEMBER_TIMELINE: HomeTimelineItem[] = [
  {
    id: "t1",
    type: "expense",
    label: "Groceries – Jaya Grocer",
    amount: "RM 120",
    date: "12 Nov",
  },
  {
    id: "t2",
    type: "lent",
    label: "Brunch – Fronted for friends",
    amount: "RM 85",
    date: "10 Nov",
  },
  {
    id: "t3",
    type: "receive",
    label: "Reimbursed – Team dinner",
    amount: "RM 150",
    date: "08 Nov",
  },
];

const OCTOBER_MONTH: HomeMonthSummary = {
  monthLabel: "October",
  spent: "RM 0",
  toClaim: "RM 0",
  toPay: "RM 0",
};

const OCTOBER_OVERVIEW: HomeOverview = {
  budget: {
    title: "Budget",
    primary: "RM 0 / RM 0",
    secondary: "No data for this month",
    statusLabel: "No data",
    percentUsed: 0,
    topCategory: null,
  },
  claim: {
    title: "To claim",
    totalToClaim: "RM 0",
    secondary: "No claims this month",
    count: 0,
    overdueCount: 0,
    lastLabel: null,
  },
  settlement: {
    title: "To pay",
    totalToPay: "RM 0",
    secondary: "No commitments this month",
    nextDueLabel: null,
    breakdownLabel: "0 items",
  },
  wishlist: {
    title: "Wishlist",
    itemsCount: 0,
    totalSaved: "RM 0",
    secondary: "No wishlist progress this month",
    nextTargetLabel: null,
    fundedPercent: 0,
  },
  calculator: {
    title: "Calculator tools",
    primary: "Try a scenario",
    secondary: "Safe commit, loans, savings, compounding",
  },
};

const OCTOBER_TIMELINE: HomeTimelineItem[] = [];

export function useHome() {
  const [monthKey, setMonthKey] = useState<HomeMonthKey>("november");

  const monthSummary = useMemo(
    () => (monthKey === "november" ? NOVEMBER_MONTH : OCTOBER_MONTH),
    [monthKey]
  );

  const overview = useMemo(
    () => (monthKey === "november" ? NOVEMBER_OVERVIEW : OCTOBER_OVERVIEW),
    [monthKey]
  );

  const timeline = useMemo(
    () => (monthKey === "november" ? NOVEMBER_TIMELINE : OCTOBER_TIMELINE),
    [monthKey]
  );

  const hasData = timeline.length > 0 || monthKey === "november";

  const toggleMonth = useCallback(() => {
    setMonthKey((prev) => (prev === "november" ? "october" : "november"));
  }, []);

  return {
    monthKey,
    monthSummary,
    overview,
    timeline,
    hasData,
    toggleMonth,
  };
}
