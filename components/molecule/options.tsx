import React from "react";
import { View, Pressable, Platform } from "react-native";
import { useTheme, Divider } from "react-native-paper";
import { useDesign } from "../../contexts/designContext";
import type { OptionsOverlayOptions } from "../../contexts/overlayContext";
import { H3, Body, BodySmall } from "../atom/text";

const DURATION = 240;

export function OptionsCenter({
  visible,
  state,
  onSelect,
  onDismiss,
}: {
  visible: boolean;
  state: OptionsOverlayOptions | null;
  onSelect: (index: number) => void;
  onDismiss: () => void;
}) {
  const { colors } = useTheme();
  const { tokens } = useDesign();

  const canDismiss = state?.dismissible ?? true;
  if (!visible || !state) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        inset: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      accessible
      accessibilityLabel={state.title ?? "Options dialog"}
      accessibilityViewIsModal
      accessibilityLiveRegion="polite"
    >
      <Pressable
        onPress={canDismiss ? onDismiss : undefined}
        accessible={false}
        style={{ position: "absolute", inset: 0, backgroundColor: "#00000088" }}
      />

      <View
        style={{
          width: "90%",
          maxWidth: 420,
          borderRadius: tokens.radii.lg,
          backgroundColor: "transparent",
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOpacity: 0.18,
              shadowRadius: tokens.elevation.level5 * 2,
              shadowOffset: { width: 0, height: tokens.elevation.level5 },
            },
            android: { elevation: tokens.elevation.level5 },
            default: { elevation: tokens.elevation.level5 },
          }),
        }}
      >
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: tokens.radii.lg,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: colors.outlineVariant,
          }}
        >
          {(state.title || state.message) && (
            <View
              style={{
                paddingHorizontal: tokens.spacing.lg,
                paddingTop: tokens.spacing.lg,
                paddingBottom: tokens.spacing.sm,
              }}
            >
              {state.title ? <H3>{state.title}</H3> : null}
              {state.message ? (
                <BodySmall muted style={{ marginTop: tokens.spacing.xs }}>
                  {state.message}
                </BodySmall>
              ) : null}
            </View>
          )}

          <Divider
            style={{ backgroundColor: colors.outlineVariant, opacity: 0.6 }}
          />

          <View
            style={{
              paddingVertical: tokens.spacing.xs,
            }}
          >
            {state.options.map((opt, index) => (
              <Pressable
                key={opt.id ?? `${index}`}
                onPress={() => onSelect(index)}
                style={({ pressed }) => ({
                  paddingHorizontal: tokens.spacing.lg,
                  paddingVertical: tokens.spacing.sm,
                  backgroundColor: pressed
                    ? colors.surfaceVariant
                    : "transparent",
                })}
              >
                <Body>{opt.label}</Body>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
