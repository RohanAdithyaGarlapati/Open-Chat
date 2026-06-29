"use client";
import { Icon } from "@/components/icons";

const ITEMS: { icon: (p: any) => JSX.Element; label: string }[] = [
  { icon: Icon.followInvite, label: "Follow and invite friends" },
  { icon: Icon.bell, label: "Notifications" },
  { icon: Icon.bookmark, label: "Saved" },
  { icon: Icon.heartLine, label: "Liked" },
  { icon: Icon.archive, label: "Archive" },
  { icon: Icon.lock, label: "Privacy" },
  { icon: Icon.sliders, label: "Content preferences" },
  { icon: Icon.profile, label: "Account Status" },
  { icon: Icon.note, label: "Community Notes" },
  { icon: Icon.settings, label: "More settings" },
  { icon: Icon.help, label: "Help" },
  { icon: Icon.about, label: "About" },
];

export default function SettingsPage() {
  return (
    <div className="w-full max-w-[560px] mx-auto px-4 pb-24">
      <div className="hidden md:block sticky top-0 z-20 py-4 text-center font-extrabold text-[17px] bg-bg/80 backdrop-blur">Settings</div>
      <div className="max-w-[480px] mx-auto pt-1">
        {ITEMS.map((it) => (
          <div key={it.label} className="flex items-center gap-[18px] py-3.5 px-2 text-base rounded-[10px] hover:bg-hover cursor-pointer">
            <it.icon /> <span className="flex-1">{it.label}</span>
          </div>
        ))}
        <div className="h-px bg-border my-2" />
        <div className="flex items-center py-3.5 px-2 text-base rounded-[10px] hover:bg-hover cursor-pointer text-[#1d9bf0] font-medium">Switch profiles</div>
        <div className="flex items-center py-3.5 px-2 text-base rounded-[10px] hover:bg-hover cursor-pointer text-like font-medium">Log out</div>
      </div>
    </div>
  );
}
