'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type ProfileNavTabsProps = {
  username: string;
  dict: {
    overview: string;
    list: string;
    reviews: string;
  };
};

export const ProfileNavTabs = ({ username, dict }: ProfileNavTabsProps) => {
  const pathname = usePathname();

  const tabs = [
    { label: dict.overview, href: `/profile/${username}` },
    { label: dict.list, href: `/profile/${username}/list` },
    { label: dict.reviews, href: `/profile/${username}/reviews` },
  ];

  return (
    <nav
      aria-label="Profile navigation"
      className="border-b border-border"
    >
      <div className="flex gap-0">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'relative px-5 py-3 text-sm font-medium transition-colors duration-200',
                'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:transition-all after:duration-200',
                isActive
                  ? 'text-primary after:bg-primary'
                  : 'text-muted-foreground hover:text-foreground after:bg-transparent hover:after:bg-border',
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
