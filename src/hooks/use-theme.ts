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

const readStoredTheme = (): ResolvedTheme | null => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'neon-green-dark' || stored === 'neon-green-light') {
      return stored;
    }
  } catch {
    // localStorage not available (e.g. SSR or privacy mode)
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
    try {
      localStorage.setItem(THEME_STORAGE_KEY, resolved);
    } catch {
      // ignore write errors
    }
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
      try {
        localStorage.setItem(THEME_STORAGE_KEY, resolved);
      } catch {
        // ignore write errors
      }
      return resolved;
    });
  }, []);

  return { theme: parseResolved(resolvedTheme), resolvedTheme, setTheme, toggleVariant };
};
