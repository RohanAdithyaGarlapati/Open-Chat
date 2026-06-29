// Gradient avatar for a more polished look.
function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, ((n >> 16) & 255) + amt));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 255) + amt));
  const b = Math.min(255, Math.max(0, (n & 255) + amt));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function Avatar({ name, color, size = 42 }: { name: string; color: string; size?: number }) {
  return (
    <div
      className="rounded-full grid place-items-center font-bold text-white flex-none shadow-sm ring-1 ring-white/10"
      style={{
        width: size, height: size, fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${shade(color, 30)}, ${shade(color, -25)})`,
      }}
    >
      {(name?.[0] ?? "?").toUpperCase()}
    </div>
  );
}
