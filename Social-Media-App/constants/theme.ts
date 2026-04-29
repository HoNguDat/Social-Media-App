export type ColorTheme = {
  primary: string;
  primaryDark: string;
  dark: string;
  darkLight: string;
  gray: string;
  text: string;
  textLight: string;
  textDark: string;
  rose: string;
  roseLight: string;
  background: string;
  surface: string;
  activity: string;
};

export interface AppTheme {
  colors: ColorTheme;
  fonts: {
    medium: "500";
    semibold: "600";
    bold: "700";
    extraBold: "800";
  };
  radius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
}

const sharedStyles = {
  fonts: {
    medium: "500",
    semibold: "600",
    bold: "700",
    extraBold: "800",
  } as const,
  radius: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
  },
};

const lightColors: ColorTheme = {
  primary: "#00C26F",
  primaryDark: "#00AC62",
  dark: "#3E3E3E",
  darkLight: "#E1E1E1",
  gray: "#e3e3e3",
  text: "#494949",
  textLight: "#7C7C7C",
  textDark: "#1D1D1D",
  rose: "#ef4444",
  roseLight: "#f87171",
  background: "#f0f2f5",
  surface: "#FFFFFF",
  activity: "#159cff",
};

const darkColors: ColorTheme = {
  primary: "#00C26F",
  primaryDark: "#00AC62",
  dark: "#FFFFFF",
  darkLight: "#333333",
  gray: "#262626",
  text: "#E4E6EB",
  textLight: "#B0B3B8",
  textDark: "#FFFFFF",
  rose: "#f87171",
  roseLight: "#ef4444",
  background: "#121212",
  surface: "#1C1C1E",
  activity: "#159cff",
};

export const themes = {
  light: { ...sharedStyles, colors: lightColors },
  dark: { ...sharedStyles, colors: darkColors },
};

export const theme = themes.light;
