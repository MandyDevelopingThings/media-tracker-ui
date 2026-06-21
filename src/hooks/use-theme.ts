'use client';

import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_THEME, THEME_STORAGE_KEY } from '@/lib/theme';
import type { ResolvedTheme, Theme, ThemeId, ThemeVariant } from '@/types';

type UseThemeReturn = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleVariant: () => void;
};

const applyTheme = (resolved: ResolvedTheme): void => {
  const root = document.documentElement;
  root.setAttribute('data-theme', resolved);

  if (resolved.endsWith('-dark')) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

const setStoredTheme = (resolved: ResolvedTheme): void => {
  try {
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    document.cookie = `${THEME_STORAGE_KEY}=${resolved}; path=/; max-age=${maxAge}; samesite=lax`;
  } catch {
    // ignore write errors
  }
};

const readStoredTheme = (): ResolvedTheme | null => {
  try {
    const match = document.cookie.match(new RegExp(`(^| )${THEME_STORAGE_KEY}=([^;]+)`));
    if (match) {
      const stored = match[2];
      const parts = stored.split('-');
      const variant = parts.pop();
      if (variant === 'dark' || variant === 'light') {
        return stored as ResolvedTheme;
      }
    }
  } catch {
    // document.cookie not available
  }
  return null;
};

const getSystemVariant = (): ThemeVariant =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const parseResolved = (resolved: ResolvedTheme): Theme => {
  const parts = resolved.split('-');
  const variant = parts.pop() as ThemeVariant;
  const id = parts.join('-') as ThemeId;
  return { id, variant };
};

export const useTheme = (): UseThemeReturn => {
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') {
      return `${DEFAULT_THEME.id}-${DEFAULT_THEME.variant}`;
    }
    const stored = readStoredTheme();
    if (stored) return stored;
    return `${DEFAULT_THEME.id}-${getSystemVariant()}`;
  });

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme): void => {
    const resolved: ResolvedTheme = `${next.id}-${next.variant}`;
    setStoredTheme(resolved);
    setResolvedTheme(resolved);
  }, []);

  const toggleVariant = useCallback((): void => {
    setResolvedTheme((prev) => {
      const current = parseResolved(prev);
      const next: Theme = {
        id: current.id,
        variant: current.variant === 'dark' ? 'light' : 'dark',
      };
      const resolved: ResolvedTheme = `${next.id}-${next.variant}`;
      setStoredTheme(resolved);
      return resolved;
    });
  }, []);

  return { theme: parseResolved(resolvedTheme), resolvedTheme, setTheme, toggleVariant };
};
