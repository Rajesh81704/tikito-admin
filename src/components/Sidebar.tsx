"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";
import {
  LayoutDashboard,
  CalendarCheck,
  Landmark,
  Users,
  Store,
  LogOut,
  Leaf,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/dashboard/turfs", label: "Turfs & Fields", icon: Landmark },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/vendors", label: "Vendors", icon: Store },
];

interface SidebarProps {
  adminName?: string;
  adminRole?: string;
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ adminName = "Admin", adminRole = "Super Admin", open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  const initials = adminName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[260px] min-h-screen flex flex-col flex-shrink-0 border-r border-[var(--color-pitch-light)]
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `} style={{
        backgroundColor: "var(--color-pitch)",
      }}>
        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.01) 60px), repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(255,255,255,0.01) 60px)",
        }} />

        {/* Logo */}
        <div className="relative px-6 pt-7 pb-5 border-b border-[var(--color-pitch-light)] flex items-start justify-between">
          <div>
            <div className="w-[42px] h-[42px] rounded-full border-[1.5px] border-[var(--color-gold)] flex items-center justify-center mb-2.5 relative">
              <div className="absolute w-[34px] h-[34px] rounded-full border border-[rgba(201,168,76,0.35)]" />
              <Leaf className="w-[18px] h-[18px] text-[var(--color-gold)]" />
            </div>
            <h1 className="text-[22px] font-bold tracking-[0.04em] text-[var(--color-ivory)] leading-none" style={{ fontFamily: "var(--font-serif)" }}>
              Tikito
            </h1>
            <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-gold)] mt-1 font-medium">
              Admin Panel
            </p>
          </div>
          {/* Mobile close button */}
          <button onClick={onClose} className="lg:hidden p-1.5 rounded hover:bg-[var(--color-pitch-light)] transition cursor-pointer relative">
            <X className="w-5 h-5 text-[var(--color-ivory-muted)]" />
          </button>
        </div>

        {/* Nav */}
        <nav className="relative flex-1 py-4">
          <div className="px-5 pb-2 text-[9px] tracking-[0.25em] uppercase text-[var(--color-ivory-muted)] opacity-50 font-semibold">
            Management
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-5 py-2.5 text-[15px] transition border-l-2 ${
                  isActive
                    ? "text-[var(--color-glow)] bg-[var(--color-pitch-mid)] border-l-[var(--color-line)]"
                    : "text-[var(--color-ivory-muted)] hover:text-[var(--color-ivory)] hover:bg-[var(--color-pitch-mid)] border-l-transparent"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="relative px-5 py-4 border-t border-[var(--color-pitch-light)]">
          <div className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0 border-[1.5px] border-[var(--color-gold)] text-[13px] font-bold text-[var(--color-gold-light)]" style={{
              backgroundColor: "var(--color-pitch-light)",
              fontFamily: "var(--font-serif)",
            }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[var(--color-ivory)] truncate" style={{ fontFamily: "var(--font-serif)" }}>
                {adminName}
              </div>
              <div className="text-[11px] text-[var(--color-ivory-muted)] tracking-[0.05em]">
                {adminRole}
              </div>
            </div>
            <button onClick={handleLogout} className="p-1.5 rounded hover:bg-[rgba(192,57,43,0.15)] transition cursor-pointer" title="Logout">
              <LogOut className="w-4 h-4 text-[var(--color-ivory-muted)] hover:text-[#f08070]" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
