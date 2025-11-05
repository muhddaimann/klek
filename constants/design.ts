// constants/design.ts
export type Density = "compact" | "comfortable" | "spacious";

export type Spacing = {
  /** 0..12 scale (px) */
  scale: readonly number[];
  /** quick named aliases */
  xxs: number; xs: number; sm: number; md: number; lg: number; xl: number; "2xl": number; "3xl": number;
};

export type Radii = {
  none: number; xs: number; sm: number; md: number; lg: number; xl: number; "2xl": number; pill: number; full: number;
};

export type Sizes = {
  icon: { sm: number; md: number; lg: number; xl: number };
  touch: { minHeight: number; hitSlop: number };
  container: { sm: number; md: number; lg: number; xl: number; max: number };
};

export type Motion = {
  duration: { fast: number; normal: number; slow: number; xslow: number };
  easing: {
    standard: (t: number) => number;
    emphasized: (t: number) => number;
    decel: (t: number) => number;
    accel: (t: number) => number;
  };
};

export type Elevation = {
  level0: number; level1: number; level2: number; level3: number; level4: number; level5: number;
};

export type Opacity = {
  disabled: number; hover: number; focus: number; pressed: number; drag: number;
};

export type Layout = {
  grid: { columns: number; gutter: number; margin: number };
  radiusForSheets: number;
};

export type DesignTokens = {
  density: Density;
  spacing: Spacing;
  radii: Radii;
  sizes: Sizes;
  motion: Motion;
  elevation: Elevation;
  opacity: Opacity;
  layout: Layout;
};

/** Easing helpers */
const cubic = (a: number, b: number, c: number, d: number) => (t: number) =>
  ((a * t + b) * t + c) * t + d;

const STANDARD = cubic(0.4, 0.0, 0.2, 0.0);
const EMPHASIZED = cubic(0.2, 0.0, 0.0, 1.0);
const DECEL = cubic(0.0, 0.0, 0.2, 1.0);
const ACCEL = cubic(0.4, 0.0, 1.0, 1.0);

export function createDesignTokens(density: Density = "comfortable", scale = 1): DesignTokens {
  const densityFactor = density === "compact" ? 0.9 : density === "spacious" ? 1.1 : 1.0;
  const s = (n: number) => Math.round(n * scale * densityFactor);

  // 4px base scale
  const base = [0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64].map(s) as unknown as readonly number[];

  return {
    density,
    spacing: {
      scale: base,
      xxs: base[2],  // 4
      xs: base[4],   // 8
      sm: base[5],   // 12
      md: base[6],   // 16
      lg: base[8],   // 24
      xl: base[9],   // 32
      "2xl": base[10], // 40
      "3xl": base[12], // 64
    },
    radii: {
      none: 0,
      xs: s(4),
      sm: s(8),
      md: s(12),
      lg: s(16),
      xl: s(20),
      "2xl": s(24),
      pill: 999,
      full: 9999,
    },
    sizes: {
      icon: { sm: s(16), md: s(20), lg: s(24), xl: s(28) },
      touch: { minHeight: s(44), hitSlop: s(8) },
      container: { sm: 640, md: 768, lg: 1024, xl: 1280, max: 1440 },
    },
    motion: {
      duration: { fast: 120, normal: 200, slow: 280, xslow: 360 },
      easing: {
        standard: STANDARD,
        emphasized: EMPHASIZED,
        decel: DECEL,
        accel: ACCEL,
      },
    },
    elevation: {
      level0: 0,
      level1: 1,
      level2: 3,
      level3: 6,
      level4: 8,
      level5: 12,
    },
    opacity: {
      disabled: 0.38,
      hover: 0.08,
      focus: 0.12,
      pressed: 0.12,
      drag: 0.16,
    },
    layout: {
      grid: { columns: 12, gutter: s(16), margin: s(16) },
      radiusForSheets: s(20),
    },
  };
}

/** Default tokens */
export const design: DesignTokens = createDesignTokens();
