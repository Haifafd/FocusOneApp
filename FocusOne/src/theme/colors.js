const palette = {
  // الألوان الأساسية
  primary: "#2196F3",        
  primaryDark: "#1976D2",
  primaryLight: "#64B5F6",

  // ألوان مساعدة
  success: "#4CAF50",
  warning: "#FF9800",
  danger: "#F44336",

  // درجات الرمادي
  white: "#FFFFFF",
  gray100: "#F5F7FA",
  gray200: "#E4E7EB",
  gray300: "#CBD2D9",
  gray400: "#9AA5B1",
  gray500: "#7B8794",
  gray600: "#52606D",
  gray700: "#3E4C59",
  gray800: "#1F2933",
  gray900: "#0F172A",
  black: "#000000",
};

// (Light Mode)
export const lightTheme = {
  mode: "light",
  background: palette.white,
  surface: palette.gray100,
  card: palette.white,
  text: palette.gray900,
  textSecondary: palette.gray600,
  textMuted: palette.gray400,
  border: palette.gray200,
  primary: palette.primary,
  primaryDark: palette.primaryDark,
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  shadow: "rgba(0, 0, 0, 0.1)",
};

// (Dark Mode)
export const darkTheme = {
  mode: "dark",
  background: palette.gray900,
  surface: palette.gray800,
  card: palette.gray800,
  text: palette.white,
  textSecondary: palette.gray300,
  textMuted: palette.gray500,
  border: palette.gray700,
  primary: palette.primaryLight,
  primaryDark: palette.primary,
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  shadow: "rgba(0, 0, 0, 0.4)",
};

export default palette;