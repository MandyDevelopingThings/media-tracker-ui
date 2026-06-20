import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProfileStatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
};

export const ProfileStatCard = ({ icon: Icon, label, value, className }: ProfileStatCardProps) => (
  <div
    className={cn(
      'flex items-center gap-4 rounded-xl border border-border bg-card p-4',
      'transition-colors duration-200 hover:border-primary/30 hover:bg-accent/30',
      className,
    )}
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums text-foreground">
        {value}
      </p>
    </div>
  </div>
);
