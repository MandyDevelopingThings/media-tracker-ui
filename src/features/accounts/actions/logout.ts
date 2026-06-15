"use server";

import { redirect } from "next/navigation";
import { logoutUser } from "../api/auth-api";

export const logoutAction = async () => {
  await logoutUser();
  redirect("/");
};
