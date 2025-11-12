import React from "react";
import { Animated, ViewStyle } from "react-native";
import { useCollapsible } from "./collapsableProvider";

export function CollapsibleHeader({
  style,
  children,
}: {
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
}) {
  const { scrollY, maxHeight, minHeight } = useCollapsible();
  const range = [0, maxHeight - minHeight];
  const translateY = scrollY.interpolate({
    inputRange: range,
    outputRange: [0, -(maxHeight - minHeight)],
    extrapolate: "clamp",
  });
  const height = scrollY.interpolate({
    inputRange: range,
    outputRange: [maxHeight, minHeight],
    extrapolate: "clamp",
  });
  return (
    <Animated.View style={[{ position: "absolute", left: 0, right: 0, top: 0, height, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
