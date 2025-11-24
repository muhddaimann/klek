# Klek

Turn fronts into fast reimbursements.

## Author

- [@muhddaimann](https://www.github.com/muhddaimann)

## Tech

- Expo React Native (TypeScript)
- React Navigation / Expo Router
- React Native Paper (MD3)
- SQLite (local-first)
- Tabler Icons RN

## Quick Start

```bash

Klek – personal finance & fronts tracker
├─ About
│  ├─ Mission — Turn fronts into fast reimbursements.
│  ├─ Problem — You pay first; collecting is slow.
│  ├─ Outcome — Cashflow kept intrack.
├─ User Persona
│  ├─ Primary — Young pro, fronts meals/rides.
│  ├─ Secondary — Small teams, housemates.
│  ├─ Pain — Forget who owes; awkward chasing.
├─ Core
│ ├─ Budget — Budget Tracker
│ │ ├─ Set monthly budget caps by category (food, transport, bills, etc.)
│ │ ├─ Track actual spending vs budget in real time
│ │ ├─ See status labels (On track / High / Over budget)
│ │ ├─ Highlight top spending categories and simple trends
│ │ └─ Notify Hit Limit
│ ├─ Claim — Claim Tracker
│ │ ├─ Record upfront payments and split bills with friends + auto record
│ │ ├─ Track what others owe you and claim status (Pending / Paid / Overdue)
│ │ ├- Get a quick view of total amount to claim for the month
│ │ └─ Notify Pending to claim
│ ├─ Settlement — Settlement Tracker
│ │ ├─ Log recurring commitments (loans, credit cards, subscriptions, rent)
│ │ ├─ See total amount to pay and upcoming due dates
│ │ ├─ Mark items as Upcoming, Overdue or Paid
│ │ └─ Notify Pending to pay
│ ├─ Wishlist — Wishlist Tracker
│ │ ├─ Create wishlist items with target amount (trip, gadget, hobby, etc.)
│ │ ├─ Track how much you’ve already saved towards each goal
│ │ └─ Set priority and rough tenure (3 months, 6 months, 1 year)
│ ├─ Calculator — Finance Tools
│ │ ├─ Safe Commit — Suggest a monthly amount you can safely commit from income
│ │ ├─ Loan Estimator — Approximate monthly instalment and total interest
│ │ ├─ Saving Estimator — Compare monthly saving vs target amount or date
│ │ └─ Compounding Estimator — Estimate future value with simple compounding
│ ├─ Activity — Activity Tracking
│ │ ├─ Chronological list of spends, fronts, claims and settlements
│ │ ├─ Tag each activity as expense, lent, or received
│ │ ├─ Show amount, short label, and date for each event
│ │ ├─ Filter by month to review what happened over time
│ ├─ Notification — Smart Alerts
│ │ ├─ Remind upcoming payments and due dates
│ │ ├─ Alert when friends still owe you (Pending / Overdue)
│ │ ├─ Notify when monthly budget caps are hit or close
│ │ ├─ Nudge to log new fronts or update claim status
│ │ └─ Send weekly summary of spends, fronts, and progress
│ ├─ Overview — Overall Modules Widgets
│ │ ├─ Home widgets for Budget, Claims, Settlements, Wishlist, and Calculator
│ │ ├─ Month toggle to switch data views
│ │ ├─ Budget (Total spent & %) ()
│ │ ├─ Claims
│ │ ├─ To Pay
│ │ ├─ Settlements
│ │ ├─ Wishlist
│ │ ├─ Calculator
│ │ ├─ Quick Entry



klek/
├─ app/
│  ├─ (modals)/
│  │  ├─ _layout.tsx
│  │  ├─ forgot.tsx
│  │  ├─ signIn.tsx
│  │  └─ signUp.tsx
│  ├─ (tabs)/
│  │  ├─ a/
│  │  │  ├─ _layout.tsx
│  │  │  ├─ claim.tsx
│  │  │  └─ index.tsx
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
│  │  └─ text.tsx
│  ├─ molecule/
│  │  ├─ alert.tsx
│  │  ├─ confirm.tsx
│  │  ├─ fab.tsx
│  │  ├─ modal.tsx
│  │  └─ toast.tsx
│  └─ shared/
│     ├─ header.tsx
│     └─ logo.tsx
├─ constants/
│  ├─ design.ts
│  └─ theme.ts
├─ contexts/
│  ├─ tokenStorage.tsx
│  ├─ authContext.tsx
│  ├─ designContext.tsx
│  ├─ overlayContext.tsx
│  └─ themeContext.tsx
├─ hooks/
│  ├─ useBlog.tsx
│  ├─ useOverlay.tsx
│  └─ useText.tsx
├─ .gitignore
├─ app.json
├─ package-lock.json
├─ package.json
├─ README.md
└─ tsconfig.json

Module to database
├─ User
│  ├─ profiles
│  │  ├─ id (uuid, PK, = auth.user.id)
│  │  ├─ email
│  │  ├─ display_name
│  │  ├─ created_at
│  │  ├─ updated_at
│  │  └─ settings_json (optional extra prefs)
│
├─ Budget
│  ├─ budgets
│  │  ├─ id
│  │  ├─ user_id
│  │  ├─ month (e.g. 2025-11-01 as “month key”)
│  │  ├─ total_limit
│  │  └─ created_at
│  ├─ budget_categories
│  │  ├─ id
│  │  ├─ budget_id
│  │  ├─ category_key (food, transport, bills…)
│  │  ├─ limit_amount
│  │  └─ (spent_amount is derived from Activity/transactions)
│
├─ Claim
│  ├─ claims
│  │  ├─ id
│  │  ├─ user_id        (person who paid first)
│  │  ├─ title          (Lunch with team, Grab to KLCC)
│  │  ├─ total_amount
│  │  ├─ status         (pending, paid, overdue)
│  │  ├─ due_date
│  │  ├─ created_at
│  │  └─ note
│  ├─ claim_participants
│  │  ├─ id
│  │  ├─ claim_id
│  │  ├─ participant_name (or participant_user_id later)
│  │  ├─ share_amount
│  │  └─ status (pending, paid)
│
├─ Settlement
│  ├─ settlements
│  │  ├─ id
│  │  ├─ user_id
│  │  ├─ name         (Car loan, Credit Card, Netflix)
│  │  ├─ type         (loan, card, sub, rent, other)
│  │  ├─ amount       (per cycle)
│  │  ├─ cycle        (monthly, weekly, yearly)
│  │  ├─ due_day      (e.g. 7 = 7th of month) or due_date
│  │  ├─ status       (active, closed)
│  │  └─ created_at
│  ├─ settlement_payments (optional, if you want history)
│  │  ├─ id
│  │  ├─ settlement_id
│  │  ├─ paid_amount
│  │  ├─ paid_date
│  │  └─ status (paid, overdue)
│
├─ Wishlist
│  ├─ wishlists
│  │  ├─ id
│  │  ├─ user_id
│  │  ├─ title          (Japan trip, New guitar)
│  │  ├─ target_amount
│  │  ├─ saved_amount
│  │  ├─ priority       (low, medium, high)
│  │  ├─ tenure_months  (3, 6, 12)
│  │  └─ created_at
│
├─ Calculator
│  ├─ saved_calculations (optional)
│  │  ├─ id
│  │  ├─ user_id
│  │  ├─ type (safe_commit, loan, saving, compounding)
│  │  ├─ input_json
│  │  ├─ result_json
│  │  └─ created_at
│  └─ (calculators can also be pure logic with no tables)
│
├─ Activity
│  ├─ activities
│  │  ├─ id
│  │  ├─ user_id
│  │  ├─ kind          (expense, lent, received, settlement, wishlist_save)
│  │  ├─ source_module (budget, claim, settlement, wishlist)
│  │  ├─ source_id     (id from that module)
│  │  ├─ amount
│  │  ├─ label         (short text shown in list)
│  │  ├─ occurred_at
│  │  └─ meta_json     (extra info if needed)
│
├─ Notification
│  ├─ notification_settings
│  │  ├─ id
│  │  ├─ user_id
│  │  ├─ email_enabled
│  │  ├─ push_enabled
│  │  ├─ budget_alert_thresholds_json
│  │  └─ quiet_hours_json
│  ├─ notifications
│  │  ├─ id
│  │  ├─ user_id
│  │  ├─ type         (budget_hit, claim_overdue, due_soon…)
│  │  ├─ title
│  │  ├─ body
│  │  ├─ source_module
│  │  ├─ source_id
│  │  ├─ read_at
│  │  └─ created_at
│
├─ Overview
│  ├─ (mostly computed, not raw table)
│  │  ├─ Use SQL views/materialized views like:
│  │  │  ├─ monthly_overview_view
│  │  │  └─ dashboard_stats_view


```

