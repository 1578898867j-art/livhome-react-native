// LIVHOME design tokens — ported 1:1 from the prototype's light theme.
// (The web build also had a dark theme; RN starter ships light only.)

export const colors = {
  bgPrimary: '#FBFBFB',
  bgSecondary: '#F2F2F1',
  surface: '#FFFFFF',
  surfaceWarm: '#F7F5F4',

  textPrimary: '#1A1A1A',
  textSecondary: '#616161',
  textTertiary: '#8A8A8C',
  textInverse: '#FFFFFF',

  brand: '#2382FF',
  brandSoft: '#E8F2FF',

  critical: '#E5352B',
  criticalSoft: '#FBEDEC',
  warning: '#9A7C3E',
  warningSoft: '#FBF6D8',
  success: '#10BE7E',
  successSoft: '#E7F7F0',
  info: '#5E8088',
  infoSoft: '#EBEFF0',
  preventive: '#6E6A8C',
  preventiveSoft: '#EDECF2',

  border: '#ECECEC',
  borderStrong: '#D9D9DC',
  btnPrimary: '#1A1A1A',
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24,
  pill: 999,
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 24,
};

// Shadows differ between iOS (shadow*) and Android (elevation).
export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
} as const;

export const font = {
  // System font; the web build used SF Pro / PingFang stacks which map to RN defaults.
  h1: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.6 },
  h2: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.4 },
  title: { fontSize: 17, fontWeight: '700' as const },
  body: { fontSize: 15, fontWeight: '500' as const },
  label: { fontSize: 14, fontWeight: '600' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
};
