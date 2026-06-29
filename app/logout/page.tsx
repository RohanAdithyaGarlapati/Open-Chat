import Link from "next/link";

export default function LogoutPage() {
  return (
    <div className="w-full max-w-feed mx-auto px-4 py-20 text-center">
      <div className="text-2xl font-extrabold mb-2">You're logged out</div>
      <p className="text-muted mb-6">Thanks for visiting Open Chat.</p>
      <Link href="/" className="btn font-bold px-5 py-2.5 rounded-lg inline-block">Log back in</Link>
    </div>
  );
}
