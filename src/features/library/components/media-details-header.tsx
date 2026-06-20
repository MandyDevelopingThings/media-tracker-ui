import Image from 'next/image';
import { Calendar, Clock, Clapperboard, Tv2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MediaBackdrop } from './media-backdrop';
import { CastGrid } from './cast-grid';
import { SeasonTabs } from './season-tabs';
import { AddSessionDialog } from '@/features/journal/components/add-session-dialog';
import { ToggleFavoriteButton } from './toggle-favorite-button';
import type { MediaDetailsDto } from '../types';
import type { Dictionary } from '@/lib/i18n';

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w342';

type DetailsDictionary = Dictionary<'library'>['details'];

type MediaDetailsHeaderProps = {
  media: MediaDetailsDto;
  isAuthenticated: boolean;
  dict: DetailsDictionary & {
    favorite: { add: string; remove: string };
  };
  watchedEpisodes?: Record<number, number[]>;
  isFavorite?: boolean;
};

const GenrePill = ({ genre }: { genre: string }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5',
      'text-xs font-medium',
      'bg-primary/10 text-primary border border-primary/20',
    )}
  >
    {genre}
  </span>
);

const MetaItem = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
    {icon}
    <span>{label}</span>
  </div>
);

const PosterCard = ({
  posterPath,
  title,
  noPosterLabel,
}: {
  posterPath: string;
  title: string;
  noPosterLabel: string;
}) => (
  <div
    className={cn(
      'relative aspect-[2/3] w-full rounded-xl overflow-hidden',
      'border border-border/50 shadow-2xl shadow-black/30',
      'bg-muted/40',
    )}
  >
    {posterPath ? (
      <Image
        src={`${TMDB_POSTER_BASE}${posterPath}`}
        alt={title}
        fill
        sizes="(max-width: 768px) 40vw, 220px"
        priority
        unoptimized
        className="object-cover"
      />
    ) : (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <Clapperboard className="w-10 h-10 opacity-30" />
        <span className="text-xs opacity-40 text-center px-2">{noPosterLabel}</span>
      </div>
    )}
  </div>
);

const SectionCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'rounded-xl border border-border/40 bg-card p-5 shadow-sm',
      className,
    )}
  >
    {children}
  </div>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
    {children}
  </h2>
);

export const MediaDetailsHeader = ({
  media,
  isAuthenticated,
  dict,
  watchedEpisodes,
  isFavorite,
}: MediaDetailsHeaderProps) => {
  const releaseYear = media.releaseDate
    ? new Date(media.releaseDate).getFullYear()
    : null;

  const runtimeLabel =
    media.runtime > 0
      ? dict.runtime.replace('{n}', String(media.runtime))
      : null;

  const isMovie = media.type === 'movie';

  return (
    <article className="flex flex-col gap-6">
      {/* ── Header Card — backdrop blurred + poster medium ── */}
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-2xl',
          'border border-border/40 bg-card',
        )}
        style={{ minHeight: '280px' }}
      >
        {/* Blurred backdrop */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <MediaBackdrop
            backdropPath={media.backdropPath}
            title={media.title}
            className="scale-105 blur-sm opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background/95" />
        </div>

        {/* Content over backdrop */}
        <div className="relative z-10 flex gap-6 p-6 sm:gap-8 sm:p-8">
          {/* Poster */}
          <div className="w-28 shrink-0 sm:w-44">
            <PosterCard
              posterPath={media.posterPath}
              title={media.title}
              noPosterLabel={dict.noPoster}
            />
          </div>

          {/* Metadata */}
          <div className="flex flex-col justify-end gap-3 min-w-0 py-2">
            {/* Type badge */}
            <div className="flex items-center gap-2">
              {isMovie ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary/80">
                  <Clapperboard className="w-3.5 h-3.5" />
                  <span>Filme</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary/80">
                  <Tv2 className="w-3.5 h-3.5" />
                  <span>Série</span>
                </div>
              )}
            </div>

            <h1
              className={cn(
                'text-2xl font-bold leading-tight text-foreground sm:text-3xl',
                'line-clamp-3',
              )}
            >
              {media.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3">
              {releaseYear && (
                <MetaItem
                  icon={<Calendar className="w-3.5 h-3.5" />}
                  label={String(releaseYear)}
                />
              )}
              {runtimeLabel && (
                <MetaItem
                  icon={<Clock className="w-3.5 h-3.5" />}
                  label={runtimeLabel}
                />
              )}
              {!isMovie && media.numberOfSeasons && (
                <MetaItem
                  icon={<Tv2 className="w-3.5 h-3.5" />}
                  label={`${media.numberOfSeasons} ${dict.seasons}`}
                />
              )}
              {media.status && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/40">
                  {media.status}
                </span>
              )}
            </div>

            {/* Genres + Add Session button row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {media.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {media.genres.map((genre) => (
                    <GenrePill key={genre} genre={genre} />
                  ))}
                </div>
              )}

              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  <AddSessionDialog
                    tmdbId={media.tmdbId}
                    mediaType={isMovie ? 'movie' : 'tv'}
                    mediaTitle={media.title}
                    dict={dict.addSession}
                  />
                  <ToggleFavoriteButton
                    tmdbId={media.tmdbId}
                    type={isMovie ? 0 : 1}
                    initialIsFavorite={isFavorite ?? false}
                    dict={dict.favorite}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body — two column layout ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {isMovie ? (
            /* Movie: cast on the left */
            <SectionCard>
              <SectionHeading>{dict.cast}</SectionHeading>
              <CastGrid cast={media.topCast} label={dict.cast} />
            </SectionCard>
          ) : (
            <>
              {/* TV: overview card */}
              <SectionCard>
                <SectionHeading>{dict.overview}</SectionHeading>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {media.overview || dict.noOverview}
                </p>
              </SectionCard>

              {/* TV: cast card below overview */}
              {media.topCast.length > 0 && (
                <SectionCard>
                  <SectionHeading>{dict.cast}</SectionHeading>
                  <CastGrid cast={media.topCast} label={dict.cast} />
                </SectionCard>
              )}
            </>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {isMovie ? (
            /* Movie: overview card on the right */
            <SectionCard>
              <SectionHeading>{dict.overview}</SectionHeading>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {media.overview || dict.noOverview}
              </p>
            </SectionCard>
          ) : (
            /* TV: seasons & episodes card */
            media.seasons && media.seasons.length > 0 && (
              <SectionCard>
                <SectionHeading>
                  {dict.seasons} &amp; {dict.episodes}
                </SectionHeading>
                <SeasonTabs
                  tmdbId={media.tmdbId}
                  seasons={media.seasons}
                  isAuthenticated={isAuthenticated}
                  dict={dict}
                  watchedEpisodes={watchedEpisodes}
                />
              </SectionCard>
            )
          )}
        </div>
      </div>
    </article>
  );
};
