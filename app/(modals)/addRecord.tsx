import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useTheme, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  UtensilsCrossed,
  Dumbbell,
  Clapperboard,
  Plane,
  Shapes,
} from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { OptionTile } from "../../components/atom/optionTile";
import { Header } from "../../components/shared/header";
import { Body, BodySmall } from "../../components/atom/text";

const CATEGORY_OPTIONS = [
  { key: "food", label: "Food" },
  { key: "sport", label: "Sport" },
  { key: "entertainment", label: "Entertainment" },
  { key: "travel", label: "Travel" },
  { key: "other", label: "Others" },
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

  const renderCategoryIcon = (key: CategoryKey) => {
    const size = tokens.sizes.icon.md;
    const iconColor = colors.primary;
    switch (key) {
      case "food":
        return <UtensilsCrossed size={size} color={iconColor} />;
      case "sport":
        return <Dumbbell size={size} color={iconColor} />;
      case "entertainment":
        return <Clapperboard size={size} color={iconColor} />;
      case "travel":
        return <Plane size={size} color={iconColor} />;
      case "other":
      default:
        return <Shapes size={size} color={iconColor} />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + tokens.spacing.lg,
        }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        bounces={false}
        stickyHeaderIndices={[0]}
      >
        <View
          style={{
            backgroundColor: colors.background,
            paddingTop: tokens.spacing.lg,
            paddingHorizontal: tokens.spacing.lg,
            paddingBottom: tokens.spacing.sm,
          }}
        >
          <Header title="Add spending" subtitle="Log this under your budget" />
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
              <BodySmall
                color={colors.error}
                style={{
                  marginTop: -tokens.spacing["xs"],
                  fontSize: tokens.typography.sizes.xs,
                }}
              >
                Enter a valid amount above 0
              </BodySmall>
            )}
          </View>

          <View style={{ gap: tokens.spacing.sm }}>
            <BodySmall
              weight="semibold"
              color={colors.onSurface}
              style={{
                fontSize: tokens.typography.sizes.sm,
              }}
            >
              Category
            </BodySmall>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                rowGap: tokens.spacing.sm,
                columnGap: tokens.spacing.sm,
                justifyContent: "center",
                alignSelf: "center",
                width: "100%",
              }}
            >
              {CATEGORY_OPTIONS.map((opt) => {
                const active = category === opt.key;
                return (
                  <OptionTile
                    key={opt.key}
                    active={active}
                    label={opt.label}
                    icon={renderCategoryIcon(opt.key)}
                    onPress={() => setCategory(opt.key)}
                  />
                );
              })}
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
            onPress={handleSave}
            variant="default"
            disabled={!isValid}
            fullWidth
            rounded="pill"
          >
            <Body weight="semibold" color={colors.onPrimary}>
              Save record
            </Body>
          </Button>
        </View>
      </View>
    </View>
  );
}
