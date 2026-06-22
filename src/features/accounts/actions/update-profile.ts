"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { updateProfile } from "../api/update-profile";
import { uploadAvatar, uploadCover } from "../api/upload-image";
import { UpdateProfileSchema, type FormState } from "../types";

export const updateProfileAction = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState> => {
  const data = Object.fromEntries(formData.entries());
  
  const parsed = UpdateProfileSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const avatarFile = formData.get("avatar") as File | null;
  if (avatarFile && avatarFile.size > 0) {
    const avatarData = new FormData();
    avatarData.append("file", avatarFile);
    const avatarResult = await uploadAvatar(avatarData);
    if (!avatarResult.success) {
      return {
        success: false,
        globalError: avatarResult.error?.title || "Failed to upload avatar.",
      };
    }
  }

  const coverFile = formData.get("cover") as File | null;
  if (coverFile && coverFile.size > 0) {
    const coverData = new FormData();
    coverData.append("file", coverFile);
    const coverResult = await uploadCover(coverData);
    if (!coverResult.success) {
      return {
        success: false,
        globalError: coverResult.error?.title || "Failed to upload cover.",
      };
    }
  }

  const result = await updateProfile(parsed.data);

  if (!result.success) {
    return {
      success: false,
      globalError: result.error?.title || "Failed to update profile.",
      fieldErrors: result.error?.errors,
    };
  }

  revalidatePath('/settings/profile');
  revalidatePath('/profile/[username]', 'layout'); 
  
  return {
    success: true,
  };
};
