"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "./icons";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Home", icon: Icon.home },
  { href: "/compose", label: "New thread", icon: Icon.thread },
  { href: "/messages", label: "Messages", icon: Icon.dm },
  { href: "/search", label: "Search", icon: Icon.search },
  { href: "/activity", label: "Activity", icon: Icon.activity },
  { href: "/profile", label: "Profile", icon: Icon.profile },
];

function NavList({ items, active, onNav }: { items: typeof NAV; active: string; onNav?: () => void }) {
  return (
    <>
      {items.map((it) => {
        const on = it.href === active || (it.href !== "/" && active.startsWith(it.href));
        return (
          <Link key={it.href} href={it.href} onClick={onNav}
            className={`flex items-center gap-3.5 p-3 rounded-xl text-[15px] hover:bg-hover transition-colors ${on ? "bg-surface2 font-bold" : "font-medium"}`}>
            <it.icon /> <span className="nav-label">{it.label}</span>
          </Link>
        );
      })}
    </>
  );
}

function Footer({ onNav }: { onNav?: () => void }) {
  return (
    <>
      <Link href="/settings" onClick={onNav} className="flex items-center gap-3.5 p-3 rounded-xl text-[15px] hover:bg-hover font-medium">
        <Icon.settings /> <span className="nav-label">Settings</span>
      </Link>
      <form action="/auth/signout" method="post">
        <button type="submit" className="w-full flex items-center gap-3.5 p-3 rounded-xl text-[15px] hover:bg-hover font-medium text-like">
          <Icon.logout /> <span className="nav-label">Log out</span>
        </button>
      </form>
    </>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [drawer, setDrawer] = useState(false);

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[76px_1fr] lg:grid-cols-[245px_1fr]">
      <aside className="hidden md:flex sticky top-0 h-screen flex-col border-r border-border p-3 bg-bg">
        <div className="flex items-center gap-2.5 font-extrabold text-xl p-2 mb-4 justify-center lg:justify-start">
          <span className="w-[30px] h-[30px] rounded-[9px] grid place-items-center btn">◎</span>
          <span className="hidden lg:inline">Open Chat</span>
        </div>
        <nav className="flex flex-col gap-1 flex-1 [&_.nav-label]:hidden lg:[&_.nav-label]:inline [&>a]:justify-center lg:[&>a]:justify-start">
          <NavList items={NAV} active={path} />
        </nav>
        <div className="h-px bg-border my-2.5" />
        <div className="flex flex-col gap-1 [&_.nav-label]:hidden lg:[&_.nav-label]:inline [&_a]:justify-center lg:[&_a]:justify-start [&_button]:justify-center lg:[&_button]:justify-start">
          <Footer />
          <div className="px-3 pt-1 hidden lg:block"><ThemeToggle /></div>
        </div>
      </aside>

      <main className="flex flex-col min-w-0">
        <div className="md:hidden flex items-center justify-between sticky top-0 z-30 bg-bg px-4 py-3 border-b border-border">
          <button className="p-2 rounded-lg hover:bg-hover" onClick={() => setDrawer(true)} aria-label="Menu"><Icon.menu width={22} height={22} /></button>
          <div className="font-extrabold text-lg">Open Chat</div>
          <ThemeToggle />
        </div>

        {children}

        <nav className="md:hidden flex justify-around items-center sticky bottom-0 z-30 bg-bg border-t border-border py-2.5">
          {[NAV[0], NAV[2], NAV[1], NAV[4], NAV[5]].map((it) => (
            <Link key={it.href} href={it.href} className={`p-2 px-4 rounded-lg ${it.href === path ? "text-text" : "text-muted"}`}>
              <it.icon />
            </Link>
          ))}
        </nav>
      </main>

      {drawer && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawer(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-3/4 max-w-[300px] bg-bg border-r border-border p-3 flex flex-col">
            <div className="flex items-center gap-2.5 font-extrabold text-xl p-2 mb-4">
              <span className="w-[30px] h-[30px] rounded-[9px] grid place-items-center btn">◎</span> Open Chat
            </div>
            <nav className="flex flex-col gap-1 flex-1"><NavList items={NAV} active={path} onNav={() => setDrawer(false)} /></nav>
            <div className="h-px bg-border my-2.5" />
            <nav className="flex flex-col gap-1"><Footer onNav={() => setDrawer(false)} /></nav>
          </div>
        </div>
      )}
    </div>
  );
}
