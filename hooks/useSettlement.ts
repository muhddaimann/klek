import { useMemo, useState } from "react";

export type SettlementStatus = "upcoming" | "overdue" | "paid";

export type SettlementItem = {
  id: string;
  title: string;
  payTo: string;
  note: string;
  amount: string;
  status: SettlementStatus;
  dueLabel: string;
  lastActivity: string;
};

export type SettlementSummary = {
  monthLabel: string;
  totalToSettle: string;
  upcomingCount: number;
  overdueCount: number;
};

export type SettlementFilterKey = "all" | "upcoming" | "overdue" | "paid";

export type SettlementFilter = {
  key: SettlementFilterKey;
  label: string;
};

const MOCK_SETTLEMENT_SUMMARY: SettlementSummary = {
  monthLabel: "November commitments",
  totalToSettle: "RM 1,520",
  upcomingCount: 3,
  overdueCount: 1,
};

const MOCK_SETTLEMENTS: SettlementItem[] = [
  {
    id: "s1",
    title: "Car loan instalment",
    payTo: "Bank Rakyat",
    note: "Ativa monthly payment",
    amount: "RM 675",
    status: "upcoming",
    dueLabel: "Due in 5 days",
    lastActivity: "Scheduled • Auto debit",
  },
  {
    id: "s2",
    title: "Credit card bill",
    payTo: "Maybank",
    note: "Groceries + fuel",
    amount: "RM 450",
    status: "overdue",
    dueLabel: "Overdue by 3 days",
    lastActivity: "Reminder sent",
  },
  {
    id: "s3",
    title: "PTPTN repayment",
    payTo: "PTPTN",
    note: "Education loan",
    amount: "RM 200",
    status: "upcoming",
    dueLabel: "Due next week",
    lastActivity: "Logged as monthly commitment",
  },
  {
    id: "s4",
    title: "Spotify + Netflix",
    payTo: "Subscriptions",
    note: "Auto card charge",
    amount: "RM 195",
    status: "paid",
    dueLabel: "Paid this month",
    lastActivity: "Paid 2 days ago",
  },
];

const SETTLEMENT_FILTERS: SettlementFilter[] = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "overdue", label: "Overdue" },
  { key: "paid", label: "Paid" },
];

export function useSettlement() {
  const [useMock, setUseMock] = useState(true);

  const summary = useMemo<SettlementSummary>(
    () =>
      useMock
        ? MOCK_SETTLEMENT_SUMMARY
        : {
            monthLabel: "This month",
            totalToSettle: "RM 0",
            upcomingCount: 0,
            overdueCount: 0,
          },
    [useMock]
  );

  const items = useMemo<SettlementItem[]>(
    () => (useMock ? MOCK_SETTLEMENTS : []),
    [useMock]
  );

  const filters = SETTLEMENT_FILTERS;

  const toggleMock = () => setUseMock((v) => !v);

  return {
    summary,
    items,
    filters,
    useMock,
    toggleMock,
  };
}
