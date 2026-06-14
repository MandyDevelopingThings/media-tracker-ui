'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

export const ThemeToggle = () => {
  const { theme, toggleVariant } = useTheme();
  const isDark = theme.variant === 'dark';

  return (
    <button
      id="theme-toggle-btn"
      type="button"
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      onClick={toggleVariant}
      className={cn(
        'relative flex h-9 w-9 items-center justify-center rounded-lg',
        'border border-primary/20 bg-primary/5',
        'text-primary/70 transition-all duration-200',
        'hover:border-primary/40 hover:bg-primary/10 hover:text-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'active:scale-95',
      )}
    >
      <Sun
        className={cn(
          'absolute h-4 w-4 transition-all duration-300',
          isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100',
        )}
      />
      <Moon
        className={cn(
          'absolute h-4 w-4 transition-all duration-300',
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0',
        )}
      />
    </button>
  );
};
