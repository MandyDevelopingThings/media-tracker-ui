import type { ResolvedTheme, Theme, ThemeVariant } from '@/types';

export const THEME_STORAGE_KEY = 'mt-theme' as const;

export const DEFAULT_THEME: Theme = {
  id: 'neon-green',
  variant: 'dark',
} as const;

export const resolveTheme = (stored: string | null, systemPrefersDark: boolean): ResolvedTheme => {
  if (stored === 'neon-green-dark' || stored === 'neon-green-light') {
    return stored;
  }
  const variant: ThemeVariant = systemPrefersDark ? 'dark' : 'light';
  return `${DEFAULT_THEME.id}-${variant}`;
};
