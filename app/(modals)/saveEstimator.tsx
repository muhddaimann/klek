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
  { key: "byDate", label: "Have target date" },
  { key: "byMonthly", label: "Have monthly budget" },
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

function addMonths(base: Date, months: number): Date {
  const d = new Date(base);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatDateWithDay(date: Date): string {
  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayName = DAY_NAMES[date.getDay()];
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  return `${dayName}, ${dd}/${mm}/${yy}`;
}

export default function SavingEstimator() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [mode, setMode] = useState<ModeKey>("byDate");
  const [targetAmount, setTargetAmount] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [monthsStr, setMonthsStr] = useState("6");

  const createdAtRef = useRef(new Date());
  const createdAt = createdAtRef.current;

  const targetRef = useRef<any>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      targetRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleTargetChange = (value: string) => {
    setTargetAmount(digitsToAmount(value));
  };

  const handleMonthlyChange = (value: string) => {
    setMonthlyAmount(digitsToAmount(value));
  };

  const handleMonthsChange = (value: string) => {
    const digits = value.replace(/[^\d]/g, "");
    setMonthsStr(digits);
  };

  const numericTarget = Number(targetAmount.replace(/,/g, ""));
  const numericMonthly = Number(monthlyAmount.replace(/,/g, ""));
  const months = Number(monthsStr);

  const isTargetValid =
    !Number.isNaN(numericTarget) &&
    numericTarget > 0 &&
    numericTarget < 1_000_000;
  const isMonthlyValid =
    !Number.isNaN(numericMonthly) &&
    numericMonthly > 0 &&
    numericMonthly < 100_000;
  const isMonthsValid = !Number.isNaN(months) && months > 0 && months <= 120;

  const isValidByDate = isTargetValid && isMonthsValid;
  const isValidByMonthly = isTargetValid && isMonthlyValid;

  const isValid = mode === "byDate" ? isValidByDate : isValidByMonthly;

  const summary = useMemo(() => {
    if (!isValid) {
      return {
        monthlyNeeded: 0,
        monthsNeeded: 0,
        completionDate: createdAt,
        label: "Fill the fields first to see your saving plan.",
      };
    }

    if (mode === "byDate") {
      const m = months;
      const monthly = numericTarget / m;
      const completionDate = addMonths(createdAt, m);
      return {
        monthlyNeeded: monthly,
        monthsNeeded: m,
        completionDate,
        label: "Save this amount every month to reach your target by then.",
      };
    }

    const monthsNeeded = Math.ceil(numericTarget / numericMonthly);
    const completionDate = addMonths(createdAt, monthsNeeded);
    return {
      monthlyNeeded: numericMonthly,
      monthsNeeded,
      completionDate,
      label: "With this monthly amount, this is roughly when you'll reach it.",
    };
  }, [isValid, mode, numericTarget, numericMonthly, months, createdAt]);

  const formatMoney = (value: number) =>
    value.toLocaleString("en-MY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleClose = () => {
    router.back();
  };

  const handleUsePlan = () => {
    if (!isValid) return;

    const payload = {
      mode,
      targetAmount: numericTarget,
      monthlyAmount: mode === "byDate" ? summary.monthlyNeeded : numericMonthly,
      monthsNeeded: summary.monthsNeeded,
      completionDate: summary.completionDate.toISOString(),
      createdAt: createdAt.toISOString(),
    };

    console.log("saving-estimate", payload);
    router.back();
  };

  const card = { borderRadius: tokens.radii.lg } as const;

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
            title="Saving estimator"
            subtitle="Plan monthly saving vs target amount or date"
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
              label="Target amount"
              value={targetAmount}
              onChangeText={handleTargetChange}
              keyboardType="decimal-pad"
              ref={targetRef}
              error={targetAmount.length > 0 && !isTargetValid}
            />
            {targetAmount.length > 0 && !isTargetValid && (
              <Caption color={colors.error}>
                Enter a target amount above 0
              </Caption>
            )}

            {mode === "byDate" ? (
              <TextInput
                mode="outlined"
                label="Months to reach target"
                value={monthsStr}
                onChangeText={handleMonthsChange}
                keyboardType="number-pad"
                error={monthsStr.length > 0 && !isMonthsValid}
              />
            ) : (
              <TextInput
                mode="outlined"
                label="Monthly saving budget"
                value={monthlyAmount}
                onChangeText={handleMonthlyChange}
                keyboardType="decimal-pad"
                error={monthlyAmount.length > 0 && !isMonthlyValid}
              />
            )}

            {mode === "byDate" && monthsStr.length > 0 && !isMonthsValid && (
              <Caption color={colors.error}>
                Enter between 1 and 120 months
              </Caption>
            )}

            {mode === "byMonthly" &&
              monthlyAmount.length > 0 &&
              !isMonthlyValid && (
                <Caption color={colors.error}>
                  Enter a reasonable monthly saving amount
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
                  {mode === "byDate" ? (
                    <>
                      <Body weight="semibold" color={colors.onSurface}>
                        Save ≈ RM {formatMoney(summary.monthlyNeeded)} per month
                      </Body>
                      <Caption muted>
                        Over {summary.monthsNeeded} months, starting now.
                      </Caption>
                      <Caption muted>
                        Approx target date:{" "}
                        {formatDateWithDay(summary.completionDate)}
                      </Caption>
                    </>
                  ) : (
                    <>
                      <Body weight="semibold" color={colors.onSurface}>
                        With RM {formatMoney(summary.monthlyNeeded)} per month
                      </Body>
                      <Caption muted>
                        You&apos;ll reach your target in about{" "}
                        {summary.monthsNeeded} months.
                      </Caption>
                      <Caption muted>
                        Approx target date:{" "}
                        {formatDateWithDay(summary.completionDate)}
                      </Caption>
                    </>
                  )}
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
                    Simple math only, no interest or returns included.
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
            onPress={handleUsePlan}
            variant="default"
            disabled={!isValid}
            fullWidth
            rounded="pill"
          >
            Use this saving plan
          </Button>
        </View>
      </View>
    </View>
  );
}
