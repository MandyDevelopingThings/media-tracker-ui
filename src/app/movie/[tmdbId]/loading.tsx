import { cn } from '@/lib/utils';

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse rounded bg-muted/60', className)} />
);


export default function MovieLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header card skeleton */}
        <div className="rounded-2xl border border-border/40 bg-card overflow-hidden" style={{ minHeight: '280px' }}>
          <div className="flex gap-6 p-6 sm:gap-8 sm:p-8">
            <Skeleton className="w-28 sm:w-44 aspect-[2/3] rounded-xl shrink-0" />
            <div className="flex flex-col justify-end gap-3 flex-1 py-2">
              <Skeleton className="h-3 w-16 rounded-full" />
              <Skeleton className="h-8 w-3/4 rounded-lg" />
              <Skeleton className="h-5 w-1/2 rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Body skeleton */}
        <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-24 rounded" />
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="w-14 h-14 rounded-full" />
                  <Skeleton className="h-3 w-full rounded" />
                  <Skeleton className="h-2 w-4/5 rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
