export const FontFamily = {
  regular: "Tuffy_400Regular",
  bold: "Tuffy_700Bold",
} as const;

export const FontSizes = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  xxl: 32,
} as const;

export const FontStyle = {
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.xxl,
  },
  h2: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.xl,
  },
  h3: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.lg,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.md,
  },
  button: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.md,
  },
} as const;
