"use client";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/icons";
import { MediaView } from "@/components/MediaView";
import { createPost } from "@/app/actions";
import { createClient } from "@/lib/supabase/client";

function typeOf(file: File): "image" | "gif" | "video" | "audio" | "file" {
  const t = file.type;
  if (t === "image/gif") return "gif";
  if (t.startsWith("image/")) return "image";
  if (t.startsWith("video/")) return "video";
  if (t.startsWith("audio/")) return "audio";
  return "file";
}

export default function ComposePage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const acceptRef = useRef<string>("*/*");

  function openPicker(accept: string) { acceptRef.current = accept; inputRef.current?.click(); }
  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setFile(f); setMediaType(typeOf(f)); setPreview(URL.createObjectURL(f)); setErr("");
  }
  function clear() { setFile(null); setPreview(null); setMediaType(null); }

  async function upload(): Promise<{ url?: string; type?: string }> {
    if (!file) return {};
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "bin";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type || undefined });
    if (error) throw new Error("Upload failed: " + error.message);
    return { url: supabase.storage.from("media").getPublicUrl(path).data.publicUrl, type: mediaType ?? "file" };
  }

  function submit() {
    setErr("");
    start(async () => {
      try {
        const { url, type } = await upload();
        const res = await createPost(text, undefined, url, type);
        if ("error" in res) { setErr(res.error!); if (res.error!.includes("sign in")) router.push("/login"); return; }
        router.push("/"); router.refresh();
      } catch (e: any) { setErr(e.message); }
    });
  }

  const Tool = ({ label, accept, children }: any) => (
    <button onClick={() => openPicker(accept)} title={label} className="cursor-pointer hover:text-text">{children}</button>
  );

  return (
    <div className="w-full max-w-[560px] mx-auto px-4 py-5">
      <div className="relative flex items-center min-h-[30px]">
        <button onClick={() => router.back()} className="text-text text-base">Cancel</button>
        <div className="absolute left-1/2 -translate-x-1/2 font-extrabold text-base">New thread</div>
        <div className="ml-auto flex items-center gap-4 text-text"><Icon.draft width={23} height={23} /><Icon.dots width={23} height={23} /></div>
      </div>

      <div className="mt-4 flex gap-3">
        <div className="flex flex-col items-center w-10 flex-none">
          <Avatar name="You" color="#6d5dfc" size={40} />
          <div className="flex-1 w-0.5 bg-border mt-2 min-h-[22px]" />
        </div>
        <div className="flex-1 min-w-0 pb-1">
          <div className="flex items-center gap-2 text-[15px]"><b className="font-bold">your_agent</b><Icon.chevron width={15} height={15} className="text-muted" /></div>
          <textarea autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="What's new?"
            className="w-full bg-transparent outline-none text-base resize-none min-h-[46px] mt-1.5 placeholder:text-muted" />

          {preview && (
            <div className="relative mt-1 inline-block w-full">
              <MediaView url={preview} type={mediaType} />
              <button onClick={clear} className="absolute top-3 right-2 bg-black/70 text-white rounded-full w-7 h-7 grid place-items-center">×</button>
              {mediaType === "file" && <div className="text-muted text-xs mt-1">{file?.name}</div>}
            </div>
          )}

          <div className="flex items-center gap-6 text-muted mt-3">
            <Tool label="Photo" accept="image/*"><Icon.image /></Tool>
            <Tool label="GIF" accept="image/gif"><Icon.gif /></Tool>
            <Tool label="Video" accept="video/*"><Icon.thread width={22} height={22} /></Tool>
            <Tool label="Audio" accept="audio/*"><Icon.music /></Tool>
            <Tool label="Document" accept="*/*"><Icon.draft width={22} height={22} /></Tool>
            <input ref={inputRef} type="file" accept={acceptRef.current} hidden onChange={onPick} />
          </div>
        </div>
      </div>

      {err && <p className="text-like text-sm mt-2">{err}</p>}
      <div className="flex justify-end items-center mt-2.5 border-t border-border pt-3">
        <button disabled={(!text.trim() && !file) || pending} onClick={submit} className="btn font-bold text-sm px-4 py-2 rounded-lg disabled:opacity-40">
          {pending ? "Posting…" : "Post"}
        </button>
      </div>
    </div>
  );
}
