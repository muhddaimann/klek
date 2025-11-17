import { useMemo, useState } from "react";

export type ClaimStatus = "pending" | "overdue" | "partial";

export type ClaimLender = {
  id: string;
  name: string;
  note: string;
  amount: string;
  status: ClaimStatus;
  lastActivity: string;
};

export type ClaimSummary = {
  monthLabel: string;
  totalToClaim: string;
  activeFriends: number;
};

export type ClaimFilterKey = "all" | "pending" | "overdue";

export type ClaimFilter = {
  key: ClaimFilterKey;
  label: string;
};

const MOCK_SUMMARY: ClaimSummary = {
  monthLabel: "November fronts",
  totalToClaim: "RM 245",
  activeFriends: 3,
};

const MOCK_LENDERS: ClaimLender[] = [
  {
    id: "1",
    name: "Fariz",
    note: "Dinner at SS15",
    amount: "RM 80",
    status: "pending",
    lastActivity: "3 days ago • Logged",
  },
  {
    id: "2",
    name: "Fatin",
    note: "Movie tickets",
    amount: "RM 65",
    status: "partial",
    lastActivity: "Last week • Partially paid",
  },
  {
    id: "3",
    name: "Izzah",
    note: "Grab to office",
    amount: "RM 100",
    status: "overdue",
    lastActivity: "2 weeks ago • Reminder sent",
  },
  {
    id: "4",
    name: "Fariz",
    note: "Dinner at SS15",
    amount: "RM 80",
    status: "pending",
    lastActivity: "3 days ago • Logged",
  },
  {
    id: "5",
    name: "Fatin",
    note: "Movie tickets",
    amount: "RM 65",
    status: "partial",
    lastActivity: "Last week • Partially paid",
  },
  {
    id: "6",
    name: "Fariz",
    note: "Dinner at SS15",
    amount: "RM 80",
    status: "pending",
    lastActivity: "3 days ago • Logged",
  },
  {
    id: "7",
    name: "Fatin",
    note: "Movie tickets",
    amount: "RM 65",
    status: "partial",
    lastActivity: "Last week • Partially paid",
  },
];

const FILTERS: ClaimFilter[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "overdue", label: "Overdue" },
];

export function useClaim() {
  const [useMock, setUseMock] = useState(true);

  const summary = useMemo<ClaimSummary>(
    () =>
      useMock
        ? MOCK_SUMMARY
        : { monthLabel: "This month", totalToClaim: "RM 0", activeFriends: 0 },
    [useMock]
  );

  const lenders = useMemo<ClaimLender[]>(
    () => (useMock ? MOCK_LENDERS : []),
    [useMock]
  );

  const filters = FILTERS;

  const toggleMock = () => setUseMock((v) => !v);

  return {
    summary,
    lenders,
    filters,
    useMock,
    toggleMock,
  };
}
