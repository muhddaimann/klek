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

Klek – collect/claim/back finance app
├─ About
│  ├─ Mission — Turn fronts into fast reimbursements.
│  ├─ Problem — You pay first; collecting is slow.
│  ├─ Outcome — Cashflow kept intrack.
├─ User Persona
│  ├─ Primary — Young pro, fronts meals/rides.
│  ├─ Secondary — Small teams, housemates.
│  ├─ Pain — Forget who owes; awkward chasing.
├─ User Persona
│  ├─ Primary — Young pro, fronts meals/rides.
│  ├─ Secondary — Small teams, housemates.
│  ├─ Pain — Forget who owes; awkward chasing.
├─ Core Flows
│ ├─ Quick Add — Amount, title, default split.
│ ├─ Template Add — Save common splits.
│ ├─ Repeat Last — Clone previous expense.
│ ├─ Itemized Split — Assign by line items.
│ ├─ Weighted Split — Percent or ratio.
│ ├─ Round Shares — Up/nearest rules.
│ ├─ Fees & Tips — Auto allocate SST/service/tip.
│ ├─ Due Date — Soft or firm.
│ ├─ Partial Payment — Track remaining.
│ ├─ Overpayment — Auto adjust next claim.
│ ├─ Attach Proof — Photo/PDF/note.
│ ├─ Receipt Scan — OCR → totals/items.
│ ├─ Location Tag — Place of spend.
│ ├─ Category Tag — Meal/ride/misc.
│ ├─ Multi-Currency — FX note on date.
│ ├─ Reassign Payer — Change who owes.
│ ├─ Merge Duplicates — Combine entries.
│ ├─ Group Mode — House/team/trip tabs.
│ ├─ Invite via Link — Join claim group.
│ ├─ Deep Link — Open exact claim/expense.
│ ├─ QR Share — Show scan-to-claim.
│ ├─ Payment Handoff — eWallet/bank deeplinks.
│ ├─ Payment Note — Ref no. and channel.
│ ├─ Self-Confirm — Trusted contacts bypass.
│ ├─ Counter-Confirm — Payer marks paid.
│ ├─ Nudge Ladder — Gentle → firm → final.
│ ├─ Smart Timing — After payday/9am windows.
│ ├─ Quiet Hours — No pings at night.
│ ├─ Per-Contact Caps — Limit reminders/day.
│ ├─ Bulk Settle — Clear many at once.
│ ├─ Archive Old — Hide stale debts.
│ ├─ Owed Today — Action list first.
│ ├─ Aging Buckets — 0–7 / 8–30 / 31+ days.
│ ├─ People Ledger — Who owes / I owe.
│ ├─ Netting — Offset mutual debts.
│ ├─ Statements — Monthly per-person PDF.
│ ├─ CSV Export — Raw ledger out.
│ ├─ Claim Summary — Trip/event PDF.
│ ├─ Cashflow View — Out vs back-in chart.
│ ├─ Uncollected Trend — Week/month line.
│ ├─ Alerts — Due soon, overdue, paid.
│ ├─ Inbox — New confirmations & proofs.
│ ├─ Tags & Search — Fast filter.
│ ├─ Saved Views — One-tap filters.
│ ├─ Shortcuts — OS quick actions.
│ ├─ Widgets — Owed today, quick add.
├─ Onboarding & Setup
│ ├─ Sample Data — Demo claims preloaded.
│ ├─ Import Contacts — Optional mapping.
│ ├─ Default Split — Equal/weights preset.
│ ├─ Reminder Style — Soft/neutral/firm tone.
│ ├─ Currency & Locale — MYR first.
├─ Reliability & Privacy
│ ├─ Offline-First — Queue ops, sync later.
│ ├─ Conflict Resolve — Last write + timeline.
│ ├─ Backup — JSON to Drive/iCloud.
│ ├─ Restore — Import backup.
│ ├─ Biometric Lock — Face/Touch.
│ ├─ Blur Amounts — Hide in public.
│ ├─ Redact Screens — Share safe view.
│ ├─ Audit Trail — Who/what/when.
├─ Integrations
│ ├─ Contacts Picker — Names/photos.
│ ├─ Calendar Drop — Due date events.
│ ├─ Email/SMS Share — Multi-channel.
│ ├─ Web Claim Page — Payer breakdown.
│ ├─ Mileage Hook — Add km→claim flow.
│ ├─ Parking Ticket — Timer + attach proof.
├─ Smart Assist
│ ├─ Suggested Payers — Based on history.
│ ├─ Smart Titles — From receipt/location.
│ ├─ Smart Splits — Learn typical ratios.
│ ├─ Anomaly Flag — Weird totals/FX dates.
├─ Settings & Support
│ ├─ Profile — Name, handle, avatar.
│ ├─ Themes — Light/dark/system.
│ ├─ Data Reset — Nuke local data.
│ ├─ Send Logs — Opt-in diagnostics.
│ ├─ Changelog — What’s new.
│ ├─ Rate Prompt — After first paid claim.


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

Klek – personal finance & fronts tracker
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
│ ├─ Timeline — Activity Tracking
│ │ ├─ Chronological list of spends, fronts, claims and settlements
│ │ ├─ Tag each activity as expense, lent, or received
│ │ ├─ Show amount, short label, and date for each event
│ │ ├─ Filter by month to review what happened over time

```
