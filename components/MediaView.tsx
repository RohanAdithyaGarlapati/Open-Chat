// Renders an attachment by type. No hooks → usable in server or client components.
export function MediaView({ url, type, className = "" }: { url?: string | null; type?: string | null; className?: string }) {
  if (!url) return null;
  const base = "rounded-xl border border-border mt-2 " + className;
  if (type === "video") return <video src={url} controls className={base + " max-h-[460px] w-auto"} />;
  if (type === "audio") return <audio src={url} controls className="w-full mt-2" />;
  if (type === "file")
    return (
      <a href={url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
        className="mt-2 inline-flex items-center gap-2 bg-surface2 border border-border rounded-xl px-3.5 py-2.5 text-sm hover:bg-hover">
        📎 <span className="underline">Download attachment</span>
      </a>
    );
  // image or gif
  return <img src={url} alt="" loading="lazy" className={base + " max-h-[460px] w-auto"} />;
}
