export const theme = {
  colors: {
    // Cores principais - tema médico/saúde com azul como cor principal
    primary: "#1976D2", // Azul confiança
    primaryLight: "#42A5F5",
    primaryDark: "#0D47A1",

    // Cores secundárias
    secondary: "#2E7D32", // Verde médico
    secondaryLight: "#4CAF50",
    secondaryDark: "#1B5E20",

    // Cores de status
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    info: "#2196F3",

    // Cores neutras
    white: "#FFFFFF",
    black: "#000000",
    gray50: "#FAFAFA",
    gray100: "#F5F5F5",
    gray200: "#EEEEEE",
    gray300: "#E0E0E0",
    gray400: "#BDBDBD",
    gray500: "#9E9E9E",
    gray600: "#757575",
    gray700: "#616161",
    gray800: "#424242",
    gray900: "#212121",

    // Cores de fundo
    background: "#FAFAFA",
    surface: "#FFFFFF",
    surfaceVariant: "#F8F9FA",

    // Cores de texto
    textPrimary: "#212121",
    textSecondary: "#757575",
    textDisabled: "#BDBDBD",
    textOnPrimary: "#FFFFFF",
    textOnSecondary: "#FFFFFF",

    // Cores específicas para área da saúde
    medicalBlue: "#1565C0",
    medicalGreen: "#2E7D32",
    medicalRed: "#C62828",
    medicalOrange: "#EF6C00",

    // Gradientes
    gradients: {
      primary: ["#1976D2", "#42A5F5"],
      secondary: ["#2E7D32", "#4CAF50"],
      medical: ["#1976D2", "#2E7D32"],
      success: ["#4CAF50", "#8BC34A"],
      warning: ["#FF9800", "#FFC107"],
      error: ["#F44336", "#FF5722"],
      ocean: ["#1976D2", "#00BCD4"],
      sunset: ["#FF6B6B", "#FFE66D"],
      forest: ["#2E7D32", "#4CAF50"],
    },
  },

  typography: {
    fontFamily: {
      regular: "System",
      medium: "System",
      bold: "System",
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    fontWeight: {
      light: "300",
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },

  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
    xl: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 16,
    },
  },

  layout: {
    headerHeight: 60,
    tabBarHeight: 80,
    borderRadius: 12,
    padding: 16,
  },
};

export default theme;
