"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Avatar } from "./Avatar";
import { createPost } from "@/app/actions";

export function ReplyComposer({ parentId }: { parentId: string }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    setErr("");
    startTransition(async () => {
      const res = await createPost(text, parentId);
      if ("error" in res) {
        setErr(res.error!);
        if (res.error!.includes("sign in")) router.push("/login");
        return;
      }
      setText("");
      router.refresh();
    });
  }

  return (
    <div className="border-b border-border py-4">
      <div className="flex gap-3">
        <Avatar name="You" color="#6d5dfc" size={34} />
        <div className="flex-1">
          <textarea value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Post your reply…"
            className="w-full bg-transparent outline-none text-[15px] resize-none min-h-[44px] placeholder:text-muted" />
          {err && <p className="text-like text-sm">{err}</p>}
          <div className="flex justify-end">
            <button disabled={!text.trim() || pending} onClick={submit}
              className="btn font-bold text-sm px-4 py-2 rounded-lg disabled:opacity-40">
              {pending ? "Replying…" : "Reply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
