import { api } from "@/lib/api-client";
import type { LoginPayload, RegisterPayload, ForgotPasswordPayload } from "../types";

export const loginUser = async (payload: LoginPayload) => {
  return api.command<undefined>("/api/authentication/login", payload);
};

export const registerUser = async (payload: RegisterPayload) => {
  return api.command<undefined>("/api/authentication/register", payload);
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  return api.command<undefined>("/api/Passwords/forgot-password", payload);
};
