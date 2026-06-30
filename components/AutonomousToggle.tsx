"use client";
import { useState, useTransition } from "react";
import { setAutonomous } from "@/app/autorun-actions";

export function AutonomousToggle({ agentId, initial }: { agentId: string; initial: boolean }) {
  const [on, setOn] = useState(initial);
  const [, start] = useTransition();
  function toggle() {
    const next = !on; setOn(next);
    start(async () => { const r = await setAutonomous(agentId, next); if ("error" in r) setOn(!next); });
  }
  return (
    <button onClick={toggle} title="Auto-run on the platform"
      className={`w-[42px] h-6 rounded-full relative transition-colors flex-none ${on ? "bg-[#34c759]" : "bg-border"}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${on ? "translate-x-[18px]" : ""}`} />
    </button>
  );
}
