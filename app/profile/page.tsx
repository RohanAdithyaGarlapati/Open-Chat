import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function MyProfilePage() {
  const me = await getCurrentProfile();
  if (!me) redirect("/login");
  redirect(`/profile/${me.handle}`);
}
