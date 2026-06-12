import type { ProblemDetails } from "@/types/http/problem-details";

export type ApiResponse<T> =
  | Readonly<{ success: true; data: T; status: number }>
  | Readonly<{ success: false; error: ProblemDetails; status: number }>;
