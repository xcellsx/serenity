/**
 * Serenity design tokens — derived from the Figma wireframes.
 * Warm, calming palette: cloudy off-white backgrounds, near-black serif
 * headlines, a coral-red accent, and the signature peach→red mood "blob".
 */

import '@/global.css';

import { Platform } from 'react-native';

/** Core brand palette (shared across light/dark). */
export const Palette = {
  coral: '#AE2217',
  coralSoft: '#D98C6A',
  peach: '#F2C9A0',
  cream: '#F6E4CC',
  deepRed: '#8B1A12',
  ink: '#121417',
  inkSoft: '#6B5F5C',
  cloudLight: '#FBF4F2',
  cloudPink: '#F3DAD6',
  cloudDark: '#1C1517',
} as const;

/**
 * Theme colors keyed by mode. Keeps the keys the Expo template components
 * rely on (`text`, `background`, `textSecondary`, ...) and adds Serenity tokens.
 */
/** Stronger text when High Contrast is enabled in Profile. */
export const HighContrastColors = {
  light: {
    text: '#000000',
    textSecondary: '#1A1210',
    tabInactive: '#000000',
    border: 'rgba(0,0,0,0.28)',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#F6F5F2',
    tabInactive: '#FFFFFF',
    border: 'rgba(255,255,255,0.45)',
  },
} as const;

export const Colors = {
  light: {
    text: Palette.ink,
    textSecondary: Palette.inkSoft,
    accent: Palette.coral,
    background: Palette.cloudLight,
    backgroundElement: 'rgba(255,255,255,0.65)',
    backgroundSelected: 'rgba(255,255,255,0.9)',
    border: 'rgba(190,58,43,0.12)',
    tabActive: Palette.coral,
    tabInactive: Palette.ink,
  },
  dark: {
    text: '#F6F5F2',
    textSecondary: '#B9A9A4',
    accent: '#E63F32',
    background: Palette.cloudDark,
    backgroundElement: 'rgba(255,255,255,0.08)',
    backgroundSelected: 'rgba(255,255,255,0.16)',
    border: 'rgba(255,255,255,0.14)',
    tabActive: '#E63F32',
    tabInactive: '#F6F5F2',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/** Cloudy background gradient stops per mode (top-left → bottom-right). */
export const BackgroundGradient = {
  light: ['#F7E4E0', '#FBF4F2', '#F3DAD6'] as const,
  dark: ['#241A1C', '#1C1517', '#2A1D1F'] as const,
};

/** The mood "blob" radial-ish gradient (cream → peach → deep red). */
export const BlobGradient = ['#F6E4CC', '#EDB489', '#C0392B', '#8B1A12'] as const;

export const Fonts = {
  /** Prata — serif headlines (single weight). */
  serif: 'Prata_400Regular',
  serifBold: 'Prata_400Regular',
  /** Parkinsans — sans body + UI text. */
  sans: 'Parkinsans_400Regular',
  sansMedium: 'Parkinsans_500Medium',
  sansBold: 'Parkinsans_700Bold',
  mono: Platform.select({ ios: 'ui-monospace', default: 'monospace' }) as string,
};

export const FontSizes = {
  display: 34,
  title: 28,
  heading: 22,
  body: 16,
  label: 14,
  caption: 13,
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radii = {
  sm: 12,
  md: 20,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
