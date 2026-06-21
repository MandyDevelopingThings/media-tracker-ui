export type ThemeVariant = 'dark' | 'light';

export type ThemeId = 'neon-green' | 'synthwave';

export type Theme = Readonly<{
  id: ThemeId;
  variant: ThemeVariant;
}>;

export type ResolvedTheme = `${ThemeId}-${ThemeVariant}`;
