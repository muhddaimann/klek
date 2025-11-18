import { useMemo, useState } from "react";

export type ActivityKind =
  | "expense"
  | "lent"
  | "receive"
  | "settlement"
  | "wishlist";

export type ActivitySource =
  | "budget"
  | "claim"
  | "settlement"
  | "wishlist"
  | "other";

export type ActivityMonthKey = "october" | "november";

export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  source: ActivitySource;
  label: string;
  amount: string;
  date: string;
};

export type ActivityFilterKey =
  | "all"
  | "spend"
  | "frontsOut"
  | "frontsIn"
  | "settlements"
  | "wishlist";

export type ActivityFilter = {
  key: ActivityFilterKey;
  label: string;
};

export type ActivitySummary = {
  totalCount: number;
  totalOut: string;
  totalIn: string;
};

const ACTIVITY_FILTERS: ActivityFilter[] = [
  { key: "all", label: "All" },
  { key: "spend", label: "Spending" },
  { key: "frontsOut", label: "Fronted" },
  { key: "frontsIn", label: "Received" },
  { key: "settlements", label: "Settlements" },
  { key: "wishlist", label: "Wishlist" },
];

const ACTIVITY_BY_MONTH: Record<ActivityMonthKey, ActivityItem[]> = {
  november: [
    {
      id: "t1",
      kind: "expense",
      source: "budget",
      label: "Groceries – Jaya Grocer",
      amount: "RM 120",
      date: "12 Nov",
    },
    {
      id: "t2",
      kind: "lent",
      source: "claim",
      label: "Brunch – fronted for friends",
      amount: "RM 85",
      date: "10 Nov",
    },
    {
      id: "t3",
      kind: "receive",
      source: "claim",
      label: "Reimbursed – team dinner",
      amount: "RM 150",
      date: "08 Nov",
    },
    {
      id: "t4",
      kind: "settlement",
      source: "settlement",
      label: "Credit card payment",
      amount: "RM 400",
      date: "05 Nov",
    },
    {
      id: "t5",
      kind: "wishlist",
      source: "wishlist",
      label: "Saved towards Europe trip",
      amount: "RM 300",
      date: "02 Nov",
    },
  ],
  october: [],
};

function parseAmount(value: string): number {
  const digits = value.replace(/[^\d.]/g, "");
  const n = Number(digits);
  if (Number.isNaN(n)) return 0;
  return n;
}

function formatAmount(prefix: string, value: number): string {
  if (value <= 0) return `${prefix} 0`;
  return `${prefix} ${value.toFixed(0)}`;
}

export function useActivity(monthKey: ActivityMonthKey = "november") {
  const [activeFilter, setActiveFilter] = useState<ActivityFilterKey>("all");

  const allItems = useMemo(() => ACTIVITY_BY_MONTH[monthKey] ?? [], [monthKey]);

  const items = useMemo(() => {
    if (activeFilter === "all") return allItems;

    if (activeFilter === "spend") {
      return allItems.filter((item) => item.kind === "expense");
    }

    if (activeFilter === "frontsOut") {
      return allItems.filter((item) => item.kind === "lent");
    }

    if (activeFilter === "frontsIn") {
      return allItems.filter((item) => item.kind === "receive");
    }

    if (activeFilter === "settlements") {
      return allItems.filter((item) => item.kind === "settlement");
    }

    if (activeFilter === "wishlist") {
      return allItems.filter((item) => item.kind === "wishlist");
    }

    return allItems;
  }, [allItems, activeFilter]);

  const summary = useMemo<ActivitySummary>(() => {
    let out = 0;
    let incoming = 0;

    allItems.forEach((item) => {
      const n = parseAmount(item.amount);
      if (item.kind === "receive") {
        incoming += n;
      } else {
        out += n;
      }
    });

    return {
      totalCount: allItems.length,
      totalOut: formatAmount("RM", out),
      totalIn: formatAmount("RM", incoming),
    };
  }, [allItems]);

  const hasData = allItems.length > 0;

  return {
    monthKey,
    items,
    filters: ACTIVITY_FILTERS,
    activeFilter,
    setActiveFilter,
    summary,
    hasData,
  };
}
