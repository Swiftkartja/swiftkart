// SwiftKart color palette

// Primary brand colors
export const PRIMARY = '#10b981'; // SwiftKart turquoise-green
export const PRIMARY_DARK = '#0d9669';
export const PRIMARY_LIGHT = '#34d399';

// Secondary colors
export const SECONDARY = '#0ea5e9'; // Blue
export const SECONDARY_DARK = '#0284c7';
export const SECONDARY_LIGHT = '#38bdf8';

// Accent colors
export const ACCENT = '#f59e0b'; // Amber
export const ACCENT_DARK = '#d97706';
export const ACCENT_LIGHT = '#fbbf24';

// Semantic colors
export const SUCCESS = '#10b981'; // Green
export const ERROR = '#ef4444'; // Red
export const WARNING = '#f59e0b'; // Amber
export const INFO = '#3b82f6'; // Blue

// Neutral colors
export const BLACK = '#1f2937';
export const WHITE = '#ffffff';
export const GRAY_50 = '#f9fafb';
export const GRAY_100 = '#f3f4f6';
export const GRAY_200 = '#e5e7eb';
export const GRAY_300 = '#d1d5db';
export const GRAY_400 = '#9ca3af';
export const GRAY_500 = '#6b7280';
export const GRAY_600 = '#4b5563';
export const GRAY_700 = '#374151';
export const GRAY_800 = '#1f2937';
export const GRAY_900 = '#111827';

// Theme colors - Light
export const LIGHT_THEME = {
  primary: PRIMARY,
  secondary: SECONDARY,
  background: GRAY_50,
  card: WHITE,
  text: GRAY_800,
  border: GRAY_200,
  notification: ERROR,
  muted: GRAY_500,
  subtle: GRAY_100,
  error: ERROR,
  success: SUCCESS,
  warning: WARNING,
  info: INFO,
};

// Theme colors - Dark
export const DARK_THEME = {
  primary: PRIMARY,
  secondary: SECONDARY,
  background: GRAY_900,
  card: GRAY_800,
  text: GRAY_50,
  border: GRAY_700,
  notification: ERROR,
  muted: GRAY_400,
  subtle: GRAY_700,
  error: '#f87171', // Lighter red for dark mode
  success: '#34d399', // Lighter green for dark mode
  warning: '#fbbf24', // Lighter amber for dark mode
  info: '#60a5fa', // Lighter blue for dark mode
};

export default {
  PRIMARY,
  PRIMARY_DARK,
  PRIMARY_LIGHT,
  SECONDARY,
  SECONDARY_DARK,
  SECONDARY_LIGHT,
  ACCENT,
  ACCENT_DARK,
  ACCENT_LIGHT,
  SUCCESS,
  ERROR,
  WARNING,
  INFO,
  BLACK,
  WHITE,
  GRAY_50,
  GRAY_100,
  GRAY_200,
  GRAY_300,
  GRAY_400,
  GRAY_500,
  GRAY_600,
  GRAY_700,
  GRAY_800,
  GRAY_900,
  LIGHT_THEME,
  DARK_THEME,
};