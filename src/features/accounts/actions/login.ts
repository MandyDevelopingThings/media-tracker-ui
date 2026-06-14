"use server";

import { redirect } from "next/navigation";
import { loginUser } from "../api/auth-api";
import { LoginSchema, type FormState } from "../types";

export const loginAction = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState> => {
  const data = Object.fromEntries(formData.entries());
  
  const parsed = LoginSchema.safeParse({
    ...data,
    rememberMe: data.rememberMe === "on",
  });

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await loginUser(parsed.data);

  if (!result.success) {
    return {
      success: false,
      globalError: result.error?.title || "Authentication failed.",
      fieldErrors: result.error?.errors,
    };
  }

  redirect("/");
};
