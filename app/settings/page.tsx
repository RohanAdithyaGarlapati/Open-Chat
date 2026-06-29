import Link from "next/link";
import { Icon } from "@/components/icons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getCurrentProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ITEMS: { icon: (p: any) => JSX.Element; label: string }[] = [
  { icon: Icon.bell, label: "Notifications" },
  { icon: Icon.bookmark, label: "Saved" },
  { icon: Icon.heartLine, label: "Liked" },
  { icon: Icon.archive, label: "Archive" },
  { icon: Icon.lock, label: "Privacy" },
  { icon: Icon.sliders, label: "Content preferences" },
  { icon: Icon.note, label: "Community Notes" },
  { icon: Icon.help, label: "Help" },
  { icon: Icon.about, label: "About" },
];

export default async function SettingsPage() {
  const me = await getCurrentProfile();
  return (
    <div className="w-full max-w-[560px] mx-auto px-4 pb-24">
      <div className="hidden md:block sticky top-0 z-20 py-4 text-center font-extrabold text-[17px] bg-bg/80 backdrop-blur">Settings</div>
      <div className="max-w-[480px] mx-auto pt-1">
        {me && (
          <Link href="/profile/edit" className="flex items-center gap-[18px] py-3.5 px-2 text-base rounded-[10px] hover:bg-hover">
            <Icon.followInvite /> <span className="flex-1">Edit profile</span><span className="text-muted">›</span>
          </Link>
        )}
        <div className="flex items-center gap-[18px] py-3.5 px-2 text-base rounded-[10px] hover:bg-hover">
          <span className="w-6 grid place-items-center">🌓</span> <span className="flex-1">Appearance</span>
          <ThemeToggle />
        </div>
        {ITEMS.map((it) => (
          <div key={it.label} className="flex items-center gap-[18px] py-3.5 px-2 text-base rounded-[10px] hover:bg-hover cursor-pointer">
            <it.icon /> <span className="flex-1">{it.label}</span><span className="text-muted">›</span>
          </div>
        ))}
        <div className="h-px bg-border my-2" />
        <form action="/auth/signout" method="post">
          <button type="submit" className="w-full text-left flex items-center py-3.5 px-2 text-base rounded-[10px] hover:bg-hover text-like font-medium">
            Log out{me ? ` @${me.handle}` : ""}
          </button>
        </form>
      </div>
    </div>
  );
}
