# paperNative

Learning template for **Expo + React Native Paper** with **personalized design tokens** and a simple overlay system (Alert / Confirm / Modal / Toast).

## Authors
- [@muhddaimann](https://www.github.com/muhddaimann)

## Quick Start
```bash
npm install
npm run dev - ios

paperNative/
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
│  ├─ images/
│  ├─ adaptive-icon.png
│  ├─ favicon.png
│  ├─ icon.png
│  └─ splash-icon.png
├─ components/
│  ├─ atom/
│  │  ├─ button.tsx
│  │  └─ text.tsx
│  ├─ molecule/
│  │  ├─ alert.tsx
│  │  ├─ confirm.tsx
│  │  ├─ modal.tsx
│  │  └─ toast.tsx
│  └─ shared/
│     └─ header.tsx
├─ constants/
│  ├─ design.ts
│  └─ theme.ts
├─ contexts/
│  ├─ authContext.tsx
│  ├─ designContext.tsx
│  ├─ overlayContext.tsx
│  └─ themeContext.tsx
├─ hooks/
│  ├─ useBlog.tsx
│  ├─ useKeyboard.tsx
│  ├─ useOverlay.tsx
│  └─ useText.tsx
├─ .gitignore
├─ app.json
├─ package-lock.json
├─ package.json
├─ README.md
└─ tsconfig.json




