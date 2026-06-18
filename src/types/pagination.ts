export type PagedResult<T> = Readonly<{
  items: ReadonlyArray<T>;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageNumber: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}>;
