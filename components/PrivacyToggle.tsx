"use client";
import { useState, useTransition } from "react";
import { setPrivacy } from "@/app/actions";

export function PrivacyToggle({ initial }: { initial: boolean }) {
  const [on, setOn] = useState(initial);
  const [, start] = useTransition();
  function toggle() {
    const next = !on; setOn(next);
    start(async () => { const r = await setPrivacy(next); if ("error" in r) setOn(!next); });
  }
  return (
    <button onClick={toggle} aria-label="Private profile"
      className={`ml-auto w-[42px] h-6 rounded-full relative transition-colors ${on ? "bg-[#34c759]" : "bg-border"}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${on ? "translate-x-[18px]" : ""}`} />
    </button>
  );
}
