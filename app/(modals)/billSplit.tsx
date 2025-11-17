import React, { useState, useRef, useMemo } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { Header } from "../../components/shared/header";

const DUE_OPTIONS = [
  { key: "none", label: "None" },
  { key: "thisWeek", label: "This week" },
  { key: "nextTwoWeeks", label: "Next two weeks" },
  { key: "thisMonth", label: "This month" },
] as const;

const MODE_OPTIONS = [
  { key: "equal", label: "Split equally" },
  { key: "custom", label: "Custom amounts" },
] as const;

type DueKey = (typeof DUE_OPTIONS)[number]["key"];
type SplitModeKey = (typeof MODE_OPTIONS)[number]["key"];

type Friend = {
  id: string;
  name: string;
  amount: number;
};

function getDueDateFromKey(base: Date, key: DueKey): string | null {
  if (key === "none") return null;

  const d = new Date(base);

  if (key === "thisWeek") {
    const day = d.getDay();
    const daysToEnd = (7 - day) % 7;
    d.setDate(d.getDate() + daysToEnd);
    d.setHours(23, 59, 59, 999);
    return d.toISOString();
  }

  if (key === "nextTwoWeeks") {
    d.setDate(d.getDate() + 14);
    d.setHours(23, 59, 59, 999);
    return d.toISOString();
  }

  if (key === "thisMonth") {
    const year = d.getFullYear();
    const month = d.getMonth();
    const endOfMonth = new Date(year, month + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
    return endOfMonth.toISOString();
  }

  return null;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDateWithDay(date: Date): string {
  const dayName = DAY_NAMES[date.getDay()];
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  return `${dayName}, ${dd}/${mm}/${yy}`;
}

function formatCents(value: string): string {
  if (!value) return "";
  const cents = Number(value);
  if (Number.isNaN(cents)) return "";
  return (cents / 100).toFixed(2);
}

export default function BillSplit() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();

  const createdAtRef = useRef(new Date());
  const createdAt = createdAtRef.current;

  const [step, setStep] = useState<1 | 2>(1);

  const [title, setTitle] = useState("");
  const [totalAmountCents, setTotalAmountCents] = useState("");
  const [headCount, setHeadCount] = useState("");
  const [dueKey, setDueKey] = useState<DueKey>("none");
  const [mode, setMode] = useState<SplitModeKey | null>(null);

  const [friends, setFriends] = useState<Friend[]>([]);
  const [youAmount, setYouAmount] = useState<number>(0);

  const numericTotal = totalAmountCents ? Number(totalAmountCents) / 100 : 0;
  const isTotalValid = numericTotal > 0;
  const hasTotalInput = totalAmountCents !== "";

  const numericHeadCount = Number(headCount.replace(/,/g, ""));
  const isHeadCountValid =
    Number.isInteger(numericHeadCount) && numericHeadCount >= 2;

  const dueAt = useMemo(
    () => getDueDateFromKey(createdAt, dueKey),
    [createdAt, dueKey]
  );

  const hasDue = dueKey !== "none" && !!dueAt;
  const dueLabel = hasDue
    ? `Due ${DUE_OPTIONS.find((o) => o.key === dueKey)?.label.toLowerCase()}`
    : "No due date set";
  const dueDateText = hasDue
    ? formatDateWithDay(new Date(dueAt!))
    : formatDateWithDay(createdAt);

  const canGoNextMeta =
    title.trim().length > 0 && isTotalValid && isHeadCountValid && !!mode;

  useMemo(() => {
    if (!isHeadCountValid || !isTotalValid || !mode) return;
    if (step !== 2) return;

    const friendCount = Math.max(1, numericHeadCount - 1);
    const equalShare =
      mode === "equal" && isTotalValid && isHeadCountValid
        ? numericTotal / numericHeadCount
        : 0;

    setFriends((prev) => {
      const next: Friend[] = [];
      for (let i = 0; i < friendCount; i++) {
        const existing = prev[i];
        next.push({
          id: existing?.id ?? String(i),
          name: existing?.name ?? "",
          amount:
            mode === "equal"
              ? equalShare
              : typeof existing?.amount === "number"
              ? existing.amount
              : 0,
        });
      }
      return next;
    });
  }, [
    step,
    numericHeadCount,
    numericTotal,
    isHeadCountValid,
    isTotalValid,
    mode,
  ]);

  const friendsTotal = useMemo(
    () => friends.reduce((sum, f) => sum + (Number(f.amount) || 0), 0),
    [friends]
  );

  const youShare =
    mode === "equal"
      ? isTotalValid && isHeadCountValid
        ? numericTotal / numericHeadCount
        : 0
      : youAmount;

  const allFriendsNamed = friends.every((f) => f.name.trim().length > 0);

  const amountsValid =
    mode === "equal"
      ? true
      : isTotalValid &&
        youAmount >= 0 &&
        friendsTotal >= 0 &&
        Math.abs(youAmount + friendsTotal - numericTotal) < 0.01;

  const canSave =
    step === 2 &&
    isTotalValid &&
    isHeadCountValid &&
    !!mode &&
    allFriendsNamed &&
    amountsValid;

  const handleTotalAmountChange = (text: string) => {
    const digits = text.replace(/\D/g, "");
    setTotalAmountCents(digits);
  };

  const handleNextFromMeta = () => {
    if (!canGoNextMeta) return;

    if (mode === "equal" && isTotalValid && isHeadCountValid) {
      const equalShare = numericTotal / numericHeadCount;
      setYouAmount(equalShare);
    } else if (mode === "custom" && isTotalValid) {
      setYouAmount(numericTotal);
    }

    setStep(2);
  };

  const handleFriendNameChange = (id: string, value: string) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: value } : f))
    );
  };

  const handleFriendAmountChange = (id: string, value: string) => {
    if (mode === "equal") return;
    const digits = value.replace(/\D/g, "");
    const cents = digits === "" ? 0 : Number(digits);
    const amount = cents / 100;
    setFriends((prev) => prev.map((f) => (f.id === id ? { ...f, amount } : f)));
  };

  const handleYouAmountChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const cents = digits === "" ? 0 : Number(digits);
    setYouAmount(cents / 100);
  };

  const handleSave = () => {
    if (!canSave) return;

    const payload = {
      bill: {
        title: title.trim(),
        totalAmount: numericTotal,
        headCount: numericHeadCount,
        createdAt: createdAt.toISOString(),
        dueKey,
        dueAt,
        mode,
        youShare,
      },
      payee: {
        name: "You",
        amount: youShare,
      },
      friends: friends.map((f) => ({
        name: f.name.trim(),
        amount: f.amount,
      })),
    };

    console.log("bill-split", payload);
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
        <Header
          title={step === 1 ? "Split a bill" : "Add friends & shares"}
          subtitle={
            step === 1
              ? "You paid first, now set up the split"
              : "You are the payee. Add who owes you and how much."
          }
        />

        {step === 1 && (
          <>
            <View style={{ gap: tokens.spacing.md }}>
              <TextInput
                mode="outlined"
                label="What is this bill for?"
                value={title}
                onChangeText={setTitle}
                autoCapitalize="sentences"
              />
              <TextInput
                mode="outlined"
                label="Total amount you paid"
                value={formatCents(totalAmountCents)}
                onChangeText={handleTotalAmountChange}
                keyboardType="number-pad"
                error={hasTotalInput && !isTotalValid}
              />
              {hasTotalInput && !isTotalValid && (
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

              <TextInput
                mode="outlined"
                label="How many people in total? (including you)"
                value={headCount}
                onChangeText={setHeadCount}
                keyboardType="number-pad"
                error={headCount.length > 0 && !isHeadCountValid}
              />
              {headCount.length > 0 && !isHeadCountValid && (
                <Text
                  style={{
                    marginTop: -tokens.spacing["xs"],
                    color: colors.error,
                    fontSize: tokens.typography.sizes.xs,
                  }}
                >
                  At least 2 people needed to split
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
                Due
              </Text>
              <View style={{ gap: tokens.spacing["xs"] }}>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: tokens.spacing.xs,
                  }}
                >
                  {DUE_OPTIONS.map((opt) => {
                    const active = dueKey === opt.key;
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
                          onPress={() => setDueKey(opt.key)}
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
                      <Text
                        style={{
                          fontSize: tokens.typography.sizes.xs,
                          color: colors.onSurfaceVariant,
                          textAlign: "center",
                        }}
                      >
                        {dueLabel} · {dueDateText}
                      </Text>
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

            <View style={{ gap: tokens.spacing.sm }}>
              <Text
                style={{
                  fontSize: tokens.typography.sizes.sm,
                  fontWeight: tokens.typography.weights.semibold,
                  color: colors.onSurface,
                }}
              >
                Split mode
              </Text>
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
                        onPress={() => setMode(opt.key)}
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
          </>
        )}

        {step === 2 && (
          <>
            <View
              style={{
                padding: tokens.spacing.md,
                borderRadius: tokens.radii.lg,
                borderWidth: 1,
                borderColor: colors.outlineVariant,
                backgroundColor: colors.surface,
                gap: tokens.spacing["xs"],
              }}
            >
              <Text
                style={{
                  fontSize: tokens.typography.sizes.sm,
                  fontWeight: tokens.typography.weights.semibold,
                  color: colors.onSurface,
                }}
              >
                {title || "Untitled bill"}
              </Text>
              <Text
                style={{
                  fontSize: tokens.typography.sizes.xs,
                  color: colors.onSurfaceVariant,
                }}
              >
                You paid RM {isTotalValid ? numericTotal.toFixed(2) : "-"} ·{" "}
                {dueLabel.toLowerCase()} · {dueDateText}
              </Text>
              {isHeadCountValid && (
                <Text
                  style={{
                    marginTop: tokens.spacing["xs"],
                    fontSize: tokens.typography.sizes.xs,
                    color: colors.onSurfaceVariant,
                  }}
                >
                  Total heads: {numericHeadCount} (you +{" "}
                  {Math.max(0, numericHeadCount - 1)} friends)
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
                You (payee)
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: tokens.spacing.sm,
                  alignItems: "center",
                  paddingVertical: tokens.spacing["xs"],
                }}
              >
                <Text
                  style={{
                    fontSize: tokens.typography.sizes.sm,
                    color: colors.onSurface,
                    flex: 1,
                  }}
                >
                  You
                </Text>
                {mode === "custom" ? (
                  <View style={{ width: 120 }}>
                    <TextInput
                      mode="outlined"
                      label="RM"
                      value={
                        youAmount || youAmount === 0 ? youAmount.toFixed(2) : ""
                      }
                      onChangeText={handleYouAmountChange}
                      keyboardType="number-pad"
                    />
                  </View>
                ) : (
                  <Text
                    style={{
                      fontSize: tokens.typography.sizes.sm,
                      fontWeight: tokens.typography.weights.semibold,
                      color: colors.onSurface,
                    }}
                  >
                    RM {youShare.toFixed(2)}
                  </Text>
                )}
              </View>
            </View>

            <View style={{ gap: tokens.spacing.sm }}>
              <Text
                style={{
                  fontSize: tokens.typography.sizes.sm,
                  fontWeight: tokens.typography.weights.semibold,
                  color: colors.onSurface,
                }}
              >
                Friends who owe you
              </Text>

              {friends.map((f) => (
                <View
                  key={f.id}
                  style={{
                    flexDirection: "row",
                    gap: tokens.spacing.sm,
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <TextInput
                      mode="outlined"
                      label="Name"
                      value={f.name}
                      onChangeText={(v) => handleFriendNameChange(f.id, v)}
                      autoCapitalize="words"
                    />
                  </View>
                  <View style={{ width: 120 }}>
                    <TextInput
                      mode="outlined"
                      label="RM"
                      value={
                        mode === "equal"
                          ? f.amount.toFixed(2)
                          : f.amount || f.amount === 0
                          ? f.amount.toFixed(2)
                          : ""
                      }
                      onChangeText={(v) => handleFriendAmountChange(f.id, v)}
                      keyboardType="number-pad"
                      disabled={mode === "equal"}
                    />
                  </View>
                </View>
              ))}

              {mode === "custom" && isTotalValid && (
                <Text
                  style={{
                    marginTop: tokens.spacing["xs"],
                    fontSize: tokens.typography.sizes.xs,
                    color: colors.onSurfaceVariant,
                  }}
                >
                  Friends total: RM {friendsTotal.toFixed(2)} · You: RM{" "}
                  {youShare.toFixed(2)} · Bill: RM {numericTotal.toFixed(2)}
                </Text>
              )}
            </View>
          </>
        )}
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
            flexDirection: "row",
            gap: tokens.spacing.sm,
          }}
        >
          {step === 2 && (
            <Button
              onPress={() => setStep(1)}
              variant="ghost"
              rounded="sm"
              style={{ flex: 1 }}
            >
              Back
            </Button>
          )}
          <Button
            onPress={step === 1 ? handleNextFromMeta : handleSave}
            variant="default"
            disabled={step === 1 ? !canGoNextMeta : !canSave}
            rounded="sm"
            style={{ flex: 1 }}
          >
            {step === 1 ? "Next" : "Save & create claims"}
          </Button>
        </View>
      </View>
    </View>
  );
}
