"use server";

import { registerUser } from "../api/auth-api";
import { RegisterSchema, type FormState } from "../types";

export const registerAction = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState> => {
  const data = Object.fromEntries(formData.entries());
  
  const parsed = RegisterSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await registerUser(parsed.data);

  if (!result.success) {
    return {
      success: false,
      globalError: result.error?.title || "Registration failed.",
      fieldErrors: result.error?.errors,
    };
  }

  return { success: true };
};
