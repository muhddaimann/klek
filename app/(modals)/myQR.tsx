import React from "react";
import { View, Image } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useDesign } from "../../contexts/designContext";
import { H2, BodySmall, Caption } from "../../components/atom/text";
import { Button } from "../../components/atom/button";

export default function MyQr() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top + tokens.spacing.lg,
        paddingBottom: insets.bottom + tokens.spacing.lg,
        paddingHorizontal: tokens.spacing.lg,
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: tokens.spacing.lg,
        }}
      >
        <View style={{ alignItems: "center", gap: tokens.spacing["xxs"] }}>
          <Caption muted weight="bold">
            Receive money
          </Caption>
          <H2>Show my QR</H2>
          <BodySmall muted>
            Friends can scan this code to send you money or fronts.
          </BodySmall>
        </View>

        <View
          style={{
            padding: tokens.spacing.md,
            borderRadius: tokens.radii.xl,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
          }}
        >
          <Image
            source={require("../../assets/images/myQR.jpeg")}
            style={{ width: 240, height: 240, borderRadius: tokens.radii.md }}
            resizeMode="contain"
          />
        </View>
      </View>

      <Button fullWidth onPress={() => router.back()}>
        Done
      </Button>
    </View>
  );
}
