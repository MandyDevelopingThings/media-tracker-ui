import type { ResolvedTheme, Theme, ThemeVariant, ThemeId } from '@/types';

export const THEME_STORAGE_KEY = 'mt-theme' as const;

export const DEFAULT_THEME: Theme = {
  id: 'neon-green',
  variant: 'dark',
} as const;

export const THEME_IDS: ThemeId[] = ['neon-green', 'synthwave'];

export const resolveTheme = (stored: string | null, systemPrefersDark: boolean): ResolvedTheme => {
  if (stored) {
    const parts = stored.split('-');
    const variant = parts.pop() as ThemeVariant;
    const id = parts.join('-') as ThemeId;
    if (THEME_IDS.includes(id) && (variant === 'dark' || variant === 'light')) {
      return stored as ResolvedTheme;
    }
  }
  const variant: ThemeVariant = systemPrefersDark ? 'dark' : 'light';
  return `${DEFAULT_THEME.id}-${variant}`;
};
