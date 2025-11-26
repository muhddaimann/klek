import React, { useMemo } from "react";
import { View, Pressable } from "react-native";
import { useTheme, Avatar } from "react-native-paper";
import { useRouter } from "expo-router";
import { Bell, UserCircle2, QrCode } from "lucide-react-native";
import { useDesign } from "../../contexts/designContext";
import { useOverlay } from "../../hooks/useOverlay";
import { useGreeting } from "../../hooks/useGreeting";
import { useAuth } from "../../contexts/authContext";
import { H2, Caption, BodySmall } from "../atom/text";

type Props = {
  username: string;
  monthLabel: string;
  onMonthSelect: (month: string) => void;
  onBellPress?: () => void;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function MainHeader({
  username,
  monthLabel,
  onMonthSelect,
  onBellPress,
}: Props) {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const router = useRouter();
  const { options: showOptions } = useOverlay();
  const { greeting } = useGreeting();
  const { remainingSec, expiresAt } = useAuth();

  const CIRCLE = tokens.spacing["2xl"];

  const dayPillLabel = useMemo(() => {
    const now = new Date();
    const weekday = now.toLocaleDateString(undefined, {
      weekday: "short",
    });
    const day = now.getDate();
    return `${weekday} ${day}`;
  }, []);

  const sessionLabel = useMemo(() => {
    if (!expiresAt || remainingSec <= 0) return "Session expired";

    let secs = remainingSec;
    const days = Math.floor(secs / 86400);
    secs = secs % 86400;
    const hours = Math.floor(secs / 3600);
    secs = secs % 3600;
    const minutes = Math.floor(secs / 60);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (parts.length === 0) parts.push("less than 1m");

    return `Session ends in ${parts.join(" ")}`;
  }, [expiresAt, remainingSec]);

  const handleAvatarPress = () => {
    showOptions({
      options: [
        {
          id: "update-profile",
          label: "Update profile",
          icon: <UserCircle2 color={colors.primary} />,
          onPress: () => {
            router.push("/(tabs)/b");
          },
        },
        {
          id: "show-qr",
          label: "Show my QR",
          icon: <QrCode color={colors.primary} />,
          onPress: () => {
            router.push("/(modals)/myQR");
          },
        },
      ],
    });
  };

  const handleBellPress = () => {
    if (onBellPress) onBellPress();
  };

  const handleMonthPress = () => {
    const monthOptions = MONTHS.map((month, index) => ({
      id: String(index),
      label: month,
      onPress: () => {
        onMonthSelect(month);
      },
    }));

    showOptions({
      options: monthOptions,
    });
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: tokens.spacing.md,
      }}
    >
      <View style={{ flex: 1, gap: tokens.spacing["xxs"] }}>
        <Caption muted weight="bold">
          {`${greeting}, ${username}.`}
        </Caption>
        <H2>{sessionLabel}</H2>
      </View>

      <View
        style={{
          gap: tokens.spacing.sm,
          alignItems: "flex-end",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: tokens.spacing.sm,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Pressable
            onPress={handleBellPress}
            hitSlop={tokens.spacing.xs}
            style={{
              width: CIRCLE,
              height: CIRCLE,
              borderRadius: CIRCLE / 2,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.outlineVariant,
            }}
          >
            <Bell size={tokens.sizes.icon.md} color={colors.onSurfaceVariant} />
          </Pressable>

          <Pressable
            onPress={handleAvatarPress}
            hitSlop={tokens.spacing.xs}
            style={{
              width: CIRCLE,
              height: CIRCLE,
              borderRadius: CIRCLE / 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar.Text
              size={CIRCLE}
              label={username?.charAt(0).toUpperCase() || "K"}
              style={{ backgroundColor: colors.primary }}
              color={colors.onPrimary}
            />
          </Pressable>
        </View>

        <View
          style={{
            marginTop: tokens.spacing["xs"],
            flexDirection: "row",
          }}
        >
          <View
            style={{
              borderRadius: tokens.radii.lg,
              paddingHorizontal: tokens.spacing.sm,
              paddingVertical: tokens.spacing.xs,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <BodySmall muted>{dayPillLabel}</BodySmall>
          </View>

          <Pressable
            onPress={handleMonthPress}
            style={{
              borderRadius: tokens.radii.lg,
              paddingHorizontal: tokens.spacing.sm,
              paddingVertical: tokens.spacing.xs,
              backgroundColor: colors.surface,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <BodySmall muted>{monthLabel}</BodySmall>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
