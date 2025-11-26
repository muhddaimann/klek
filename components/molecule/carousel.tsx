import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";

type CarouselProps<T> = {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  autoplay?: boolean;
  autoplayInterval?: number;
  loop?: boolean;
  showDots?: boolean;
  showControls?: boolean;
  square?: boolean;
  onIndexChange?: (index: number) => void;
};

export function AppCarousel<T>({
  data,
  renderItem,
  keyExtractor,
  autoplay = false,
  autoplayInterval = 4000,
  loop = true,
  showDots = true,
  showControls = false,
  square = false,
  onIndexChange,
}: CarouselProps<T>) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const scrollRef = useRef<ScrollView | null>(null);

  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== index) {
      setIndex(next);
      onIndexChange?.(next);
    }
  };

  useEffect(() => {
    if (!autoplay || !width || data.length <= 1) return;

    const id = setInterval(() => {
      let next = index + 1;
      if (next >= data.length) {
        if (!loop) return;
        next = 0;
      }
      scrollRef.current?.scrollTo({
        x: next * width,
        animated: true,
      });
      setIndex(next);
      onIndexChange?.(next);
    }, autoplayInterval);

    return () => clearInterval(id);
  }, [
    autoplay,
    autoplayInterval,
    loop,
    width,
    index,
    data.length,
    onIndexChange,
  ]);

  const goTo = (next: number) => {
    if (!width) return;
    const safe = Math.max(0, Math.min(next, data.length - 1));
    scrollRef.current?.scrollTo({
      x: safe * width,
      animated: true,
    });
    setIndex(safe);
    onIndexChange?.(safe);
  };

  if (!data.length) return null;

  return (
    <View onLayout={handleLayout}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
      >
        {data.map((item, i) => (
          <View
            key={keyExtractor ? keyExtractor(item, i) : String(i)}
            style={{
              width: width || "100%",
              ...(square && width ? { height: width } : null),
              paddingHorizontal: tokens.spacing.xs,
            }}
          >
            {renderItem(item, i)}
          </View>
        ))}
      </ScrollView>

      {showDots && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: tokens.spacing["xxs"],
            marginTop: tokens.spacing.lg,
          }}
        >
          {data.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === index ? 18 : 6,
                height: 6,
                borderRadius: 999,
                backgroundColor:
                  i === index ? colors.primary : colors.outlineVariant,
              }}
            />
          ))}
        </View>
      )}

      {showControls && (
        <View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            top: "40%",
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: tokens.spacing.sm,
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.outlineVariant,
              justifyContent: "center",
              alignItems: "center",
              opacity: index === 0 && !loop ? 0.4 : 1,
            }}
          >
            <View
              onTouchEnd={() => {
                if (index === 0 && !loop) return;
                goTo(index === 0 ? data.length - 1 : index - 1);
              }}
              style={{ width: "100%", height: "100%" }}
            />
          </View>

          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.outlineVariant,
              justifyContent: "center",
              alignItems: "center",
              opacity: index === data.length - 1 && !loop ? 0.4 : 1,
            }}
          >
            <View
              onTouchEnd={() => {
                if (index === data.length - 1 && !loop) return;
                goTo(index === data.length - 1 ? 0 : index + 1);
              }}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        </View>
      )}
    </View>
  );
}
