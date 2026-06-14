"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle, Clapperboard, Loader2, CheckCircle2 } from "lucide-react";
import { forgotPasswordAction } from "../actions/forgot-password";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { FormState } from "../types";

export const ForgotPasswordForm = ({ dict }: { dict: any }) => {
  const [state, action, isPending] = useActionState<FormState, FormData>(
    forgotPasswordAction,
    { success: false }
  );

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
          <h1 className="text-2xl font-bold text-center">{state.success ? dict.successTitle : dict.title}</h1>
          <p className="text-muted-foreground text-center mt-2">{state.success ? dict.successMessage : dict.subtitle}</p>
        </div>

        {state.success ? (
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-primary mb-6 animate-in zoom-in duration-500" />
            <Link href="/login" className={cn(buttonVariants({ variant: "default" }), "w-full")}>
              {dict.backToLogin}
            </Link>
          </div>
        ) : (
          <>
            {state.globalError && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{state.globalError}</p>
              </div>
            )}

            <form action={action} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">{dict.emailLabel}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={dict.emailPlaceholder}
                  disabled={isPending}
                  aria-describedby="email-error"
                />
                {state.fieldErrors?.email && (
                  <p id="email-error" className="text-sm text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="w-4 h-4" />
                    {state.fieldErrors.email[0]}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {dict.submitButton}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm">
              <Link href="/login" className="text-primary hover:underline">
                &larr; {dict.backToLogin}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
