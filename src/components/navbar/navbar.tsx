import { cookies } from 'next/headers';
import Link from 'next/link';
import { Settings, Clapperboard } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n';
import { isValidLocale, DEFAULT_LOCALE } from '@/lib/i18n-config';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { SiteNavMenu } from './site-nav-menu';
import { SearchBar } from './search-bar';
import { AuthButtons } from './auth-buttons';
import { UserMenu } from './user-menu';
import { MobileSearch } from './mobile-search';
import { MobileMenu } from './mobile-menu';
import { cn } from '@/lib/utils';

export const Navbar = async () => {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const [authenticated, dict] = await Promise.all([
    isAuthenticated(),
    getDictionary('common', locale),
  ]);

  const nav = dict.nav;

  const iconButtonClass = cn(
    'flex h-9 w-9 items-center justify-center rounded-lg',
    'border border-primary/20 bg-primary/5',
    'text-primary/70 transition-all duration-200',
    'hover:border-primary/40 hover:bg-primary/10 hover:text-primary',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'active:scale-95',
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <nav
        aria-label="Navegação principal"
        className="flex h-16 w-full items-center gap-3 px-4 sm:px-6"
      >
        <div className="flex shrink-0 items-center gap-1.5">
          <SiteNavMenu />
          <Link
            href="/"
            id="navbar-logo"
            className="group flex items-center gap-2"
          >
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg',
                'border border-primary/20 bg-primary/10',
                'transition-all duration-200',
                'group-hover:border-primary/40 group-hover:bg-primary/20',
              )}
            >
              <Clapperboard className="h-4 w-4 text-primary" />
            </div>
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-base font-bold tracking-tight text-transparent">
              MediaTracker
            </span>
          </Link>
        </div>

        <div className="flex-1" />

        <div className="hidden shrink-0 items-center gap-1 md:flex">
          <SearchBar
            placeholder={nav.searchPlaceholder}
            className="w-80 lg:w-96"
          />

          <div className="mx-1.5 h-5 w-px bg-border" />

          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle />
          <Link
            href="/settings"
            id="navbar-settings-btn"
            aria-label={nav.settings}
            className={iconButtonClass}
          >
            <Settings className="h-4 w-4" />
          </Link>

          <div className="mx-1.5 h-5 w-px bg-border" />

          {authenticated ? (
            <UserMenu dict={{ myProfile: nav.myProfile, logout: nav.logout }} />
          ) : (
            <AuthButtons dict={{ login: nav.login, register: nav.register }} />
          )}
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <MobileSearch
            placeholder={nav.searchPlaceholder}
            searchLabel={nav.openSearch}
          />
          <MobileMenu
            authenticated={authenticated}
            currentLocale={locale}
            dict={{
              searchPlaceholder: nav.searchPlaceholder,
              settings: nav.settings,
              login: nav.login,
              register: nav.register,
              myProfile: nav.myProfile,
              logout: nav.logout,
              openMenu: nav.openMenu,
            }}
          />
        </div>
      </nav>
    </header>
  );
};
