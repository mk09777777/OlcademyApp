import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  // Primary Colors
  primary: '#FF6B6B',
  primaryLight: '#FF8787',
  primaryDark: '#FA5252',

  // Secondary Colors
  secondary: '#4ECDC4',
  secondaryLight: '#63E6E2',
  secondaryDark: '#45B7B0',

  // Accent Colors
  accent: '#FFE66D',
  accentLight: '#FFF3A3',
  accentDark: '#FFD93D',

  // Status Colors
  success: '#51CF66',
  warning: '#FFB020',
  error: '#FF6B6B',
  info: '#4DABF7',

  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',

  // Background Colors
  background: {
    default: '#F8F9FA',
    paper: '#FFFFFF',
    dark: '#212529',
  },

  // Text Colors
  text: {
    primary: '#212529',
    secondary: '#6C757D',
    disabled: '#ADB5BD',
    inverse: '#FFFFFF',
  },

  // Border Colors
  border: {
    light: '#E9ECEF',
    default: '#DEE2E6',
    dark: '#CED4DA',
  },

  // Gradient Colors
  gradient: {
    primary: ['#FF6B6B', '#FA5252'],
    secondary: ['#4ECDC4', '#45B7B0'],
    accent: ['#FFE66D', '#FFD93D'],
  },

  // Overlay Colors
  overlay: {
    light: 'rgba(255, 255, 255, 0.8)',
    dark: 'rgba(0, 0, 0, 0.6)',
  },

  // Social Media Colors
  social: {
    facebook: '#1877F2',
    google: '#EA4335',
    apple: '#000000',
  },
};

export const FONTS = {
  // Font Families
  regular: {
    fontFamily: 'System',
    fontWeight: '400',
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500',
  },
  semiBold: {
    fontFamily: 'System',
    fontWeight: '600',
  },
  bold: {
    fontFamily: 'System',
    fontWeight: '700',
  },

  // Font Sizes
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    '2xl': 28,
    '3xl': 32,
    '4xl': 40,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
  },
};

export const SPACING = {
  // Base Spacing
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,

  // Screen Padding
  screen: {
    horizontal: 16,
    vertical: 24,
  },

  // Section Spacing
  section: {
    padding: 24,
    margin: 24,
  },

  // Component Spacing
  component: {
    padding: 16,
    margin: 16,
    gap: 8,
  },
};

export const SHADOWS = {
  // iOS Shadows
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.46,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6.68,
    elevation: 8,
  },
};

export const BORDER_RADIUS = {
  // Border Radius
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  '2xl': 32,
  '3xl': 40,
  round: 999,
};

export const LAYOUT = {
  // Screen Dimensions
  window: {
    width,
    height,
  },

  // Aspect Ratios
  aspectRatio: {
    square: 1,
    portrait: 4 / 3,
    landscape: 16 / 9,
  },

  // Container Widths
  container: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },

  // Z-Index
  zIndex: {
    base: 0,
    drawer: 40,
    modal: 50,
    toast: 60,
  },
};

export const ANIMATIONS = {
  // Durations (ms)
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },

  // Easings
  easing: {
    easeInOut: 'ease-in-out',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    linear: 'linear',
  },
};

export const CARD_SIZES = {
  small: {
    width: width * 0.4,
    height: width * 0.3,
  },
  medium: {
    width: width * 0.6,
    height: width * 0.4,
  },
  large: {
    width: width * 0.8,
    height: width * 0.5,
  },
  full: {
    width: width - SPACING.lg * 2,
    height: width * 0.6,
  },
};

export const COMMON_STYLES = {
  // Flex Styles
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Container Styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
    padding: SPACING.screen.horizontal,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },

  // Card Styles
  card: {
    backgroundColor: COLORS.background.paper,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.component.padding,
    ...SHADOWS.small,
  },
  cardElevated: {
    backgroundColor: COLORS.background.paper,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.component.padding,
    ...SHADOWS.medium,
  },

  // Input Styles
  input: {
    height: 48,
    backgroundColor: COLORS.background.paper,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border.default,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    ...SHADOWS.small,
  },

  // Button Styles
  button: {
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
  },
  buttonText: {
    ...FONTS.medium,
    fontSize: FONTS.sizes.md,
    color: COLORS.white,
  },

  // Image Styles
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  // List Styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
};

export default {
  COLORS,
  FONTS,
  SPACING,
  SHADOWS,
  BORDER_RADIUS,
  LAYOUT,
  ANIMATIONS,
  CARD_SIZES,
  COMMON_STYLES,
}; 