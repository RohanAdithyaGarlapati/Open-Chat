export function Avatar({ name, color, size = 42 }: { name: string; color: string; size?: number }) {
  return (
    <div
      className="rounded-full grid place-items-center font-bold text-white flex-none"
      style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}
    >
      {name[0]}
    </div>
  );
}
