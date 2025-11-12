import React from "react";
import { Animated, ScrollViewProps } from "react-native";
import { useCollapsible } from "./collapsableProvider";

export function CollapsibleScroll({
  children,
  contentContainerStyle,
  ...props
}: ScrollViewProps) {
  const { scrollY, maxHeight } = useCollapsible();
  return (
    <Animated.ScrollView
      {...props}
      contentContainerStyle={[{ paddingTop: maxHeight }, contentContainerStyle]}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      bounces={false}
    >
      {children}
    </Animated.ScrollView>
  );
}
