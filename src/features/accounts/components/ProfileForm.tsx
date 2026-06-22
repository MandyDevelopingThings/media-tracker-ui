"use client";

import { useActionState, useState, useEffect } from "react";
import Image from "next/image";
import { AlertCircle, Loader2, CheckCircle2, Camera } from "lucide-react";
import { updateProfileAction } from "../actions/update-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FormState } from "../types";
import type { ProfileDto } from "../types/profile";

interface ProfileFormProps {
  profile: ProfileDto;
  dict: any;
  apiBaseUrl: string;
}

export function ProfileForm({ profile, dict, apiBaseUrl }: ProfileFormProps) {
  const [state, action, isPending] = useActionState<FormState, FormData>(
    updateProfileAction,
    { success: false }
  );

  const [showSuccess, setShowSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    if (state.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [state.success]);

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h3 className="text-lg font-medium">{dict.title}</h3>
        <p className="text-sm text-muted-foreground">{dict.description}</p>
      </div>

      {state.globalError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{state.globalError}</p>
        </div>
      )}

      {showSuccess && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-primary">{dict.success}</p>
        </div>
      )}

      <form action={action} className="space-y-6">
        <div className="space-y-4">
          <Label>{dict.profileAndCover}</Label>
          <div className="relative h-48 w-full rounded-xl border-2 border-border bg-muted">
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              {coverPreview || profile.coverUrl ? (
                <Image 
                  src={coverPreview || `${apiBaseUrl}${profile.coverUrl}`} 
                  fill 
                  className="object-cover" 
                  alt="Cover" 
                  unoptimized 
                />
              ) : null}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Label htmlFor="cover" className="cursor-pointer text-white flex items-center gap-2">
                  <Camera className="w-5 h-5" /> {dict.changeCover}
                </Label>
                <input 
                  type="file" 
                  id="cover" 
                  name="cover" 
                  accept=".png,.jpg,.webp" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files?.[0]) setCoverPreview(URL.createObjectURL(e.target.files[0]));
                  }} 
                />
              </div>
            </div>

            <div className="absolute -bottom-6 left-6 z-10">
              <div className="relative h-24 w-24 rounded-full border-4 border-background bg-muted overflow-hidden">
                {avatarPreview || profile.avatarUrl ? (
                  <Image 
                    src={avatarPreview || `${apiBaseUrl}${profile.avatarUrl}`} 
                    fill 
                    className="object-cover" 
                    alt="Avatar" 
                    unoptimized 
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                    <span className="text-3xl font-bold">{profile.username.slice(0, 2).toUpperCase()}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Label htmlFor="avatar" className="cursor-pointer text-white">
                    <Camera className="w-5 h-5" />
                  </Label>
                  <input 
                    type="file" 
                    id="avatar" 
                    name="avatar" 
                    accept=".png,.jpg,.webp" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files?.[0]) setAvatarPreview(URL.createObjectURL(e.target.files[0]));
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="h-6" /> {}
        </div>

        <div className="space-y-2">
          <Label htmlFor="displayName">{dict.displayName}</Label>
          <Input
            id="displayName"
            name="displayName"
            defaultValue={profile.displayName || ""}
            placeholder={dict.displayNamePlaceholder}
            disabled={isPending}
          />
          {state.fieldErrors?.displayName && (
            <p className="text-sm text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4" />
              {state.fieldErrors.displayName[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">{dict.bio}</Label>
          <Textarea
            id="bio"
            name="bio"
            defaultValue={profile.bio || ""}
            placeholder={dict.bioPlaceholder}
            disabled={isPending}
            className="resize-none"
            rows={5}
          />
          {state.fieldErrors?.bio && (
            <p className="text-sm text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4" />
              {state.fieldErrors.bio[0]}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isPending ? dict.saving : dict.save}
        </Button>
      </form>
    </div>
  );
}
