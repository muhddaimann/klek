import React, { useState, useRef, useMemo, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { Header } from "../../components/shared/header";
import { OptionTile } from "../../components/atom/optionTile";
import { Body, BodySmall, Caption } from "../../components/atom/text";
import { ShieldCheck, Gauge, Rocket } from "lucide-react-native";

const PROFILE_OPTIONS = [
  { key: "conservative", label: "Play safe" },
  { key: "balanced", label: "Balanced" },
  { key: "growth", label: "Growth" },
] as const;

type ProfileKey = (typeof PROFILE_OPTIONS)[number]["key"];

const PROFILE_RATIO: Record<ProfileKey, number> = {
  conservative: 0.2,
  balanced: 0.3,
  growth: 0.4,
};

export default function SafeCommit() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const createdAtRef = useRef(new Date());
  const createdAt = createdAtRef.current;

  const [income, setIncome] = useState("");
  const [existingCommit, setExistingCommit] = useState("");
  const [essentialsPct, setEssentialsPct] = useState("60");
  const [profile, setProfile] = useState<ProfileKey>("balanced");

  const incomeRef = useRef<any>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      incomeRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const digitsToAmount = (value: string) => {
    const digits = value.replace(/[^\d]/g, "");
    if (!digits) return "";
    const num = Number(digits) / 100;
    return num.toLocaleString("en-MY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleIncomeChange = (value: string) => {
    setIncome(digitsToAmount(value));
  };

  const handleExistingChange = (value: string) => {
    setExistingCommit(digitsToAmount(value));
  };

  const numericIncome = Number(income.replace(/,/g, ""));
  const numericExisting = Number(existingCommit.replace(/,/g, "") || 0);
  const numericEssentials = Number(essentialsPct.replace(/[^\d]/g, "") || 0);

  const isIncomeValid =
    !Number.isNaN(numericIncome) &&
    numericIncome > 0 &&
    numericIncome < 1_000_000;
  const isEssentialsValid =
    !Number.isNaN(numericEssentials) &&
    numericEssentials >= 0 &&
    numericEssentials <= 100;

  const isValid = isIncomeValid && isEssentialsValid;

  const summary = useMemo(() => {
    if (!isValid) {
      return {
        safeCap: 0,
        available: 0,
        essentialsAmount: 0,
        label: "Fill in income and essentials to see a suggestion",
      };
    }

    const essentialsAmount = (numericEssentials / 100) * numericIncome;
    const profileCap = PROFILE_RATIO[profile] * numericIncome;
    const baseCap = Math.min(profileCap, numericIncome - essentialsAmount);
    const available = Math.max(baseCap - numericExisting, 0);

    return {
      safeCap: baseCap,
      available,
      essentialsAmount,
      label:
        available <= 0
          ? "You may already be fully committed this month."
          : "This is a rough safe range based on your inputs.",
    };
  }, [isValid, numericIncome, numericEssentials, numericExisting, profile]);

  const formatMoney = (value: number) =>
    value.toLocaleString("en-MY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleApply = () => {
    if (!isValid) return;

    const payload = {
      income: numericIncome,
      existingCommit: numericExisting,
      essentialsPct: numericEssentials,
      profile,
      safeCap: summary.safeCap,
      available: summary.available,
      createdAt: createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("safe-commit", payload);
    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  const renderProfileIcon = (key: ProfileKey) => {
    const size = tokens.sizes.icon.md;
    const color = colors.primary;
    if (key === "conservative")
      return <ShieldCheck size={size} color={color} />;
    if (key === "growth") return <Rocket size={size} color={color} />;
    return <Gauge size={size} color={color} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + tokens.spacing["3xl"] * 9,
          gap: tokens.spacing.md,
        }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        bounces={false}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: colors.background,
            paddingTop: tokens.spacing.lg,
            paddingHorizontal: tokens.spacing.lg,
            paddingBottom: tokens.spacing.sm,
          }}
        >
          <Header
            title="Safe commit helper"
            subtitle="Based on income, see a safe monthly commitment"
            onBackPress={handleClose}
          />
        </View>

        <View
          style={{
            paddingHorizontal: tokens.spacing.lg,
            gap: tokens.spacing.lg,
          }}
        >
          <View style={{ gap: tokens.spacing.md }}>
            <TextInput
              mode="outlined"
              label="Monthly net income"
              value={income}
              onChangeText={handleIncomeChange}
              keyboardType="decimal-pad"
              ref={incomeRef}
              error={income.length > 0 && !isIncomeValid}
            />
            {income.length > 0 && !isIncomeValid && (
              <Caption color={colors.error}>
                Enter a reasonable monthly income
              </Caption>
            )}
            <TextInput
              mode="outlined"
              label="Existing monthly commitments"
              value={existingCommit}
              onChangeText={handleExistingChange}
              keyboardType="decimal-pad"
            />
            <TextInput
              mode="outlined"
              label="Essentials % (rent, food, etc.)"
              value={essentialsPct}
              onChangeText={(v) => setEssentialsPct(v.replace(/[^\d]/g, ""))}
              keyboardType="number-pad"
              error={essentialsPct.length > 0 && !isEssentialsValid}
            />
            {essentialsPct.length > 0 && !isEssentialsValid && (
              <Caption color={colors.error}>
                Enter a percentage between 0 and 100
              </Caption>
            )}
          </View>

          <View style={{ gap: tokens.spacing.sm }}>
            <BodySmall weight="semibold" color={colors.onSurface}>
              Comfort level
            </BodySmall>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: tokens.spacing.xs,
              }}
            >
              {PROFILE_OPTIONS.map((opt) => {
                const active = profile === opt.key;
                return (
                  <OptionTile
                    key={opt.key}
                    label={opt.label}
                    active={active}
                    onPress={() => setProfile(opt.key)}
                    icon={renderProfileIcon(opt.key)}
                  />
                );
              })}
            </View>
          </View>

          <View style={{ gap: tokens.spacing.sm }}>
            <BodySmall weight="semibold" color={colors.onSurface}>
              Suggestion
            </BodySmall>

            <View
              style={{
                borderRadius: tokens.radii.lg,
                backgroundColor: colors.surface,
                padding: tokens.spacing.md,
                gap: tokens.spacing["xs"],
              }}
            >
              <Body weight="semibold" color={colors.onSurface}>
                {isValid
                  ? `You can safely commit around RM ${formatMoney(
                      summary.available
                    )} per month.`
                  : "Fill in your income and essentials to see a suggestion."}
              </Body>
              {isValid && (
                <>
                  <Caption muted>
                    Essentials ≈ RM {formatMoney(summary.essentialsAmount)} ·
                    Profile cap ≈ RM {formatMoney(summary.safeCap)}.
                  </Caption>
                  <Caption muted>{summary.label}</Caption>
                </>
              )}
            </View>

            <View
              style={{
                marginTop: tokens.spacing.sm,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: colors.outlineVariant,
                  }}
                />
                <View
                  style={{
                    paddingHorizontal: tokens.spacing.sm,
                  }}
                >
                  <Caption muted>
                    Use this as a rough guide, not strict advice.
                  </Caption>
                </View>
                <View
                  style={{
                    flex: 1,
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: colors.outlineVariant,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        pointerEvents="box-none"
        style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
      >
        <View
          style={{
            paddingHorizontal: tokens.spacing.lg,
            paddingTop: tokens.spacing.sm,
            paddingBottom: insets.bottom + tokens.spacing.lg,
            backgroundColor: colors.background,
            borderTopWidth: 0.5,
            borderTopColor: colors.outlineVariant,
          }}
        >
          <Button
            onPress={handleApply}
            variant="default"
            disabled={!isValid}
            fullWidth
            rounded="pill"
          >
            Apply this range
          </Button>
        </View>
      </View>
    </View>
  );
}
