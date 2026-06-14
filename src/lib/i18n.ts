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
} as const;

export type DictionaryNamespace = keyof typeof dictionaries;

export const getDictionary = async <N extends DictionaryNamespace>(
  namespace: N,
  locale: Locale,
) => {
  const mod = await dictionaries[namespace][locale]();
  return mod.default;
};
