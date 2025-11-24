import React, { useState, useRef, useMemo, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useDesign } from "../../contexts/designContext";
import { Header } from "../../components/shared/header";
import { Button } from "../../components/atom/button";
import { Body, BodySmall, Caption } from "../../components/atom/text";

const MODE_OPTIONS = [
  { key: "lump", label: "Lump sum only" },
  { key: "withMonthly", label: "With monthly top-up" },
] as const;

type ModeKey = (typeof MODE_OPTIONS)[number]["key"];

function digitsToAmount(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return "";
  const num = Number(digits) / 100;
  return num.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseAmount(formatted: string) {
  if (!formatted) return 0;
  const num = Number(formatted.replace(/,/g, ""));
  return Number.isNaN(num) ? 0 : num;
}

function formatMoney(value: number) {
  return value.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function CompoundingEstimator() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [mode, setMode] = useState<ModeKey>("lump");
  const [initialAmount, setInitialAmount] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [annualRateStr, setAnnualRateStr] = useState("5");
  const [yearsStr, setYearsStr] = useState("5");

  const createdAtRef = useRef(new Date());
  const createdAt = createdAtRef.current;

  const initialRef = useRef<any>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      initialRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleInitialChange = (value: string) => {
    setInitialAmount(digitsToAmount(value));
  };

  const handleMonthlyChange = (value: string) => {
    setMonthlyAmount(digitsToAmount(value));
  };

  const handleRateChange = (value: string) => {
    const cleaned = value.replace(/[^0-9.,]/g, "").replace(",", ".");
    setAnnualRateStr(cleaned);
  };

  const handleYearsChange = (value: string) => {
    const digits = value.replace(/[^\d]/g, "");
    setYearsStr(digits);
  };

  const numericInitial = parseAmount(initialAmount);
  const numericMonthly = parseAmount(monthlyAmount);
  const annualRate = Number(annualRateStr);
  const years = Number(yearsStr);

  const isInitialValid = numericInitial > 0 && numericInitial < 5_000_000;
  const isMonthlyValid =
    mode === "withMonthly"
      ? numericMonthly > 0 && numericMonthly < 500_000
      : true;
  const isRateValid =
    !Number.isNaN(annualRate) && annualRate >= 0 && annualRate <= 30;
  const isYearsValid = !Number.isNaN(years) && years > 0 && years <= 50;

  const isValid =
    isInitialValid && isMonthlyValid && isRateValid && isYearsValid;

  const summary = useMemo(() => {
    if (!isValid) {
      return {
        futureValue: 0,
        totalContributed: 0,
        growth: 0,
        months: 0,
        monthlyRate: 0,
        label: "Fill in the fields to see the compounding estimate.",
      };
    }

    const months = years * 12;
    const rMonthly = annualRate / 100 / 12;
    const P = numericInitial;
    const PMT = mode === "withMonthly" ? numericMonthly : 0;

    let future = 0;

    if (rMonthly === 0) {
      future = P + PMT * months;
    } else {
      const factor = Math.pow(1 + rMonthly, months);
      const fvLump = P * factor;
      const fvMonthly = PMT > 0 ? PMT * ((factor - 1) / rMonthly) : 0;
      future = fvLump + fvMonthly;
    }

    const totalContributed = P + PMT * months;
    const growth = future - totalContributed;

    return {
      futureValue: future,
      totalContributed,
      growth,
      months,
      monthlyRate: rMonthly,
      label:
        "This is a rough projection based on constant returns and contributions.",
    };
  }, [isValid, numericInitial, numericMonthly, annualRate, years, mode]);

  const card = { borderRadius: tokens.radii.lg } as const;

  const handleClose = () => {
    router.back();
  };

  const handleUseEstimate = () => {
    if (!isValid) return;

    const payload = {
      mode,
      initialAmount: numericInitial,
      monthlyAmount: mode === "withMonthly" ? numericMonthly : 0,
      annualRate,
      years,
      futureValue: summary.futureValue,
      totalContributed: summary.totalContributed,
      growth: summary.growth,
      months: summary.months,
      createdAt: createdAt.toISOString(),
    };

    console.log("compounding-estimate", payload);
    router.back();
  };

  const effectiveAnnualRate =
    summary.monthlyRate > 0
      ? (Math.pow(1 + summary.monthlyRate, 12) - 1) * 100
      : annualRate;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + tokens.spacing["3xl"] * 2,
          gap: tokens.spacing.lg,
        }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        stickyHeaderIndices={[0]}
        bounces={false}
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
            title="Compounding estimator"
            subtitle="Estimate future value with compounding returns"
            onBackPress={handleClose}
          />
        </View>

        <View
          style={{
            paddingHorizontal: tokens.spacing.lg,
            gap: tokens.spacing.lg,
          }}
        >
          <View style={{ gap: tokens.spacing.sm }}>
            <BodySmall weight="semibold" color={colors.onSurface}>
              Plan mode
            </BodySmall>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: tokens.spacing.xs,
              }}
            >
              {MODE_OPTIONS.map((opt) => {
                const active = mode === opt.key;
                return (
                  <Button
                    key={opt.key}
                    onPress={() => setMode(opt.key)}
                    variant="outline"
                    size="sm"
                    rounded="pill"
                    style={{
                      paddingHorizontal: tokens.spacing.sm,
                      paddingVertical: tokens.spacing["xs"],
                      borderRadius: tokens.radii.pill,
                      borderWidth: 1,
                      borderColor: active
                        ? colors.primary
                        : colors.outlineVariant,
                      backgroundColor: active
                        ? colors.primaryContainer
                        : colors.surface,
                    }}
                  >
                    <BodySmall
                      weight="semibold"
                      style={{
                        fontSize: tokens.typography.sizes.xs,
                        color: active
                          ? colors.primary
                          : colors.onSurfaceVariant,
                      }}
                    >
                      {opt.label}
                    </BodySmall>
                  </Button>
                );
              })}
            </View>
          </View>

          <View style={{ gap: tokens.spacing.md }}>
            <TextInput
              mode="outlined"
              label="Initial amount"
              value={initialAmount}
              onChangeText={handleInitialChange}
              keyboardType="decimal-pad"
              ref={initialRef}
              error={initialAmount.length > 0 && !isInitialValid}
            />
            {initialAmount.length > 0 && !isInitialValid && (
              <Caption color={colors.error}>Enter an amount above 0</Caption>
            )}

            {mode === "withMonthly" && (
              <>
                <TextInput
                  mode="outlined"
                  label="Monthly top-up"
                  value={monthlyAmount}
                  onChangeText={handleMonthlyChange}
                  keyboardType="decimal-pad"
                  error={monthlyAmount.length > 0 && !isMonthlyValid}
                />
                {monthlyAmount.length > 0 && !isMonthlyValid && (
                  <Caption color={colors.error}>
                    Enter a reasonable monthly amount
                  </Caption>
                )}
              </>
            )}

            <TextInput
              mode="outlined"
              label="Expected annual return (%)"
              value={annualRateStr}
              onChangeText={handleRateChange}
              keyboardType="decimal-pad"
              error={annualRateStr.length > 0 && !isRateValid}
            />
            {annualRateStr.length > 0 && !isRateValid && (
              <Caption color={colors.error}>
                Enter a rate between 0% and 30%
              </Caption>
            )}

            <TextInput
              mode="outlined"
              label="Years to invest"
              value={yearsStr}
              onChangeText={handleYearsChange}
              keyboardType="number-pad"
              error={yearsStr.length > 0 && !isYearsValid}
            />
            {yearsStr.length > 0 && !isYearsValid && (
              <Caption color={colors.error}>
                Enter between 1 and 50 years
              </Caption>
            )}
          </View>

          <View style={{ gap: tokens.spacing.sm }}>
            <BodySmall weight="semibold" color={colors.onSurface}>
              Estimate
            </BodySmall>

            <View
              style={{
                ...card,
                backgroundColor: colors.surface,
                padding: tokens.spacing.md,
                gap: tokens.spacing["xs"],
              }}
            >
              {isValid ? (
                <>
                  <Body weight="semibold" color={colors.onSurface}>
                    Future value ≈ RM {formatMoney(summary.futureValue)}
                  </Body>
                  <Caption muted>
                    Total contributed: RM{" "}
                    {formatMoney(summary.totalContributed)}
                  </Caption>
                  <Caption muted>
                    Estimated growth: RM {formatMoney(summary.growth)}
                  </Caption>
                  <Caption muted>
                    Effective annual rate (approx):{" "}
                    {effectiveAnnualRate.toFixed(2)}%
                  </Caption>
                </>
              ) : (
                <Caption muted>{summary.label}</Caption>
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
                    This is a simple projection, not a guarantee or advice.
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
            onPress={handleUseEstimate}
            variant="default"
            disabled={!isValid}
            fullWidth
            rounded="pill"
          >
            Use this estimate
          </Button>
        </View>
      </View>
    </View>
  );
}
