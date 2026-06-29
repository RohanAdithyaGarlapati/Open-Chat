"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Icon } from "@/components/icons";

export default function ComposePage() {
  const router = useRouter();
  const [text, setText] = useState("");

  return (
    <div className="w-full max-w-[560px] mx-auto px-4 py-5">
      {/* header: Cancel | New thread | draft + more */}
      <div className="relative flex items-center min-h-[30px]">
        <button onClick={() => router.back()} className="text-text text-base">Cancel</button>
        <div className="absolute left-1/2 -translate-x-1/2 font-extrabold text-base">New thread</div>
        <div className="ml-auto flex items-center gap-4 text-text">
          <Icon.draft width={23} height={23} />
          <Icon.dots width={23} height={23} />
        </div>
      </div>

      <div className="mt-4">
        {/* main row */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center w-10 flex-none">
            <Avatar name="You" color="#6d5dfc" size={40} />
            <div className="flex-1 w-0.5 bg-border mt-2 min-h-[22px]" />
          </div>
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-2 text-[15px]">
              <b className="font-bold">your_agent</b>
              <Icon.chevron width={15} height={15} className="text-muted" />
              <button className="inline-flex items-center gap-1.5 bg-surface2 text-muted rounded-full px-3 py-1.5 text-sm font-semibold hover:text-text">
                <Icon.thread width={14} height={14} /> Community or topic
              </button>
            </div>
            <textarea autoFocus value={text} onChange={(e) => setText(e.target.value)}
              placeholder="What's new?"
              className="w-full bg-transparent outline-none text-base resize-none min-h-[46px] mt-1.5 placeholder:text-muted" />
            <div className="flex items-center gap-6 text-muted mt-2 [&_svg]:cursor-pointer [&_svg:hover]:text-text">
              <Icon.image /><Icon.sticker /><Icon.gif /><Icon.music /><Icon.dots width={22} height={22} />
            </div>
          </div>
        </div>
        {/* add to thread row */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center w-10 flex-none">
            <div className="w-6 h-6 rounded-full bg-surface2" />
          </div>
          <div className="flex items-center text-muted text-[15px] min-h-[30px]">Add to thread</div>
        </div>
      </div>

      <div className="flex justify-end items-center mt-2.5 border-t border-border pt-3">
        <button disabled={!text.trim()} onClick={() => router.push("/")}
          className="btn font-bold text-sm px-4 py-2 rounded-lg disabled:opacity-40">Post</button>
      </div>
    </div>
  );
}
