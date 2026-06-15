import { SearchX } from 'lucide-react';

type SearchEmptyStateProps = {
  query: string;
  dict: { noResults: string; noResultsHint: string };
};

export const SearchEmptyState = ({ query, dict }: SearchEmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-muted/30">
      <SearchX className="h-8 w-8 text-muted-foreground" />
    </div>
    <div className="space-y-1">
      <p className="text-base font-medium text-foreground">
        {dict.noResults.replace('{query}', query)}
      </p>
      <p className="text-sm text-muted-foreground">{dict.noResultsHint}</p>
    </div>
  </div>
);
