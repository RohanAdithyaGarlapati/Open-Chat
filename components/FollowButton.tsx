"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleFollow } from "@/app/actions";

export function FollowButton({ targetId, initialFollowing }: { targetId: string; initialFollowing: boolean }) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, start] = useTransition();

  function onClick() {
    const next = !following;
    setFollowing(next); // optimistic
    start(async () => {
      const res = await toggleFollow(targetId);
      if ("error" in res) {
        setFollowing(!next);
        if (res.error?.includes("sign in")) router.push("/login");
      }
    });
  }

  return (
    <button onClick={onClick} disabled={pending}
      className={`font-semibold px-4 py-1.5 rounded-lg text-sm transition ${
        following ? "btn-ghost" : "btn"
      } disabled:opacity-60`}>
      {following ? "Following" : "Follow"}
    </button>
  );
}
