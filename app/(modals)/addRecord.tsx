import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useTheme, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { Header } from "../../components/shared/header";

const CATEGORY_OPTIONS = [
  { key: "food", label: "Food" },
  { key: "sport", label: "Sport" },
  { key: "entertainment", label: "Entertainment" },
  { key: "travel", label: "Travel" },
  { key: "other", label: "Other" },
] as const;

type CategoryKey = (typeof CATEGORY_OPTIONS)[number]["key"];

export default function BudgetRecord() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<CategoryKey | null>(null);

  const titleRef = useRef<any>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      titleRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleAmountChange = (value: string) => {
    const digits = value.replace(/[^\d]/g, "");
    if (!digits) {
      setAmount("");
      return;
    }
    const num = Number(digits) / 100;
    const formatted = num.toLocaleString("en-MY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setAmount(formatted);
  };

  const numericAmount = Number(amount.replace(/,/g, ""));
  const isAmountValid = !Number.isNaN(numericAmount) && numericAmount > 0;

  const isValid = title.trim().length > 0 && isAmountValid && category !== null;

  const handleSave = () => {
    if (!isValid) return;

    const payload = {
      title: title.trim(),
      amount: numericAmount,
      category,
      createdAt: new Date().toISOString(),
    };

    console.log("budget-record-add", payload);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: tokens.spacing.lg,
          paddingTop: tokens.spacing.lg,
          paddingBottom: insets.bottom + tokens.spacing["3xl"] * 2,
          gap: tokens.spacing.lg,
        }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <Header title="Add spending" subtitle="Log this under your budget" />

        <View style={{ gap: tokens.spacing.md }}>
          <TextInput
            mode="outlined"
            label="What did you spend on?"
            value={title}
            onChangeText={setTitle}
            autoCapitalize="sentences"
            ref={titleRef}
          />
          <TextInput
            mode="outlined"
            label="Amount (RM)"
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="decimal-pad"
            error={amount.length > 0 && !isAmountValid}
          />
          {amount.length > 0 && !isAmountValid && (
            <Text
              style={{
                marginTop: -tokens.spacing["xs"],
                color: colors.error,
                fontSize: tokens.typography.sizes.xs,
              }}
            >
              Enter a valid amount above 0
            </Text>
          )}
        </View>

        <View style={{ gap: tokens.spacing.sm }}>
          <Text
            style={{
              fontSize: tokens.typography.sizes.sm,
              fontWeight: tokens.typography.weights.semibold,
              color: colors.onSurface,
            }}
          >
            Category
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: tokens.spacing.xs,
            }}
          >
            {CATEGORY_OPTIONS.map((opt) => {
              const active = category === opt.key;
              return (
                <View
                  key={opt.key}
                  style={{
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
                  <Button
                    onPress={() => setCategory(opt.key)}
                    variant="ghost"
                    size="sm"
                    rounded="pill"
                    style={{
                      paddingHorizontal: tokens.spacing.sm,
                      paddingVertical: tokens.spacing["xs"],
                    }}
                  >
                    <Text
                      style={{
                        fontSize: tokens.typography.sizes.xs,
                        color: active
                          ? colors.primary
                          : colors.onSurfaceVariant,
                        fontWeight: tokens.typography.weights.semibold,
                      }}
                    >
                      {opt.label}
                    </Text>
                  </Button>
                </View>
              );
            })}
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
            onPress={handleSave}
            variant="default"
            disabled={!isValid}
            fullWidth
            rounded="sm"
          >
            Save record
          </Button>
        </View>
      </View>
    </View>
  );
}
