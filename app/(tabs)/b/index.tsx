import React from "react";
import { ScrollView } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useAuth } from "../../../contexts/authContext";
import { useThemeToggle } from "../../../contexts/themeContext";
import { Fab } from "../../../components/molecule/fab";
import { LogOut, Sun, Moon } from "lucide-react-native";

export default function Molecule() {
  const { colors, dark } = useTheme();
  const { tokens } = useDesign();
  const { signOut } = useAuth();
  const { toggle } = useThemeToggle();

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ flexGrow: 1, padding: tokens.spacing.lg }}
        bounces={false}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
      />
      <Fab
        icon={LogOut}
        label="Sign out"
        variant="destructive"
        dock="bottom"
        onPress={signOut}
        accessibilityLabel="Sign out"
      />
    </>
  );
}
