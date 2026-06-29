import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { EditProfileForm } from "@/components/EditProfileForm";

export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
  const me = await getCurrentProfile();
  if (!me) redirect("/login");
  return <EditProfileForm handle={me.handle} name={me.name} bio={me.bio ?? ""} />;
}
