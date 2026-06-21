import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default async function SettingsPage() {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    redirect("/settings/profile");
  } else {
    redirect("/settings/appearance");
  }
}
