'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

type AuthButtonsProps = {
  dict: {
    login: string;
    register: string;
  };
};

export const AuthButtons = ({ dict }: AuthButtonsProps) => (
  <div className="flex items-center gap-2">
    <Link
      href="/login"
      id="navbar-login-btn"
      className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
    >
      {dict.login}
    </Link>
    <Link
      href="/register"
      id="navbar-register-btn"
      className={cn(buttonVariants({ size: 'sm' }))}
    >
      {dict.register}
    </Link>
  </div>
);
