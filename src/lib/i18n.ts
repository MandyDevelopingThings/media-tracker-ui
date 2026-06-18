import 'server-only';

import type { Locale } from '@/lib/i18n-config';

const dictionaries = {
  common: {
    'pt-BR': () => import('@/dictionaries/common/pt-BR.json'),
    'en-US': () => import('@/dictionaries/common/en-US.json'),
  },
  accounts: {
    'pt-BR': () => import('@/dictionaries/accounts/pt-BR.json'),
    'en-US': () => import('@/dictionaries/accounts/en-US.json'),
  },
  library: {
    'pt-BR': () => import('@/dictionaries/library/pt-BR.json'),
    'en-US': () => import('@/dictionaries/library/en-US.json'),
  },
  journal: {
    'pt-BR': () => import('@/dictionaries/journal/pt-BR.json'),
    'en-US': () => import('@/dictionaries/journal/en-US.json'),
  },
} as const;

export type DictionaryNamespace = keyof typeof dictionaries;

export type Dictionary<N extends DictionaryNamespace> = Awaited<
  ReturnType<(typeof dictionaries)[N]['pt-BR']>
>['default'];

export const getDictionary = async <N extends DictionaryNamespace>(
  namespace: N,
  locale: Locale,
): Promise<Dictionary<N>> => {
  const mod = await dictionaries[namespace][locale]();
  return mod.default as Dictionary<N>;
};
