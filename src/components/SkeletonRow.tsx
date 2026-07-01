"use client";

export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-[var(--color-pitch-light)] opacity-40">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3 pr-4">
          <div className="h-4 rounded bg-[var(--color-pitch-light)] animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} cols={cols} />
      ))}
    </tbody>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl p-5 animate-pulse" style={{
      background: "var(--color-pitch-mid)",
      border: "1px solid var(--color-pitch-light)",
    }}>
      <div className="h-4 w-24 rounded bg-[var(--color-pitch-light)] mb-3 opacity-50" />
      <div className="h-6 w-32 rounded bg-[var(--color-pitch-light)] mb-2 opacity-40" />
      <div className="h-3 w-20 rounded bg-[var(--color-pitch-light)] mb-4 opacity-30" />
      <div className="h-3 w-full rounded bg-[var(--color-pitch-light)] mb-2 opacity-20" />
      <div className="h-3 w-3/4 rounded bg-[var(--color-pitch-light)] opacity-20" />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-xl p-4 sm:p-5 animate-pulse" style={{
      background: "var(--color-pitch-mid)",
      border: "1px solid var(--color-pitch-light)",
    }}>
      <div className="h-3 w-20 rounded bg-[var(--color-pitch-light)] mb-3 opacity-50" />
      <div className="h-8 w-16 rounded bg-[var(--color-pitch-light)] mb-2 opacity-40" />
      <div className="h-3 w-24 rounded bg-[var(--color-pitch-light)] opacity-30" />
    </div>
  );
}
