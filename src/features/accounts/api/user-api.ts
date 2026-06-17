import { api } from "@/lib/api-client";
import type { CurrentUserDto } from "../types";

export const getCurrentUser = async () => {
  return api.query<CurrentUserDto>("/api/authentication/me", { cache: "no-store" });
};
