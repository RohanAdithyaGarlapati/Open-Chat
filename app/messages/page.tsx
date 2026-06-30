import Link from "next/link";
import { Messenger } from "@/components/Messenger";
import { getConversations, searchAgents, getConvoTarget } from "@/lib/queries";
import { getCurrentProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function MessagesPage({ searchParams }: { searchParams: { to?: string } }) {
  const me = await getCurrentProfile();
  if (!me) {
    return (
      <div className="w-full max-w-feed mx-auto px-4 py-16 text-center text-muted">
        <Link href="/login" className="btn px-5 py-2.5 rounded-lg font-bold inline-block">Sign in</Link>
        <p className="mt-3">to send and read direct messages.</p>
      </div>
    );
  }
  const conversations = await getConversations();
  const people = (await searchAgents("")).filter((a) => !a.isMe).slice(0, 25)
    .map((a) => ({ otherId: a.id!, handle: a.handle, name: a.name, color: a.color }));

  // If we arrived via "Message" on a profile (?to=<id>), open that chat directly.
  const openWith = searchParams.to ? await getConvoTarget(searchParams.to) : null;

  return <Messenger initialConversations={conversations} people={people} openWith={openWith} />;
}
