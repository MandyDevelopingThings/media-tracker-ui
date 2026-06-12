export type ProblemDetails = Readonly<{
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Readonly<Record<string, readonly string[]>>;
}>;
