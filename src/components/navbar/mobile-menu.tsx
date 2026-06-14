'use client';

import Link from 'next/link';
import { Menu, Settings, LogOut, User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { SearchBar } from './search-bar';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/i18n-config';

type MobileMenuDict = {
  searchPlaceholder: string;
  settings: string;
  login: string;
  register: string;
  myProfile: string;
  logout: string;
  openMenu: string;
};

type MobileMenuProps = {
  authenticated: boolean;
  currentLocale: Locale;
  dict: MobileMenuDict;
};

const sectionLinkClass = cn(
  'flex items-center gap-3 rounded-lg px-2 py-2.5',
  'text-sm text-foreground/80 transition-colors',
  'hover:bg-primary/10 hover:text-foreground',
);

export const MobileMenu = ({ authenticated, currentLocale, dict }: MobileMenuProps) => (
  <Sheet>
    <SheetTrigger
      id="navbar-mobile-menu-btn"
      aria-label={dict.openMenu}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-lg',
        'border border-primary/20 bg-primary/5',
        'text-primary/70 transition-all duration-200',
        'hover:border-primary/40 hover:bg-primary/10 hover:text-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'active:scale-95',
      )}
    >
      <Menu className="h-4 w-4" />
    </SheetTrigger>

    <SheetContent side="right" className="flex w-80 flex-col gap-0 p-0">
      <SheetHeader className="border-b border-border px-5 py-4">
        <SheetTitle className="text-left text-sm font-semibold tracking-tight">
          MediaTracker
        </SheetTitle>
      </SheetHeader>

      <div className="flex flex-col gap-5 overflow-y-auto px-5 py-6">
        <SearchBar placeholder={dict.searchPlaceholder} />

        <div className="h-px bg-border" />

        <div className="flex flex-col gap-1">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Preferências
          </p>
          <div className="flex items-center justify-between rounded-lg px-2 py-2">
            <span className="text-sm text-foreground/80">Idioma</span>
            <LanguageSwitcher currentLocale={currentLocale} />
          </div>
          <div className="flex items-center justify-between rounded-lg px-2 py-2">
            <span className="text-sm text-foreground/80">Tema</span>
            <ThemeToggle />
          </div>
          <Link href="/settings" className={sectionLinkClass}>
            <Settings className="h-4 w-4 shrink-0 text-muted-foreground" />
            {dict.settings}
          </Link>
        </div>

        <div className="h-px bg-border" />

        {authenticated ? (
          <div className="flex flex-col gap-1">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Conta
            </p>
            <Link href="/profile" className={sectionLinkClass}>
              <User className="h-4 w-4 shrink-0 text-muted-foreground" />
              {dict.myProfile}
            </Link>
            <button
              type="button"
              className={cn(
                sectionLinkClass,
                'text-destructive/80 hover:bg-destructive/10 hover:text-destructive',
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {dict.logout}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              className={cn(
                'flex h-10 items-center justify-center rounded-lg',
                'border border-border text-sm font-medium text-foreground',
                'transition-colors hover:bg-muted',
              )}
            >
              {dict.login}
            </Link>
            <Link
              href="/register"
              className={cn(
                'flex h-10 items-center justify-center rounded-lg',
                'bg-primary text-sm font-medium text-primary-foreground',
                'transition-colors hover:bg-primary/90',
              )}
            >
              {dict.register}
            </Link>
          </div>
        )}
      </div>
    </SheetContent>
  </Sheet>
);
