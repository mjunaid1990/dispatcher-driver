// Neon Mint Design System for React Native

export const colors = {
  // Base colors
  base: '#0d1b2a',
  baseLight: '#1a2d3d',
  baseLighter: '#263f52',
  
  // Mint colors
  mint: '#2dd4a8',
  mintLight: '#4ce0ba',
  mintLighter: '#6becce',
  mintDark: '#24b893',
  
  // Glow colors
  glow: '#73ffb8',
  glowLight: '#8affc6',
  glowDark: '#5cd49a',
  
  // Semantic tokens
  surface: '#1a2d3d',
  surfaceElevated: '#263f52',
  surfaceCard: '#1e3244',
  
  success: '#2dd4a8',
  warning: '#fbbf24',
  error: '#ef4444',
  info: '#60a5fa',
  
  // Text colors
  text: '#ffffff',
  textSecondary: '#9ca3af',
  textTertiary: '#6b7280',
  textInverse: '#0d1b2a',
  
  // Border colors
  border: '#263f52',
  borderLight: '#374151',
};

export const spacing = {
  // 4px grid system
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '7xl': 80,
  '8xl': 96,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

export const elevation = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 16,
  },
  glow: {
    shadowColor: '#2dd4a8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  glowStrong: {
    shadowColor: '#2dd4a8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 15,
  },
};

export const typography = {
  // Font families (will use system fonts, can be customized with custom fonts)
  fontFamily: {
    display: 'System', // Can be replaced with Space Grotesk
    body: 'System', // Can be replaced with Inter
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 22,
    '3xl': 24,
    '4xl': 30,
    '5xl': 36,
    '6xl': 48,
  },
  
  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const gradients = {
  primary: ['#2dd4a8', '#73ffb8'],
  surface: ['#1a2d3d', '#0d1b2a'],
  hero: ['#0d1b2a', '#1a2d3d', '#2dd4a8'],
};

export const statusColors = {
  pending: {
    bg: 'rgba(107, 114, 128, 0.2)',
    text: '#9ca3af',
    border: '#6b7280',
  },
  assigned: {
    bg: 'rgba(59, 130, 246, 0.2)',
    text: '#60a5fa',
    border: '#3b82f6',
  },
  in_transit: {
    bg: 'rgba(45, 212, 168, 0.2)',
    text: '#2dd4a8',
    border: '#2dd4a8',
  },
  arrived: {
    bg: 'rgba(139, 92, 246, 0.2)',
    text: '#a78bfa',
    border: '#8b5cf6',
  },
  delivered: {
    bg: 'rgba(45, 212, 168, 0.2)',
    text: '#2dd4a8',
    border: '#2dd4a8',
  },
  failed: {
    bg: 'rgba(239, 68, 68, 0.2)',
    text: '#ef4444',
    border: '#ef4444',
  },
  cancelled: {
    bg: 'rgba(107, 114, 128, 0.2)',
    text: '#9ca3af',
    border: '#6b7280',
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  elevation,
  typography,
  gradients,
  statusColors,
};
