import React, { useState, useRef, useMemo, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useDesign } from "../../contexts/designContext";
import { Header } from "../../components/shared/header";
import { Button } from "../../components/atom/button";
import { OptionTile } from "../../components/atom/optionTile";
import { Body, BodySmall, Caption } from "../../components/atom/text";
import { Wallet2, PiggyBank, HandCoins, Shapes } from "lucide-react-native";

const LOAN_TYPE_OPTIONS = [
  { key: "car", label: "Car" },
  { key: "home", label: "Home" },
  { key: "personal", label: "Personal" },
] as const;

const TENURE_PRESET_OPTIONS = [
  { key: "3", label: "3 years", years: 3 },
  { key: "5", label: "5 years", years: 5 },
  { key: "7", label: "7 years", years: 7 },
  { key: "9", label: "9 years", years: 10 },
] as const;

type LoanTypeKey = (typeof LOAN_TYPE_OPTIONS)[number]["key"];
type TenurePresetKey = (typeof TENURE_PRESET_OPTIONS)[number]["key"];

export default function LoanEstimator() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [loanType, setLoanType] = useState<LoanTypeKey | null>("car");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("3.00");
  const [tenureYears, setTenureYears] = useState("5");
  const [activeTenurePreset, setActiveTenurePreset] =
    useState<TenurePresetKey | null>("5");

  const amountRef = useRef<any>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      amountRef.current?.focus();
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

  const handleAmountChange = (value: string) => {
    setAmount(digitsToAmount(value));
  };

  const handleRateChange = (value: string) => {
    setRate(value.replace(/[^0-9.]/g, ""));
  };

  const handleTenureChange = (value: string) => {
    const digits = value.replace(/[^\d]/g, "");
    setTenureYears(digits);
    setActiveTenurePreset(null);
  };

  const applyTenurePreset = (
    preset: (typeof TENURE_PRESET_OPTIONS)[number]
  ) => {
    setTenureYears(String(preset.years));
    setActiveTenurePreset(preset.key);
  };

  const numericAmount = Number(amount.replace(/,/g, ""));
  const annualRatePct = Number(rate);
  const years = Number(tenureYears);

  const isAmountValid =
    !Number.isNaN(numericAmount) &&
    numericAmount > 0 &&
    numericAmount < 2_000_000;
  const isRateValid =
    !Number.isNaN(annualRatePct) && annualRatePct >= 0 && annualRatePct <= 36;
  const isTenureValid = !Number.isNaN(years) && years > 0 && years <= 35;

  const isValid = isAmountValid && isRateValid && isTenureValid;

  const summary = useMemo(() => {
    if (!isValid) {
      return {
        monthlyPayment: 0,
        totalPaid: 0,
        totalInterest: 0,
        label: "Fill in amount, rate, and tenure to see the estimate.",
      };
    }

    const P = numericAmount;
    const rAnnual = annualRatePct / 100;
    const n = years * 12;

    if (rAnnual === 0) {
      const monthly = P / n;
      return {
        monthlyPayment: monthly,
        totalPaid: P,
        totalInterest: 0,
        label: "No interest: monthly is principal divided by number of months.",
      };
    }

    const rMonthly = rAnnual / 12;
    const factor = Math.pow(1 + rMonthly, n);
    const monthly = (P * rMonthly * factor) / (factor - 1);
    const totalPaid = monthly * n;
    const totalInterest = totalPaid - P;

    return {
      monthlyPayment: monthly,
      totalPaid,
      totalInterest,
      label:
        "This is a simple amortised loan estimate. Actual offers may differ.",
    };
  }, [isValid, numericAmount, annualRatePct, years]);

  const formatMoney = (value: number) =>
    value.toLocaleString("en-MY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleClose = () => {
    router.back();
  };

  const handleUseEstimate = () => {
    if (!isValid) return;

    const payload = {
      loanType,
      amount: numericAmount,
      annualRatePct,
      tenureYears: years,
      monthlyPayment: summary.monthlyPayment,
      totalPaid: summary.totalPaid,
      totalInterest: summary.totalInterest,
      createdAt: new Date().toISOString(),
    };

    console.log("loan-estimate", payload);
    router.back();
  };

  const renderLoanTypeIcon = (key: LoanTypeKey) => {
    const size = tokens.sizes.icon.md;
    const color = colors.primary;
    if (key === "car") return <Wallet2 size={size} color={color} />;
    if (key === "home") return <PiggyBank size={size} color={color} />;
    if (key === "personal") return <HandCoins size={size} color={color} />;
    return <Shapes size={size} color={color} />;
  };

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
            title="Loan estimator"
            subtitle="Monthly payment and total interest for a simple loan"
            onBackPress={handleClose}
          />
        </View>

        <View
          style={{
            paddingHorizontal: tokens.spacing.lg,
            gap: tokens.spacing.md,
          }}
        >
          <View style={{ gap: tokens.spacing.sm }}>
            <BodySmall weight="semibold" color={colors.onSurface}>
              Loan type
            </BodySmall>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: tokens.spacing.xs,
              }}
            >
              {LOAN_TYPE_OPTIONS.map((opt) => {
                const active = loanType === opt.key;
                return (
                  <OptionTile
                    key={opt.key}
                    label={opt.label}
                    active={active}
                    onPress={() => setLoanType(opt.key)}
                    icon={renderLoanTypeIcon(opt.key)}
                  />
                );
              })}
            </View>
          </View>

          <View style={{ gap: tokens.spacing.md }}>
            <TextInput
              mode="outlined"
              label="Loan amount"
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="decimal-pad"
              ref={amountRef}
              error={amount.length > 0 && !isAmountValid}
            />
            {amount.length > 0 && !isAmountValid && (
              <Caption color={colors.error}>
                Enter a reasonable loan amount
              </Caption>
            )}

            <TextInput
              mode="outlined"
              label="Annual interest rate (%)"
              value={rate}
              onChangeText={handleRateChange}
              keyboardType="decimal-pad"
              error={rate.length > 0 && !isRateValid}
            />
            {rate.length > 0 && !isRateValid && (
              <Caption color={colors.error}>
                Enter a rate between 0 and 36
              </Caption>
            )}

            <TextInput
              mode="outlined"
              label="Tenure (years)"
              value={tenureYears}
              onChangeText={handleTenureChange}
              keyboardType="number-pad"
              error={tenureYears.length > 0 && !isTenureValid}
            />
            {tenureYears.length > 0 && !isTenureValid && (
              <Caption color={colors.error}>
                Enter years between 1 and 35
              </Caption>
            )}
          </View>

          <View style={{ gap: tokens.spacing.sm }}>
            <BodySmall weight="semibold" color={colors.onSurface}>
              Quick tenure presets
            </BodySmall>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: tokens.spacing.xs,
              }}
            >
              {TENURE_PRESET_OPTIONS.map((opt) => {
                const active = activeTenurePreset === opt.key;
                return (
                  <Button
                    key={opt.key}
                    onPress={() => applyTenurePreset(opt)}
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

          <View style={{ gap: tokens.spacing.sm }}>
            <BodySmall weight="semibold" color={colors.onSurface}>
              Estimate
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
                  ? `Monthly payment ≈ RM ${formatMoney(
                      summary.monthlyPayment
                    )}`
                  : "Enter all fields to see the monthly payment."}
              </Body>
              {isValid && (
                <>
                  <Caption muted>
                    Total interest ≈ RM {formatMoney(summary.totalInterest)}
                  </Caption>
                  <Caption muted>
                    Total paid over loan ≈ RM {formatMoney(summary.totalPaid)}
                  </Caption>
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
                    This is a rough estimate, not financial advice.
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
