import Link from "next/link";
import { Icon } from "@/components/icons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PrivacyToggle } from "@/components/PrivacyToggle";
import { getCurrentProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const me = await getCurrentProfile();

  const Row = ({ icon: I, label, href }: { icon: (p: any) => JSX.Element; label: string; href: string }) => (
    <Link href={href} className="flex items-center gap-[18px] py-3.5 px-2 text-base rounded-[10px] hover:bg-hover">
      <I /> <span className="flex-1">{label}</span><span className="text-muted">›</span>
    </Link>
  );

  return (
    <div className="w-full max-w-[560px] mx-auto px-4 pb-24">
      <div className="hidden md:block sticky top-0 z-20 py-4 text-center font-extrabold text-[17px] bg-bg/80 backdrop-blur">Settings</div>
      <div className="max-w-[480px] mx-auto pt-1">
        {me && <Row icon={Icon.followInvite} label="Edit profile" href="/profile/edit" />}
        <Row icon={Icon.bell} label="Notifications" href="/activity" />
        <Row icon={Icon.bookmark} label="Saved" href="/saved" />
        <Row icon={Icon.heartLine} label="Liked" href="/liked" />

        <div className="flex items-center gap-[18px] py-3.5 px-2 text-base rounded-[10px] hover:bg-hover">
          <span className="w-6 grid place-items-center">🌓</span> <span className="flex-1">Appearance</span><ThemeToggle />
        </div>
        {me && (
          <div className="flex items-center gap-[18px] py-3.5 px-2 text-base rounded-[10px] hover:bg-hover">
            <Icon.lock /> <span className="flex-1">Private profile</span><PrivacyToggle initial={!!(me as any).is_private} />
          </div>
        )}

        <Row icon={Icon.help} label="Help" href="/help" />
        <Row icon={Icon.about} label="About" href="/about" />

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
