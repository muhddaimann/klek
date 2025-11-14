import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, TextInput as RNInput } from "react-native";
import { useTheme, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../contexts/designContext";
import { Button } from "../../components/atom/button";
import { Header } from "../../components/shared/header";

const ROUNDING_OPTIONS = [
  { key: "none", label: "No rounding" },
  { key: "0.05", label: "Nearest 0.05" },
  { key: "0.10", label: "Nearest 0.10" },
  { key: "0.50", label: "Nearest 0.50" },
  { key: "1.00", label: "Nearest 1.00" },
] as const;

type RoundingKey = (typeof ROUNDING_OPTIONS)[number]["key"];

const MAX_PEOPLE = 12;

function roundToStep(value: number, step: number) {
  return Math.round(value / step) * step;
}

export default function BillSplit() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState("");
  const [total, setTotal] = useState("");
  const [people, setPeople] = useState("4");
  const [rounding, setRounding] = useState<RoundingKey>("none");
  const [personNames, setPersonNames] = useState<string[]>([]);

  const titleRef = useRef<RNInput | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      titleRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const numericTotal = Number(total.replace(/,/g, ""));
  const numericPeople = Number(people.replace(/,/g, ""));

  const hasValidTotal = !Number.isNaN(numericTotal) && numericTotal > 0;
  const hasValidPeople =
    !Number.isNaN(numericPeople) &&
    numericPeople > 0 &&
    Number.isInteger(numericPeople);

  useEffect(() => {
    if (!hasValidPeople) return;

    const count = Math.min(numericPeople, MAX_PEOPLE);

    setPersonNames((prev) => {
      const next = [...prev];

      if (next.length < count) {
        for (let i = next.length; i < count; i++) {
          next.push("");
        }
      } else if (next.length > count) {
        next.length = count;
      }

      return next;
    });
  }, [hasValidPeople, numericPeople]);

  const basePerHead =
    hasValidTotal && hasValidPeople ? numericTotal / numericPeople : 0;

  const roundedPerHead =
    hasValidTotal && hasValidPeople && rounding !== "none"
      ? roundToStep(basePerHead, Number(rounding))
      : basePerHead;

  const totalRounded =
    hasValidTotal && hasValidPeople ? roundedPerHead * numericPeople : 0;

  const roundingDiff =
    hasValidTotal && hasValidPeople ? numericTotal - totalRounded : 0;

  const isValid = title.trim().length > 0 && hasValidTotal && hasValidPeople;

  const handleSave = () => {
    const trimmedNames = personNames.map((n) => n.trim()).filter(Boolean);

    const payload = {
      title: title.trim(),
      total: numericTotal,
      peopleCount: numericPeople,
      peopleNames: trimmedNames,
      perHead: Number(roundedPerHead.toFixed(2)),
      rounding,
      roundingDiff: Number(roundingDiff.toFixed(2)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log("bill-split", payload);
  };

  const card = { borderRadius: tokens.radii.lg };

  const roundingMessage = (() => {
    if (!hasValidTotal || !hasValidPeople || rounding === "none") return null;
    const diff = Number(roundingDiff.toFixed(2));
    if (Math.abs(diff) < 0.01) return "Rounding is balanced – no difference.";
    if (diff > 0)
      return `Total is RM ${numericTotal.toFixed(
        2
      )}, split sums to RM ${totalRounded.toFixed(
        2
      )}. You cover RM ${diff.toFixed(2)} extra.`;
    return `Total is RM ${numericTotal.toFixed(
      2
    )}, split sums to RM ${totalRounded.toFixed(
      2
    )}. Friends cover RM ${Math.abs(diff).toFixed(2)} extra.`;
  })();

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
          title="Bill split"
          subtitle="Work out how much each friend owes"
        />

        <View style={{ gap: tokens.spacing.md }}>
          <TextInput
            mode="outlined"
            label="Bill name"
            value={title}
            onChangeText={setTitle}
            autoCapitalize="sentences"
            ref={titleRef}
            autoFocus
          />

          <TextInput
            mode="outlined"
            label="Total amount"
            value={total}
            onChangeText={setTotal}
            keyboardType="decimal-pad"
            error={total.length > 0 && !hasValidTotal}
          />

          <TextInput
            mode="outlined"
            label="Number of people"
            value={people}
            onChangeText={setPeople}
            keyboardType="number-pad"
            error={people.length > 0 && !hasValidPeople}
          />

          {(total.length > 0 && !hasValidTotal) ||
          (people.length > 0 && !hasValidPeople) ? (
            <Text
              style={{
                marginTop: -tokens.spacing["xs"],
                color: colors.error,
                fontSize: tokens.typography.sizes.xs,
              }}
            >
              Enter a valid total and whole number of people
            </Text>
          ) : null}
        </View>

        {hasValidPeople && (
          <View style={{ gap: tokens.spacing.sm }}>
            <Text
              style={{
                fontSize: tokens.typography.sizes.sm,
                fontWeight: tokens.typography.weights.semibold,
                color: colors.onSurface,
              }}
            >
              People (optional names)
            </Text>
            <View style={{ gap: tokens.spacing.xs }}>
              {personNames.map((value, index) => (
                <TextInput
                  key={index}
                  mode="outlined"
                  label={`Person ${index + 1}`}
                  value={value}
                  onChangeText={(text) =>
                    setPersonNames((prev) => {
                      const next = [...prev];
                      next[index] = text;
                      return next;
                    })
                  }
                  autoCapitalize="words"
                  dense
                />
              ))}
            </View>
          </View>
        )}

        <View style={{ gap: tokens.spacing.sm }}>
          <Text
            style={{
              fontSize: tokens.typography.sizes.sm,
              fontWeight: tokens.typography.weights.semibold,
              color: colors.onSurface,
            }}
          >
            Rounding
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: tokens.spacing.xs,
            }}
          >
            {ROUNDING_OPTIONS.map((opt) => {
              const active = rounding === opt.key;
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
                    onPress={() => setRounding(opt.key)}
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

        <View
          style={{
            backgroundColor: colors.surface,
            padding: tokens.spacing.md,
            ...card,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            gap: tokens.spacing.sm,
          }}
        >
          <Text
            style={{
              fontSize: tokens.typography.sizes.sm,
              fontWeight: tokens.typography.weights.semibold,
              color: colors.onSurface,
            }}
          >
            Summary
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: tokens.spacing.sm,
            }}
          >
            <Text
              style={{
                fontSize: tokens.typography.sizes.xs,
                color: colors.onSurfaceVariant,
              }}
            >
              Total bill
            </Text>
            <Text
              style={{
                fontSize: tokens.typography.sizes.xs,
                color: colors.onSurface,
              }}
              numberOfLines={1}
            >
              {hasValidTotal ? `RM ${numericTotal.toFixed(2)}` : "–"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: tokens.spacing.sm,
            }}
          >
            <Text
              style={{
                fontSize: tokens.typography.sizes.xs,
                color: colors.onSurfaceVariant,
              }}
            >
              People
            </Text>
            <Text
              style={{
                fontSize: tokens.typography.sizes.xs,
                color: colors.onSurface,
              }}
              numberOfLines={1}
            >
              {hasValidPeople ? numericPeople : "–"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: tokens.spacing.sm,
            }}
          >
            <Text
              style={{
                fontSize: tokens.typography.sizes.xs,
                color: colors.onSurfaceVariant,
              }}
            >
              Each pays
            </Text>
            <Text
              style={{
                fontSize: tokens.typography.sizes.sm,
                fontWeight: tokens.typography.weights.semibold,
                color: colors.onSurface,
              }}
              numberOfLines={1}
            >
              {isValid ? `RM ${roundedPerHead.toFixed(2)}` : "–"}
            </Text>
          </View>

          {roundingMessage && (
            <Text
              style={{
                marginTop: tokens.spacing.xs,
                fontSize: tokens.typography.sizes.xs,
                color: colors.onSurfaceVariant,
              }}
            >
              {roundingMessage}
            </Text>
          )}
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
            Save split
          </Button>
        </View>
      </View>
    </View>
  );
}
