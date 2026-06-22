import Image from 'next/image';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProfileDto } from '@/features/accounts/types/profile';

const API_BASE_URL = process.env.API_BASE_URL ?? '';

type ProfileHeroProps = {
  profile: ProfileDto;
  isOwner: boolean;
  dict: {
    editProfile: string;
  };
};

const AvatarFallback = ({ username }: { username: string }) => {
  const initials = username.slice(0, 2).toUpperCase();
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
      <span className="text-2xl sm:text-3xl font-bold">{initials}</span>
    </div>
  );
};

export const ProfileHero = ({ profile, isOwner, dict }: ProfileHeroProps) => {
  const avatarSrc = profile.avatarUrl ? `${API_BASE_URL}${profile.avatarUrl}` : null;
  const coverSrc = profile.coverUrl ? `${API_BASE_URL}${profile.coverUrl}` : null;
  const displayName = profile.displayName ?? profile.username;

  return (
    <div className="relative h-80 w-full overflow-hidden sm:h-96">
      {coverSrc ? (
        <Image
          src={coverSrc}
          alt={`${displayName} cover`}
          fill
          className="object-cover"
          priority
          unoptimized
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-primary/20 via-muted to-background" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />

      <div className="absolute inset-x-0 bottom-0">
        <div className="bg-background/40 backdrop-blur-sm py-2 sm:py-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-5 min-w-0">
              <div
                className={cn(
                  'relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-full',
                  'ring-4 ring-primary/60 shadow-lg',
                )}
              >
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt={displayName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <AvatarFallback username={profile.username} />
                )}
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-foreground drop-shadow-sm sm:text-3xl">
                  {displayName}
                </h1>
                <p className="text-base font-semibold text-primary drop-shadow-sm">
                  @{profile.username}
                </p>
                {profile.bio && (
                  <p className="mt-1 text-base font-medium text-foreground/90 italic line-clamp-2 drop-shadow-sm">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>

            {isOwner && (
              <Link
                href="/settings/profile"
                className={cn(
                  'inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium',
                  'border border-border/60 bg-background/60 text-foreground backdrop-blur-sm',
                  'transition-colors duration-200 hover:border-primary/40 hover:bg-accent/80 hover:text-accent-foreground',
                )}
              >
                <Pencil className="h-3.5 w-3.5" />
                {dict.editProfile}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
