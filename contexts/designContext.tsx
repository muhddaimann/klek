import React, { createContext, useContext, useMemo, useState } from "react";
import { createDesignTokens, design as defaultDesign, type Density, type DesignTokens } from "../constants/design";

type DesignCtx = {
  tokens: DesignTokens;
  density: Density;
  setDensity: (d: Density) => void;
  scale: number;
  setScale: (n: number) => void;
};

const Ctx = createContext<DesignCtx>({
  tokens: defaultDesign,
  density: defaultDesign.density,
  setDensity: () => {},
  scale: 1,
  setScale: () => {},
});

export function DesignProvider({ children }: { children: React.ReactNode }) {
  const [density, setDensity] = useState<Density>("comfortable");
  const [scale, setScale] = useState<number>(1);

  const tokens = useMemo(() => createDesignTokens(density, scale), [density, scale]);

  const value = useMemo<DesignCtx>(() => ({ tokens, density, setDensity, scale, setScale }), [
    tokens,
    density,
    scale,
  ]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useDesign = () => useContext(Ctx);
