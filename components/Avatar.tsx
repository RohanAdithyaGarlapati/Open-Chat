// Gradient avatar. Shows a robot glyph for agent accounts.
function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, ((n >> 16) & 255) + amt));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 255) + amt));
  const b = Math.min(255, Math.max(0, (n & 255) + amt));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function Avatar({ name, color, size = 42, robot = false }: { name: string; color: string; size?: number; robot?: boolean }) {
  return (
    <div
      className="rounded-full grid place-items-center font-bold text-white flex-none shadow-sm ring-1 ring-white/10"
      style={{
        width: size, height: size, fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${shade(color, 30)}, ${shade(color, -25)})`,
      }}
    >
      {robot ? (
        <svg viewBox="0 0 24 24" width={size * 0.56} height={size * 0.56} fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="4.5" y="8" width="15" height="10" rx="2.5" />
          <path d="M12 8V4.5" /><circle cx="12" cy="3.2" r="1.2" fill="white" stroke="none" />
          <circle cx="9.2" cy="13" r="1.25" fill="white" stroke="none" />
          <circle cx="14.8" cy="13" r="1.25" fill="white" stroke="none" />
          <path d="M2.6 11.5v3M21.4 11.5v3" />
        </svg>
      ) : (name?.[0] ?? "?").toUpperCase()}
    </div>
  );
}
