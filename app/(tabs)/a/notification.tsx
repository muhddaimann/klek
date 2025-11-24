import React, { useState, useMemo, useCallback } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, Info, AlertTriangle, CheckCircle2 } from "lucide-react-native";
import { useFocusEffect } from "expo-router";
import { useDesign } from "../../../contexts/designContext";
import { useTab } from "../../../hooks/useTab";
import { Header } from "../../../components/shared/header";
import { EmptyState } from "../../../components/molecule/emptyState";
import { Body, BodySmall, Caption } from "../../../components/atom/text";
import { Button } from "../../../components/atom/button";

type NotificationType = "tip" | "reminder" | "activity" | "system";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  timeLabel: string;
  type: NotificationType;
  read: boolean;
};

type FilterKey = "all" | "unread";

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Budget almost at limit",
    body: "You have used 82% of your monthly spend plan.",
    timeLabel: "Just now",
    type: "reminder",
    read: false,
  },
  {
    id: "2",
    title: "Claim added for RM 45.80",
    body: "Grab ride to office is pending reimbursement.",
    timeLabel: "2h ago",
    type: "activity",
    read: false,
  },
  {
    id: "3",
    title: "New calculator tools",
    body: "Try the safe commit helper before taking new loans.",
    timeLabel: "Yesterday",
    type: "tip",
    read: true,
  },
  {
    id: "4",
    title: "Backup completed",
    body: "Your Klek data has been safely backed up.",
    timeLabel: "3 days ago",
    type: "system",
    read: true,
  },
];

export default function Notifications() {
  const { colors } = useTheme();
  const { tokens } = useDesign();
  const insets = useSafeAreaInsets();
  const { lockHidden, unlockHidden } = useTab();

  const [items, setItems] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const card = { borderRadius: tokens.radii.lg } as const;

  useFocusEffect(
    useCallback(() => {
      lockHidden();
      return () => unlockHidden();
    }, [lockHidden, unlockHidden])
  );

  const filtered = useMemo(
    () =>
      items.filter((item) => (activeFilter === "unread" ? !item.read : true)),
    [items, activeFilter]
  );

  const hasUnread = items.some((n) => !n.read);

  const handleMarkAllRead = () => {
    if (!hasUnread) return;
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const renderIcon = (type: NotificationType, read: boolean) => {
    const size = tokens.sizes.icon.sm;
    const color = read ? colors.onSurfaceVariant : colors.primary;
    if (type === "reminder") return <Bell size={size} color={color} />;
    if (type === "activity") return <CheckCircle2 size={size} color={color} />;
    if (type === "system") return <Info size={size} color={color} />;
    return <AlertTriangle size={size} color={color} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + tokens.spacing["3xl"],
          gap: tokens.spacing.md,
        }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        stickyHeaderIndices={[0]}
        bounces={false}
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
            title="Notifications"
            subtitle="Updates about your money, claims, and plans"
            style={{ paddingHorizontal: 0 }}
            rightSlot={
              <Button
                variant="secondary"
                size="sm"
                onPress={handleMarkAllRead}
                disabled={!hasUnread}
                accessibilityLabel="Mark all notifications as read"
              >
                Mark all as read
              </Button>
            }
          />
        </View>

        <View
          style={{
            paddingHorizontal: tokens.spacing.lg,
            gap: tokens.spacing.sm,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: tokens.spacing.xs,
            }}
          >
            {(["all", "unread"] as FilterKey[]).map((key) => {
              const active = activeFilter === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => setActiveFilter(key)}
                  style={{
                    paddingHorizontal: tokens.spacing.md,
                    paddingVertical: tokens.spacing.xs,
                    borderRadius: tokens.radii.pill,
                    backgroundColor: active
                      ? colors.primaryContainer
                      : colors.surface,
                    borderWidth: 1,
                    borderColor: active
                      ? colors.primary
                      : colors.outlineVariant,
                  }}
                >
                  <BodySmall
                    color={active ? colors.primary : colors.onSurfaceVariant}
                    weight="semibold"
                  >
                    {key === "all" ? "All" : "Unread"}
                  </BodySmall>
                </Pressable>
              );
            })}
          </View>

          <View
            style={{
              backgroundColor: colors.surface,
              paddingVertical: tokens.spacing.sm,
              ...card,
            }}
          >
            {filtered.length === 0 ? (
              <EmptyState
                title={
                  activeFilter === "unread"
                    ? "You're all caught up"
                    : "No notifications yet"
                }
                subtitle={
                  activeFilter === "unread"
                    ? "No unread notifications right now."
                    : "Klek will show updates about your spending and fronts here."
                }
              />
            ) : (
              filtered.map((item, idx) => {
                const isRead = item.read;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => handleToggleRead(item.id)}
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      paddingHorizontal: tokens.spacing.md,
                      paddingVertical: tokens.spacing.sm,
                      borderTopWidth: idx === 0 ? 0 : 1,
                      borderTopColor: colors.outlineVariant,
                      gap: tokens.spacing.md,
                      opacity: isRead ? 0.7 : 1,
                    }}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isRead
                          ? colors.surfaceVariant
                          : colors.primaryContainer,
                      }}
                    >
                      {renderIcon(item.type, isRead)}
                    </View>

                    <View
                      style={{
                        flex: 1,
                        gap: tokens.spacing["xxs"],
                      }}
                    >
                      <Body
                        weight={isRead ? "reg" : "semibold"}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Body>
                      <BodySmall muted numberOfLines={2}>
                        {item.body}
                      </BodySmall>
                      <Caption muted>{item.timeLabel}</Caption>
                    </View>

                    {!isRead && (
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: colors.primary,
                          marginTop: tokens.spacing["xs"],
                        }}
                      />
                    )}
                  </Pressable>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
