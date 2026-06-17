import { z } from "zod";

export const LoginSchema = z.object({
  userName: z.string().min(1, "Required"),
  password: z.string().min(1, "Required"),
  rememberMe: z.boolean().default(false),
});

export type LoginPayload = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    email: z.string().email("Invalid email"),
    userName: z.string().min(3, "Min 3 characters").max(50, "Max 50 characters"),
    password: z.string().min(8, "Min 8 characters"),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterPayload = z.infer<typeof RegisterSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export type ForgotPasswordPayload = z.infer<typeof ForgotPasswordSchema>;

export type FormState<T = undefined> = {
  success: boolean;
  data?: T;
  globalError?: string;
  fieldErrors?: Partial<Record<string, string[] | readonly string[]>>;
};

export type CurrentUserDto = Readonly<{
  id: string;
  userName: string;
}>;
