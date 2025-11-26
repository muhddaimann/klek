import React, { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  PieChart,
  HandCoins,
  CalendarClock,
  ListChecks,
  Calculator,
  BellRing,
  LucideIcon,
} from "lucide-react-native";
import { useDesign } from "../contexts/designContext";
import { useAuth } from "../contexts/authContext";
import { Button } from "../components/atom/button";
import Logo from "../components/shared/logo";
import { H2, Body } from "../components/atom/text";
import { AppCarousel } from "../components/molecule/carousel";

type Feature = {
  title: string;
  desc: string;
  Icon: LucideIcon;
};

const FEATURES: Feature[] = [
  {
    title: "Monthly budgets",
    desc: "Set limits and see how much you’ve used by category.",
    Icon: PieChart,
  },
  {
    title: "Fronts & claims",
    desc: "Track who owes who and what needs to be claimed.",
    Icon: HandCoins,
  },
  {
    title: "Upcoming commitments",
    desc: "See bills, loans, and shared expenses in one view.",
    Icon: CalendarClock,
  },
  {
    title: "Wishlists",
    desc: "Plan big buys and keep track of what you’re saving for.",
    Icon: ListChecks,
  },
  {
    title: "Financial tools",
    desc: "Quick helpers for splits, projections, and simple planning.",
    Icon: Calculator,
  },
  {
    title: "Stay updated",
    desc: "Notifications so you don’t miss due dates or new activity.",
    Icon: BellRing,
  },
];

export default function Index() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isAuthenticated, bootstrapped } = useAuth();

  useEffect(() => {
    if (bootstrapped && isAuthenticated) router.replace("/welcome");
  }, [bootstrapped, isAuthenticated, router]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + tokens.spacing.lg,
          paddingBottom: insets.bottom + tokens.spacing.lg,
          paddingHorizontal: tokens.spacing.lg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 480,
            gap: tokens.spacing["2xl"],
          }}
        >
          <View style={{ alignItems: "center", gap: tokens.spacing.xs }}>
            <Logo size={tokens.typography.sizes["3xl"] * 1.8} />
            <H2 align="center" color={colors.onBackground}>
              Welcome to Klek
            </H2>
            <Body align="center" muted>
              Budgets, fronts, claims, wishlists and more in one place.
            </Body>
          </View>

          <AppCarousel
            data={FEATURES}
            keyExtractor={(item) => item.title}
            autoplay
            autoplayInterval={4500}
            loop
            showDots
            renderItem={(item) => {
              const { title, desc, Icon } = item;
              return (
                <View
                  style={{
                    borderRadius: tokens.radii["2xl"],
                    paddingHorizontal: tokens.spacing.lg,
                    paddingVertical: tokens.spacing.lg,
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.outlineVariant,
                    shadowColor: colors.shadow,
                    shadowOpacity: 0.06,
                    shadowOffset: { width: 0, height: 3 },
                    shadowRadius: 8,
                    elevation: 1,
                    alignItems: "center",
                    gap: tokens.spacing.lg,
                  }}
                >
                  <View
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: 22,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: colors.primary + "10",
                      marginBottom: tokens.spacing["xxs"],
                    }}
                  >
                    <Icon size={tokens.sizes.icon.xl} color={colors.primary} />
                  </View>

                  <Body
                    weight="semibold"
                    color={colors.onSurface}
                    align="center"
                  >
                    {title}
                  </Body>
                  <Body
                    muted
                    align="center"
                    style={{ marginTop: tokens.spacing["xxs"] }}
                  >
                    {desc}
                  </Body>
                </View>
              );
            }}
          />

          <View
            style={{
              borderRadius: tokens.radii["2xl"],
              paddingHorizontal: tokens.spacing.lg,
              paddingVertical: tokens.spacing.xl,
              gap: tokens.spacing.md,
            }}
          >
            <Button
              onPress={() => router.push("/(modals)/signIn")}
              variant="default"
              fullWidth
              rounded="pill"
            >
              Sign in
            </Button>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Body muted align="center">
                New to Klek?{"  "}
              </Body>
              <Button
                variant="link"
                size="md"
                onPress={() => router.push("/(modals)/signUp")}
                style={{ paddingHorizontal: 0 }}
              >
                Create an account
              </Button>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
