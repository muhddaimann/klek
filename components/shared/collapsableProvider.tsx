import React, { createContext, useContext, useMemo, useRef } from "react";
import { Animated } from "react-native";

type Ctx = {
  scrollY: Animated.Value;
  maxHeight: number;
  minHeight: number;
};
const C = createContext<Ctx | null>(null);

export function CollapsibleProvider({
  maxHeight,
  minHeight,
  children,
}: {
  maxHeight: number;
  minHeight: number;
  children: React.ReactNode;
}) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const value = useMemo(() => ({ scrollY, maxHeight, minHeight }), [scrollY, maxHeight, minHeight]);
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useCollapsible() {
  const v = useContext(C);
  if (!v) throw new Error("useCollapsible must be used within CollapsibleProvider");
  return v;
}
