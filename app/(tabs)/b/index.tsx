import React from "react";
import { ScrollView } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";

export default function Molecule() {
  const { colors } = useTheme();
  const { tokens } = useDesign();

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
    </>
  );
}
