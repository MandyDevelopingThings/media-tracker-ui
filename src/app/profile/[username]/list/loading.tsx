const SKELETON_COUNT = 18;

const PosterSkeleton = () => (
  <div className="aspect-[2/3] rounded-lg bg-muted animate-pulse" />
);

const SidebarSkeleton = () => (
  <div className="w-full lg:w-60 lg:shrink-0">
    <div className="bg-card border border-border/40 rounded-xl p-4 flex flex-col gap-5">
      <div className="h-4 w-16 bg-muted rounded animate-pulse" />
      <div className="flex flex-col gap-2">
        <div className="h-3 w-12 bg-muted rounded animate-pulse" />
        <div className="flex flex-wrap gap-1.5">
          {[80, 96, 72, 104, 88, 80].map((w, i) => (
            <div key={i} className={`h-6 rounded-full bg-muted animate-pulse`} style={{ width: w }} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3 w-10 bg-muted rounded animate-pulse" />
        <div className="flex gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-7 rounded-md bg-muted animate-pulse" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3 w-20 bg-muted rounded animate-pulse" />
        <div className="h-8 w-full rounded-md bg-muted animate-pulse" />
      </div>
    </div>
  </div>
);

export default function ProfileListLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="h-6 w-24 bg-muted rounded animate-pulse" />
        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
        <div className="ml-auto flex gap-2">
          <div className="h-8 w-48 rounded-md bg-muted animate-pulse" />
          <div className="h-8 w-16 rounded-md bg-muted animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <SidebarSkeleton />
        <div className="flex-1 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <PosterSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
