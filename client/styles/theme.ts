// styles/theme.js
import { TextStyle } from "react-native";

export const FONT_SIZES: Record<string, number> = {
  small: 12,
  regular: 14,
  medium: 16,
  large: 18,
  title: 22,
};

export const FONT_WEIGHTS: Record<string, TextStyle["fontWeight"]> = {
  regular: "400",
  medium: "500",
  bold: "700",
};

export const SPACING: Record<string, number> = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
};

export const COLORS = {
  primary: "#4caf50",
  background: "#b3d4e0",
  white: "#ffffff",
  textGray: "gray",
};
