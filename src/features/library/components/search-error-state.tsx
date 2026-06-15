import { WifiOff } from 'lucide-react';

type SearchErrorStateProps = {
  dict: { errorTitle: string; errorHint: string };
};

export const SearchErrorState = ({ dict }: SearchErrorStateProps) => (
  <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-destructive/25 bg-destructive/10">
      <WifiOff className="h-8 w-8 text-destructive" />
    </div>
    <div className="space-y-1">
      <p className="text-base font-medium text-foreground">{dict.errorTitle}</p>
      <p className="text-sm text-muted-foreground">{dict.errorHint}</p>
    </div>
  </div>
);
