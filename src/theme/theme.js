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

const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));

const mixHex = (hex1, hex2, ratio = 0.5) => {
  const parse = (h) => {
    const clean = (h || '').replace('#', '');
    if (clean.length === 3) {
      return [
        parseInt(clean[0] + clean[0], 16),
        parseInt(clean[1] + clean[1], 16),
        parseInt(clean[2] + clean[2], 16),
      ];
    }
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
    ];
  };
  try {
    const [r1, g1, b1] = parse(hex1);
    const [r2, g2, b2] = parse(hex2);
    const hex = (n) => clamp(n).toString(16).padStart(2, '0');
    return `#${hex(r1 + (r2 - r1) * ratio)}${hex(g1 + (g2 - g1) * ratio)}${hex(b1 + (b2 - b1) * ratio)}`;
  } catch (e) {
    return hex1;
  }
};

export const applyBrandColors = (primary = '#2dd4a8', secondary = null) => {
  colors.mint = primary;
  colors.mintLight = mixHex(primary, '#ffffff', 0.25);
  colors.mintLighter = mixHex(primary, '#ffffff', 0.45);
  colors.mintDark = mixHex(primary, '#000000', 0.15);
  colors.glow = mixHex(primary, '#ffffff', 0.55);
  colors.glowLight = mixHex(primary, '#ffffff', 0.7);
  colors.glowDark = mixHex(primary, '#000000', 0.1);
  colors.success = primary;
  gradients.primary = [primary, colors.glow];
  if (secondary) {
    colors.base = secondary;
    colors.textInverse = secondary;
    gradients.hero = [secondary, '#1a2d3d', primary];
  }
};

export const statusColors = {
  pending: {
    bg: 'rgba(251, 191, 36, 0.2)',
    text: '#fbbf24',
    border: '#fbbf24',
  },
  assigned: {
    bg: 'rgba(59, 130, 246, 0.2)',
    text: '#60a5fa',
    border: '#3b82f6',
  },
  accepted: {
    bg: 'rgba(45, 212, 168, 0.2)',
    text: '#2dd4a8',
    border: '#2dd4a8',
  },
  picked_up: {
    bg: 'rgba(139, 92, 246, 0.2)',
    text: '#a78bfa',
    border: '#8b5cf6',
  },
  in_transit: {
    bg: 'rgba(99, 102, 241, 0.2)',
    text: '#818cf8',
    border: '#6366f1',
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
