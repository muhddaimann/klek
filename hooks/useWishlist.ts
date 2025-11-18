import { useMemo, useState } from "react";

export type WishlistStatus = "notStarted" | "inProgress" | "almost" | "done";

export type WishlistItem = {
  id: string;
  key: string;
  label: string;
  category: string;
  targetAmount: string;
  savedAmount: string;
  percentFunded: number;
  monthlyPlan: string;
  targetDateLabel: string;
  status: WishlistStatus;
  priority: "low" | "medium" | "high";
};

export type WishlistSummary = {
  title: string;
  totalItems: number;
  totalTargetAmount: string;
  totalSavedAmount: string;
  percentFundedOverall: number;
  itemsDone: number;
};

export type WishlistFilterKey = "all" | "inProgress" | "almost" | "done";

export type WishlistFilter = {
  key: WishlistFilterKey;
  label: string;
};

const MOCK_WISHLIST_SUMMARY: WishlistSummary = {
  title: "Wishlist overview",
  totalItems: 4,
  totalTargetAmount: "RM 9,500",
  totalSavedAmount: "RM 3,200",
  percentFundedOverall: 34,
  itemsDone: 1,
};

const MOCK_WISHLIST_ITEMS: WishlistItem[] = [
  {
    id: "w1",
    key: "trip-europe",
    label: "Europe trip",
    category: "Travel",
    targetAmount: "RM 6,000",
    savedAmount: "RM 1,800",
    percentFunded: 30,
    monthlyPlan: "RM 400 / month",
    targetDateLabel: "By Dec 2026",
    status: "inProgress",
    priority: "high",
  },
  {
    id: "w2",
    key: "new-guitar",
    label: "Electric guitar",
    category: "Hobby",
    targetAmount: "RM 2,000",
    savedAmount: "RM 900",
    percentFunded: 45,
    monthlyPlan: "RM 200 / month",
    targetDateLabel: "By Jun 2026",
    status: "almost",
    priority: "medium",
  },
  {
    id: "w3",
    key: "ipad",
    label: "iPad",
    category: "Gadget",
    targetAmount: "RM 1,500",
    savedAmount: "RM 500",
    percentFunded: 33,
    monthlyPlan: "RM 150 / month",
    targetDateLabel: "By Mar 2026",
    status: "inProgress",
    priority: "low",
  },
  {
    id: "w4",
    key: "short-trip",
    label: "Short local trip",
    category: "Travel",
    targetAmount: "RM 1,000",
    savedAmount: "RM 1,000",
    percentFunded: 100,
    monthlyPlan: "Done",
    targetDateLabel: "Reached",
    status: "done",
    priority: "medium",
  },
];

const WISHLIST_FILTERS: WishlistFilter[] = [
  { key: "all", label: "All" },
  { key: "inProgress", label: "In progress" },
  { key: "almost", label: "Almost there" },
  { key: "done", label: "Done" },
];

export function useWishlist() {
  const [useMock, setUseMock] = useState(true);

  const summary = useMemo<WishlistSummary>(
    () =>
      useMock
        ? MOCK_WISHLIST_SUMMARY
        : {
            title: "Wishlist overview",
            totalItems: 0,
            totalTargetAmount: "RM 0",
            totalSavedAmount: "RM 0",
            percentFundedOverall: 0,
            itemsDone: 0,
          },
    [useMock]
  );

  const items = useMemo<WishlistItem[]>(
    () => (useMock ? MOCK_WISHLIST_ITEMS : []),
    [useMock]
  );

  const filters = WISHLIST_FILTERS;

  const isSetup = summary.totalItems > 0;

  const toggleMock = () => setUseMock((v) => !v);

  return {
    summary,
    items,
    filters,
    isSetup,
    useMock,
    toggleMock,
  };
}
