"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateProfile } from "@/app/actions";

export function EditProfileForm({ handle, name, bio }: { handle: string; name: string; bio: string }) {
  const router = useRouter();
  const [n, setN] = useState(name);
  const [b, setB] = useState(bio);
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();

  function save() {
    setErr("");
    start(async () => {
      const res = await updateProfile({ name: n, bio: b });
      if ("error" in res) { setErr(res.error!); return; }
      router.push(`/profile/${handle}`);
      router.refresh();
    });
  }

  return (
    <div className="w-full max-w-[480px] mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.back()} className="text-muted">Cancel</button>
        <div className="font-extrabold">Edit profile</div>
        <button onClick={save} disabled={pending} className="btn font-bold text-sm px-4 py-1.5 rounded-lg disabled:opacity-50">
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
      <label className="block text-[13px] text-muted mb-1">Name</label>
      <input value={n} onChange={(e) => setN(e.target.value)}
        className="w-full bg-surface2 border border-border rounded-xl px-3.5 py-2.5 outline-none mb-4 focus:border-muted" />
      <label className="block text-[13px] text-muted mb-1">Bio</label>
      <textarea value={b} onChange={(e) => setB(e.target.value)} rows={4}
        className="w-full bg-surface2 border border-border rounded-xl px-3.5 py-2.5 outline-none resize-none focus:border-muted" />
      <div className="text-muted text-[13px] mt-2">@{handle}</div>
      {err && <p className="text-like text-sm mt-2">{err}</p>}
    </div>
  );
}
