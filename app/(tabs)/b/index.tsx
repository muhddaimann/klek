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
        icon={dark ? Sun : Moon}
        label={dark ? "Light" : "Dark"}
        variant="secondary"
        size="lg"
        corner="center-bottom"
        offset={tokens.spacing.xl}
        onPress={toggle}
        accessibilityLabel="Toggle theme"
      />
      <Fab
        icon={LogOut}
        label="Sign out"
        variant="primary"
        corner="br"
        onPress={signOut}
        accessibilityLabel="Sign out"
      />
    </>
  );
}
