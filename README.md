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

Hi Everyone! 👋

🌩️ We’re Hiring: Cloud & Application Support Engineer 🌩️
📍 Location: Kota Damansara
💼 Employment Type: Full-time
💰 Salary: RM3,000 – RM6,000/month

✨ What You’ll Do:
Be the first line of support for incidents and troubleshooting
Monitor system performance and security alerts
Support application deployment and cloud configurations
Contribute to automation and continuous improvement

Klek – personal finance & fronts tracker
├─ Core
│  ├─ Timeline — All money moves (spend, income, lent, received)
│  ├─ Categories — Food, Transport, Bills, etc.
│  ├─ Insights — This month spend, by category, basic charts
│  ├─ To Claim — Friends owe you (focus on this month)
│  ├─ To Pay   — You owe others (focus on this month)
│
├─ Front / Claim Extras (Klek’s special sauce)
│  ├─ Informal Debt — “Lend / Borrow” with friends
│  ├─ Bill Splitting — Group meals, rides, etc.
│  ├─ Wishlist — Planned trips / eats / events to track later spends
│  ├─ Settlements — Mark as paid, partial, overpaid
|
├─ Home
│  ├─ Informal Debt — To claim from friends list
│  ├─ Bill Splitting — Group meals, rides, etc.
│  ├─ Wishlist — Planned trips / eats / events to track later spends
│  ├─ Settlements — Mark as paid, partial, overpaid

├─ App Layout
├─ HeaderBar
│  ├─ App name ("Klek") / greeting
│  ├─ Current month selector (◀ Oct 2025 ▶)
│  ├─ Small avatar / entry to Settings
│
├─ SummaryStrip
│  ├─ "This month spent"
│  ├─ "To claim" (friends owe you)
│  ├─ "To pay" (you owe others)
│
├─ QuickActionsRow
│  ├─ [+ Expense]
│  ├─ [+ Lent to friend]
│  ├─ [+ Split bill]
│
├─ ToClaimSection
│  ├─ Title: "To claim"
│  ├─ Small list (top 3) – friend name, amount, due tag
│  ├─ "View all" link
│
├─ ToPaySection
│  ├─ Title: "To pay"
│  ├─ Small list – who you owe, amount, due tag
│  ├─ "View all" link
│
├─ WishlistStrip (optional v1.1)
│  ├─ Horizontal chips/cards for trips / eats
│
├─ TimelineSection
│  ├─ Title: "Recent activity"
│  ├─ List of last 5–10 transactions:
│      • icon (expense / lent / split)
│      • label, friend (if any), amount, date
│  ├─ Settings —
│  ├─ Auth — Sign in, up, forgot, onboarding

```
