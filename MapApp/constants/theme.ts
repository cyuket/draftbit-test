// Token set for light mode — every colour used across the app is sourced from here.
export const lightTheme = {
  background: '#FFFFFF',
  surface: '#F3F4F6',
  surfaceElevated: '#FFFFFF',
  text: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  countBadgeBg: 'rgba(255,255,255,0.92)',
  countBadgeText: '#374151',
  coordChipBg: '#F3F4F6',
  coordValue: '#374151',
  backButtonBg: 'rgba(255,255,255,0.9)',
  backButtonText: '#1F2937',
  cardBg: '#FFFFFF',
  statusBar: 'dark' as const,
};

// Token set for dark mode — mirrors lightTheme structure with darker values.
export const darkTheme = {
  background: '#0F172A',
  surface: '#1E293B',
  surfaceElevated: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textMuted: '#64748B',
  border: '#334155',
  countBadgeBg: 'rgba(15,23,42,0.92)',
  countBadgeText: '#F1F5F9',
  coordChipBg: '#1E293B',
  coordValue: '#E2E8F0',
  backButtonBg: 'rgba(15,23,42,0.85)',
  backButtonText: '#F1F5F9',
  cardBg: '#1E293B',
  statusBar: 'light' as const,
};

// Derived type so components can type-check theme props without importing the raw objects.
export type Theme = Omit<typeof lightTheme, 'statusBar'> & {
  statusBar: 'dark' | 'light';
};

// Maps location category strings to accent colours used by pins and badges.
// The "default" key is the fallback for any unrecognised category.
export const CATEGORY_COLORS: Record<string, string> = {
  museum: '#8B5CF6',
  park: '#10B981',
  restaurant: '#F59E0B',
  landmark: '#3B82F6',
  market: '#EC4899',
  beach: '#06B6D4',
  default: '#6366F1',
};

export   const CATEGORIES = [
  
    "museum",
    "park",
    "restaurant",
    "landmark",
    "market",
    "beach",
  ];