# Klek – Frontend

Turn fronts into fast reimbursements.

## Author

- [@muhddaimann](https://www.github.com/muhddaimann)

## Tech Stack

- Expo React Native (TypeScript)
- Expo Router / React Navigation
- React Native Paper (MD3)
- SQLite (local-first)
- Tabler Icons (React Native)

## Product Overview

Klek is a personal finance app that focuses on tracking normal spending and money you “front” for others.

### About

- Mission: Turn fronts into fast reimbursements.
- Problem: You pay first; collecting is slow and awkward.
- Outcome: Cashflow stays on track.

### Core Modules

- Budget — Set monthly caps by category and track spend vs budget.
- Claim — Track upfront payments, splits, who owes you, and status (Pending / Paid / Overdue).
- Settlement — Track recurring commitments (loans, credit cards, subscriptions, rent).
- Wishlist — Plan goals (trip, gadget, hobby) with target amount and saved progress.
- Calculator — Finance tools (safe commit, loan, saving, compounding estimators).
- Activity — Timeline of spends, fronts, claims, and settlements with tags.
- Notification — Smart alerts for budgets, claims, and payments.
- Overview — Home widgets summarising Budget, Claims, Settlements, Wishlist, Calculator.

klek/
├─ app/
│  ├─ (modals)/
│  │  ├─ _layout.tsx
│  │  ├─ addBudget.tsx
│  │  ├─ addCommitment.tsx
│  │  ├─ addRecord.tsx
│  │  ├─ addWishlist.tsx
│  │  ├─ billSplit.tsx
│  │  ├─ compoundEstimator.tsx
│  │  ├─ forgot.tsx
│  │  ├─ loanEstimator.tsx
│  │  ├─ manualClaim.tsx
│  │  ├─ myQR.tsx
│  │  ├─ safeCommit.tsx
│  │  ├─ saveEstimator.tsx
│  │  ├─ signIn.tsx
│  │  └─ signUp.tsx
│  ├─ (tabs)/
│  │  ├─ a/
│  │  │  ├─ _layout.tsx
│  │  │  ├─ activity.tsx
│  │  │  ├─ budget.tsx
│  │  │  ├─ calculator.tsx
│  │  │  ├─ claim.tsx
│  │  │  ├─ index.tsx
│  │  │  ├─ notification.tsx
│  │  │  ├─ settlement.tsx
│  │  │  └─ wishlist.tsx
│  │  ├─ b/
│  │  │  ├─ _layout.tsx
│  │  │  └─ index.tsx
│  │  └─ _layout.tsx
│  ├─ _layout.tsx
│  ├─ goodbye.tsx
│  ├─ index.tsx
│  └─ welcome.tsx
├─ assets/
├─ components/
│  ├─ atom/
│  │  ├─ button.tsx
│  │  ├─ optionTile.tsx
│  │  └─ text.tsx
│  ├─ molecule/
│  │  ├─ alert.tsx
│  │  ├─ confirm.tsx
│  │  ├─ emptyState.tsx
│  │  ├─ fab.tsx
│  │  ├─ modal.tsx
│  │  ├─ options.tsx
│  │  └─ toast.tsx
│  └─ shared/
│     ├─ header.tsx
│     ├─ homeHeader.tsx
│     ├─ logo.tsx
│     └─ tabBar.tsx
├─ constants/
│  ├─ design.ts
│  └─ theme.ts
├─ contexts/
│  ├─ authContext.tsx
│  ├─ designContext.tsx
│  ├─ overlayContext.tsx
│  ├─ tabContext.tsx
│  ├─ themeContext.tsx
│  └─ tokenStorage.tsx
├─ hooks/
│  ├─ useActivity.ts
│  ├─ useBudget.ts
│  ├─ useClaim.ts
│  ├─ useGreeting.ts
│  ├─ useHome.ts
│  ├─ useOverlay.tsx
│  ├─ useSettlement.ts
│  ├─ useTab.tsx
│  └─ useWishlist.ts
├─ lib/
├─ .gitignore
├─ app.json
├─ package-lock.json
├─ package.json
├─ README.md
└─ tsconfig.json


```
