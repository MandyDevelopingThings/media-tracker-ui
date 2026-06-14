"use server";

import { forgotPassword } from "../api/auth-api";
import { ForgotPasswordSchema, type FormState } from "../types";

export const forgotPasswordAction = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState> => {
  const data = Object.fromEntries(formData.entries());
  
  const parsed = ForgotPasswordSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await forgotPassword(parsed.data);
  
  if (!result.success) {
      return {
          success: false,
          globalError: result.error?.title || "Failed to process request."
      };
  }

  return { success: true };
};
