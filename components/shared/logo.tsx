import React from "react";
import { IconCircleLetterK } from "tabler-icons-react-native";
import { useTheme } from "react-native-paper";
import { design } from "../../constants/design";

type LogoProps = {
  size?: number;
  color?: string;
};

const Logo = ({ size, color }: LogoProps) => {
  const theme = useTheme();
  const logoSize = size || design.sizes.icon.xl;
  const logoColor = color || theme.colors.primary;

  return <IconCircleLetterK size={logoSize} color={logoColor} />;
};

export default Logo;