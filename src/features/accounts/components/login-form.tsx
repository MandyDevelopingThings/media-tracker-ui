"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AlertCircle, Clapperboard, Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAction } from "../actions/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { FormState } from "../types";

export const LoginForm = ({ dict }: { dict: any }) => {
  const [state, action, isPending] = useActionState<FormState, FormData>(
    loginAction,
    { success: false }
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm bg-card/80 backdrop-blur-md border border-border rounded-2xl shadow-xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center justify-center mb-6">
            <Clapperboard className="w-8 h-8 text-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-center">{dict.title}</h1>
          <p className="text-muted-foreground text-center mt-2">{dict.subtitle}</p>
        </div>

        {state.globalError && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{state.globalError}</p>
          </div>
        )}

        <form action={action} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="userName">{dict.usernameLabel}</Label>
            <Input
              id="userName"
              name="userName"
              autoComplete="username"
              placeholder={dict.usernamePlaceholder}
              disabled={isPending}
              aria-describedby="userName-error"
            />
            {state.fieldErrors?.userName && (
              <p id="userName-error" className="text-sm text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4" />
                {state.fieldErrors.userName[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{dict.passwordLabel}</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder={dict.passwordPlaceholder}
                disabled={isPending}
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {state.fieldErrors?.password && (
              <p id="password-error" className="text-sm text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4" />
                {state.fieldErrors.password[0]}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="rememberMe" name="rememberMe" defaultChecked value="on" />
              <label
                htmlFor="rememberMe"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {dict.rememberMe}
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              {dict.forgotPassword} &rarr;
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {dict.submitButton}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-muted-foreground">{dict.noAccount}</span>{" "}
          <Link href="/register" className="text-primary hover:underline">
            {dict.registerLink}
          </Link>
        </div>
      </div>
    </div>
  );
};
