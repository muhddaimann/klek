import { useCallback, useEffect, useMemo } from "react";
import type { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { usePathname, useFocusEffect } from "expo-router";
import { useTabsUi } from "../contexts/tabContext";

export function useTab() {
  const ctx = useTabsUi();
  const route = usePathname();

  useEffect(() => {
    if (route) ctx.setActiveRoute(route);
  }, [route, ctx]);

  useFocusEffect(
    useCallback(() => {
      if (route) ctx.setActiveRoute(route);
      return () => {};
    }, [route, ctx])
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      ctx.saveOffset(route, y);
      ctx.updateByOffset(y);
    },
    [ctx, route]
  );

  const onScrollY = useCallback(
    (y: number) => {
      ctx.saveOffset(route, y);
      ctx.updateByOffset(y);
    },
    [ctx, route]
  );

  return useMemo(
    () => ({
      mode: ctx.mode,
      opacity: ctx.opacity,
      scale: ctx.scale,
      reveal: ctx.reveal,
      dim: ctx.dim,
      hide: ctx.hide,
      lockHidden: ctx.lockHidden,
      unlockHidden: ctx.unlockHidden,
      updateByOffset: ctx.updateByOffset,
      onScroll,
      onScrollY,
    }),
    [ctx, onScroll, onScrollY]
  );
}
