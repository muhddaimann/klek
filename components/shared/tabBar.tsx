import * as React from "react";
import { View, Pressable, Platform } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, Text } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import { useTabsUi } from "../../contexts/tabContext";
import { useAuth } from "../../contexts/authContext";
import { useOverlay } from "../../hooks/useOverlay";
import { Plus, LogOut } from "lucide-react-native";
import { useRouter } from "expo-router";

function Bar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const { opacity, scale } = useTabsUi();
  const { signOut } = useAuth();
  const { options: showOptions } = useOverlay();

  const shadow = Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowRadius: tokens.elevation.level5 * 2,
      shadowOffset: { width: 0, height: tokens.elevation.level5 },
    },
    android: { elevation: tokens.elevation.level5 },
    default: { elevation: tokens.elevation.level5 },
  }) as any;

  const activeRoute = state.routes[state.index];
  const activeDescriptor = descriptors[activeRoute.key];
  const activeOptions = activeDescriptor.options;
  const CIRCLE_SIZE = tokens.sizes.icon.lg + tokens.spacing.lg * 2;

  const activeLabel =
    typeof activeOptions.tabBarLabel === "string"
      ? activeOptions.tabBarLabel
      : (activeOptions.title as string) ?? activeRoute.name;

  const isHome = activeLabel.toLowerCase() === "home";
  const isSettings = activeLabel.toLowerCase() === "settings";
  const showRight = isHome || isSettings;

  const variant: "default" | "destructive" = isSettings
    ? "destructive"
    : "default";

  const rightBg =
    variant === "destructive" ? colors.surface : colors.surface;

  const rightBorder =
    variant === "destructive" ? colors.error : colors.onSurface;

  const rightIconColor =
    variant === "destructive" ? colors.error : colors.onSurfaceVariant;

  const RightIcon = isHome ? Plus : isSettings ? LogOut : null;

  const handleRightPress = React.useCallback(() => {
    if (isHome) {
      showOptions({
        title: "New claim",
        options: [
          {
            id: "manual",
            label: "Manual claim",
            onPress: () => router.push("/manualClaim"),
          },
          {
            id: "bill-split",
            label: "Bill split",
            onPress: () => router.push("/billSplit"),
          },
        ],
      });
    } else if (isSettings) {
      signOut();
    }
  }, [isHome, isSettings, showOptions, signOut, router]);

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: Math.max(bottom, tokens.spacing.md),
        paddingHorizontal: tokens.spacing.lg,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: tokens.spacing.lg,
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
              alignSelf: "center",
            },
            shadow,
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

            const label =
              typeof options.tabBarLabel === "string"
                ? options.tabBarLabel
                : (options.title as string) ?? route.name;

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                hitSlop={tokens.spacing.xs}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={label}
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
                    ? colors.surfaceVariant
                    : "transparent",
                }}
              >
                {Icon ? (
                  <Icon
                    color={focused ? colors.onSurface : colors.onSurfaceVariant}
                    size={tokens.sizes.icon.lg}
                  />
                ) : null}
                <Text
                  style={{
                    marginTop: tokens.spacing["xxs"],
                    fontSize: tokens.typography.sizes.sm,
                    color: focused ? colors.onSurface : colors.onSurfaceVariant,
                    fontWeight: tokens.typography.weights.semibold,
                  }}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {showRight && RightIcon && (
          <Pressable
            hitSlop={tokens.spacing.xs}
            style={[
              {
                width: CIRCLE_SIZE,
                height: CIRCLE_SIZE,
                borderRadius: CIRCLE_SIZE / 2,
                backgroundColor: rightBg,
                borderWidth: 1,
                borderColor: rightBorder,
                opacity,
                transform: [{ scale }],
                alignItems: "center",
                justifyContent: "center",
              },
              shadow,
            ]}
            onPress={handleRightPress}
          >
            <RightIcon size={tokens.sizes.icon.lg} color={rightIconColor} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default React.memo(Bar);
