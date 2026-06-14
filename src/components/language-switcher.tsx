'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setLocaleAction } from '@/actions/set-locale';
import { SUPPORTED_LOCALES } from '@/lib/i18n-config';
import type { Locale } from '@/lib/i18n-config';
import { cn } from '@/lib/utils';

type LanguageSwitcherProps = {
  currentLocale: Locale;
};

const LOCALE_LABELS: Record<Locale, string> = {
  'pt-BR': 'PT',
  'en-US': 'EN',
};

export const LanguageSwitcher = ({ currentLocale }: LanguageSwitcherProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (locale: Locale) => {
    if (locale === currentLocale) return;
    startTransition(async () => {
      await setLocaleAction(locale);
      router.refresh();
    });
  };

  return (
    <div
      role="group"
      aria-label="Select language"
      className="flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/5 p-1"
    >
      {SUPPORTED_LOCALES.map((locale) => {
        const isActive = locale === currentLocale;
        return (
          <button
            key={locale}
            id={`lang-${locale}`}
            type="button"
            disabled={isPending || isActive}
            aria-pressed={isActive}
            onClick={() => handleChange(locale)}
            className={cn(
              'relative flex h-7 w-8 items-center justify-center rounded-md',
              'text-xs font-semibold tracking-wide transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'disabled:cursor-not-allowed',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-primary/60 hover:bg-primary/10 hover:text-primary active:scale-95',
              isPending && !isActive && 'opacity-50',
            )}
          >
            {LOCALE_LABELS[locale]}
          </button>
        );
      })}
    </div>
  );
};
