import * as React from "react";
import { View, Pressable, Platform } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, Text } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { useTabsUi } from "../../contexts/tabContext";

function Bar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { opacity, scale } = useTabsUi();

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: Math.max(bottom, tokens.spacing.md),
        alignItems: "center",
      }}
    >
      <View
        style={[
          {
            flexDirection: "row",
            gap: tokens.spacing.md,
            paddingHorizontal: tokens.spacing.md,
            paddingVertical: tokens.spacing.sm,
            borderRadius: tokens.radii.pill,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            opacity,
            transform: [{ scale }],
            maxWidth: 560,
            alignSelf: "center",
          },
          Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOpacity: 0.12,
              shadowRadius: tokens.elevation.level5 * 2,
              shadowOffset: { width: 0, height: tokens.elevation.level5 },
            },
            android: { elevation: tokens.elevation.level5 },
            default: { elevation: tokens.elevation.level5 },
          }) as any,
        ]}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];

          const onPress = React.useCallback(() => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented)
              navigation.navigate(route.name);
          }, [focused, navigation, route]);

          const Icon = options.tabBarIcon as any;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              hitSlop={tokens.spacing.xs}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={
                typeof options.tabBarLabel === "string"
                  ? options.tabBarLabel
                  : options.title ?? route.name
              }
              android_ripple={
                Platform.OS === "android"
                  ? { color: "#00000010", borderless: true }
                  : undefined
              }
              style={{
                minWidth: 72,
                paddingHorizontal: tokens.spacing.md,
                paddingVertical: tokens.spacing.xs,
                borderRadius: tokens.radii.pill,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused
                  ? colors.primaryContainer
                  : "transparent",
              }}
            >
              {Icon ? (
                <Icon
                  color={focused ? colors.primary : colors.onSurfaceVariant}
                  size={tokens.sizes.icon.md}
                />
              ) : null}
              {options.tabBarLabel !== undefined ? (
                <Text
                  style={{
                    marginTop: tokens.spacing["xxs"],
                    fontSize: tokens.typography.sizes.sm,
                    color: focused ? colors.primary : colors.onSurfaceVariant,
                    fontWeight: tokens.typography.weights.semibold,
                  }}
                  numberOfLines={1}
                >
                  {typeof options.tabBarLabel === "string"
                    ? options.tabBarLabel
                    : options.title ?? route.name}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default React.memo(Bar);
