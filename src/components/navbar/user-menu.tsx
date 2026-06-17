'use client';

import { ChevronDown, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { startTransition } from 'react';
import { logoutAction } from '@/features/accounts/actions/logout';
import type { CurrentUserDto } from '@/features/accounts/types';

type UserMenuProps = {
  currentUser?: CurrentUserDto;
  dict: {
    myProfile: string;
    logout: string;
  };
};

export const UserMenu = ({ currentUser, dict }: UserMenuProps) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        id="navbar-user-menu-btn"
        className={cn(
          'group flex items-center gap-1.5 rounded-lg px-3 py-2',
          'border border-primary/20 bg-primary/5',
          'text-sm font-medium text-primary/80 transition-all duration-200',
          'hover:border-primary/40 hover:bg-primary/10 hover:text-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'data-[popup-open]:border-primary/40 data-[popup-open]:bg-primary/10 data-[popup-open]:text-primary',
          'active:scale-95',
        )}
      >
        <span className="max-w-[120px] truncate">
          {currentUser?.userName || dict.myProfile}
        </span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-200',
            'group-data-[popup-open]:rotate-180',
          )}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuItem
          id="navbar-profile-item"
          className="cursor-pointer gap-2"
          onClick={() => router.push(currentUser ? `/profile/${currentUser.userName}` : '/profile')}
        >
          <User className="h-4 w-4" />
          <span className="max-w-[150px] truncate">
            {dict.myProfile}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          id="navbar-logout-item"
          variant="destructive"
          className="cursor-pointer gap-2"
          onClick={() => startTransition(() => {
            void logoutAction();
          })}
        >
          <LogOut className="h-4 w-4" />
          {dict.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
