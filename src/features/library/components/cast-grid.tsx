import Image from 'next/image';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CastMemberDto } from '../types';

const TMDB_PROFILE_BASE = 'https://image.tmdb.org/t/p/w185';

type CastGridProps = {
  cast: readonly CastMemberDto[];
  label: string;
};

const CastAvatar = ({ member }: { member: CastMemberDto }) => (
  <div className="flex flex-col items-center gap-2 text-center group">
    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-muted/50 ring-2 ring-border/50 transition-all duration-200 group-hover:ring-primary/50 group-hover:scale-105 shrink-0">
      {member.profilePath ? (
        <Image
          src={`${TMDB_PROFILE_BASE}${member.profilePath}`}
          alt={member.name}
          fill
          sizes="56px"
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <User className="w-6 h-6" />
        </div>
      )}
    </div>
    <div className="w-full min-w-0">
      <p className={cn(
        'text-xs font-medium text-foreground leading-tight',
        'truncate',
      )}>
        {member.name}
      </p>
      <p className="text-[11px] text-muted-foreground leading-tight truncate mt-0.5">
        {member.character}
      </p>
    </div>
  </div>
);

export const CastGrid = ({ cast, label }: CastGridProps) => {
  if (!cast.length) return null;

  return (
    <section aria-label={label}>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        {label}
      </h2>
      <div className="grid grid-cols-4 gap-x-3 gap-y-4">
        {cast.slice(0, 8).map((member) => (
          <CastAvatar key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
};
