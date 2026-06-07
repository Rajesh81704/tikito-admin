"use client";

export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-[rgba(77,175,112,0.06)]">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3 pr-4">
          <div className="h-4 rounded bg-[rgba(77,175,112,0.08)] animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
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
      background: "linear-gradient(145deg, rgba(17,37,24,0.9), rgba(10,26,15,0.8))",
      border: "1px solid rgba(77,175,112,0.15)",
    }}>
      <div className="h-4 w-24 rounded bg-[rgba(77,175,112,0.1)] mb-3" />
      <div className="h-6 w-32 rounded bg-[rgba(77,175,112,0.08)] mb-2" />
      <div className="h-3 w-20 rounded bg-[rgba(77,175,112,0.06)] mb-4" />
      <div className="h-3 w-full rounded bg-[rgba(77,175,112,0.06)] mb-2" />
      <div className="h-3 w-3/4 rounded bg-[rgba(77,175,112,0.06)]" />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-xl p-4 sm:p-5 animate-pulse" style={{
      background: "linear-gradient(145deg, rgba(17,37,24,0.9), rgba(10,26,15,0.8))",
      border: "1px solid rgba(77,175,112,0.15)",
    }}>
      <div className="h-3 w-20 rounded bg-[rgba(77,175,112,0.1)] mb-3" />
      <div className="h-8 w-16 rounded bg-[rgba(77,175,112,0.08)] mb-2" />
      <div className="h-3 w-24 rounded bg-[rgba(77,175,112,0.06)]" />
    </div>
  );
}
