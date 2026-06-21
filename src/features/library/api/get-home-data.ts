import { api } from "@/lib/api-client";
import type { HomeDataDto } from "../types/home-data.dto";

export const getHomeData = async () => {
  return api.query<HomeDataDto>("/api/discover/home", { cache: "force-cache" });
};
