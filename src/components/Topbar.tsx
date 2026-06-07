"use client";

import { Bell, Search, HelpCircle } from "lucide-react";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-8 py-4 flex items-center justify-between border-b border-[rgba(77,175,112,0.12)] sticky top-0 z-5 flex-shrink-0" style={{
      background: "rgba(5, 14, 8, 0.6)",
      backdropFilter: "blur(4px)",
    }}>
      <div>
        <h2 className="text-[26px] font-semibold text-[var(--color-ivory)] tracking-[0.02em]" style={{ fontFamily: "var(--font-serif)" }}>
          {title}
          {subtitle && <span className="text-[var(--color-line)] italic"> {subtitle}</span>}
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[13px] text-[var(--color-ivory-muted)] tracking-[0.06em] italic">
          {dateStr}
        </span>
        <IconButton>
          <Search className="w-3.5 h-3.5" />
        </IconButton>
        <IconButton badge>
          <Bell className="w-3.5 h-3.5" />
        </IconButton>
        <IconButton>
          <HelpCircle className="w-3.5 h-3.5" />
        </IconButton>
      </div>
    </div>
  );
}

function IconButton({ children, badge }: { children: React.ReactNode; badge?: boolean }) {
  return (
    <button className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--color-ivory-dim)] hover:bg-[rgba(77,175,112,0.15)] hover:text-[var(--color-ivory)] transition relative cursor-pointer" style={{
      background: "rgba(77,175,112,0.08)",
      border: "1px solid rgba(77,175,112,0.18)",
    }}>
      {children}
      {badge && (
        <div className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-[var(--color-gold)] rounded-full border border-[var(--color-pitch)]" />
      )}
    </button>
  );
}
