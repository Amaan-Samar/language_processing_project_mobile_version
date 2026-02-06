// utils/themes.ts
export const COLORS = {
  // Primary Colors
  PRIMARY: {
    main: '#3B82F6',
    light: '#93C5FD',
    dark: '#1D4ED8',
    contrast: '#FFFFFF',
  },
  
  SECONDARY: {
    main: '#10B981',
    light: '#A7F3D0',
    dark: '#047857',
    contrast: '#FFFFFF',
  },
  
  // Background Colors
  BACKGROUND: {
    primary: '#F9FAFB',
    secondary: '#FFFFFF',
    tertiary: '#F3F4F6',
    modal: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Text Colors
  TEXT: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    disabled: '#D1D5DB',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  },
  
  // Border Colors
  BORDER: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    strong: '#9CA3AF',
    focus: '#3B82F6',
  },
  
  // State Colors
  STATE: {
    hover: '#F3F4F6',
    active: '#E5E7EB',
    disabled: '#F9FAFB',
    selected: '#EFF6FF',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 24,
  full: 9999,
};

export const TYPOGRAPHY = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Language-specific themes
export const LANGUAGE_THEMES: Record<string, { primary: string, secondary: string, accent: string }> = {
  chinese: {
    primary: '#DC2626', // Chinese red
    secondary: '#059669', // Jade green
    accent: '#D97706', // Gold
  },
  japanese: {
    primary: '#B91C1C', // Japanese red
    secondary: '#1E40AF', // Navy blue
    accent: '#7C3AED', // Purple
  },
  korean: {
    primary: '#2563EB', // Korean blue
    secondary: '#BE185D', // Pink
    accent: '#059669', // Green
  },
  spanish: {
    primary: '#F59E0B', // Yellow
    secondary: '#DC2626', // Red
    accent: '#1D4ED8', // Blue
  },
  french: {
    primary: '#1D4ED8', // Blue
    secondary: '#EC4899', // Pink
    accent: '#F59E0B', // Yellow
  },
  default: {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#8B5CF6',
  },
};

export function getThemeForLanguage(language: string) {
  return LANGUAGE_THEMES[language] || LANGUAGE_THEMES.default;
}

// Helper function to convert theme colors to Tailwind classes
export function getColorClasses(theme: any) {
  return {
    primary: {
      bg: `bg-[${theme.primary}]`,
      text: `text-[${theme.primary}]`,
      border: `border-[${theme.primary}]`,
    },
    secondary: {
      bg: `bg-[${theme.secondary}]`,
      text: `text-[${theme.secondary}]`,
      border: `border-[${theme.secondary}]`,
    },
  };
}