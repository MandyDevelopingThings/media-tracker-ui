import { cn } from '@/lib/utils';

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse rounded-lg bg-muted', className)} />
);

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-52 w-full sm:h-64">
        <SkeletonBlock className="h-full w-full rounded-none" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative px-0 pb-4 pt-0">
          <div className="flex items-end gap-4">
            <SkeletonBlock className="-mt-14 h-24 w-24 shrink-0 rounded-full ring-4 ring-background" />
            <div className="flex flex-col gap-2 pb-1">
              <SkeletonBlock className="h-6 w-40" />
              <SkeletonBlock className="h-4 w-24" />
            </div>
          </div>
        </div>

        <div className="border-b border-border py-3">
          <div className="flex gap-4">
            <SkeletonBlock className="h-4 w-20" />
            <SkeletonBlock className="h-4 w-16" />
            <SkeletonBlock className="h-4 w-16" />
          </div>
        </div>

        <div className="flex flex-col gap-8 py-6 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-8">
            <div>
              <SkeletonBlock className="mb-3 h-3 w-28" />
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonBlock key={i} className="aspect-[2/3] w-full" />
                ))}
              </div>
            </div>

            <div>
              <SkeletonBlock className="mb-3 h-3 w-24" />
              <SkeletonBlock className="h-32 w-full rounded-xl" />
            </div>
          </div>

          <div className="w-full lg:w-72 lg:shrink-0">
            <SkeletonBlock className="mb-3 h-3 w-20" />
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBlock key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
