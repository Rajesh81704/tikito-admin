"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import { adminApi, BookingRecord } from "@/lib/api";
import Topbar from "@/components/Topbar";
import { useDashboardContext } from "./layout";
import {
  TrendingUp,
  CalendarCheck,
  Landmark,
  Users,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface DashboardStats {
  total_users: number;
  total_vendors: number;
  total_turfs: number;
  total_grounds: number;
  total_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  total_revenue: number;
}

export default function DashboardPage() {
  const { onMenuClick } = useDashboardContext();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken()!;
    Promise.all([
      adminApi.dashboard(token),
      adminApi.getBookings(token),
    ]).then(([dashData, bookData]) => {
      setStats(dashData);
      setBookings(bookData.slice(0, 6));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <>
        <Topbar title="Dashboard" onMenuClick={onMenuClick} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[var(--color-ivory-muted)]">Loading dashboard...</p>
        </div>
      </>
    );
  }

  const statCards = [
    { label: "Total Revenue", value: `₹${Number(stats.total_revenue).toLocaleString("en-IN")}`, sub: "All confirmed bookings", icon: TrendingUp, gold: true, trend: "+18.4%", trendUp: true },
    { label: "Total Bookings", value: stats.total_bookings.toString(), sub: `${stats.confirmed_bookings} confirmed`, icon: CalendarCheck, gold: false, trend: `${stats.cancelled_bookings} cancelled`, trendUp: false },
    { label: "Turfs & Grounds", value: `${stats.total_turfs}`, sub: `${stats.total_grounds} grounds`, icon: Landmark, gold: false, trend: null, trendUp: false },
    { label: "Users & Vendors", value: stats.total_users.toString(), sub: `${stats.total_vendors} vendors`, icon: Users, gold: false, trend: null, trendUp: false },
  ];

  return (
    <>
      <Topbar title="Good Morning," subtitle="Admin" onMenuClick={onMenuClick} />
      <div className="p-4 sm:p-7 flex-1">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-7">
          {statCards.map((card, i) => (
            <div
              key={i}
              className={`rounded-xl p-4 sm:p-5 relative overflow-hidden transition hover:border-[rgba(77,175,112,0.4)] ${
                card.gold ? "border-[rgba(201,168,76,0.25)]" : "border-[rgba(77,175,112,0.2)]"
              }`}
              style={{
                background: "linear-gradient(145deg, rgba(17,37,24,0.9), rgba(10,26,15,0.8))",
                border: `1px solid ${card.gold ? "rgba(201,168,76,0.25)" : "rgba(77,175,112,0.2)"}`,
              }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-[80px] hidden sm:block" style={{
                background: card.gold ? "rgba(201,168,76,0.06)" : "rgba(77,175,112,0.05)",
                borderRadius: "0 12px 0 80px",
              }} />
              <div className={`flex items-center gap-1.5 text-[11px] sm:text-[13px] tracking-[0.15em] uppercase mb-2 sm:mb-2.5 font-medium ${card.gold ? "text-[var(--color-gold)]" : "text-[var(--color-line)]"}`}>
                <card.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="truncate">{card.label}</span>
              </div>
              <div className="text-[22px] sm:text-[34px] font-bold text-[var(--color-ivory)] leading-none tracking-tight mb-1 sm:mb-1.5" style={{ fontFamily: "var(--font-serif)" }}>
                {card.value}
              </div>
              <div className="text-[11px] sm:text-[12px] text-[var(--color-ivory-muted)] tracking-[0.04em]">
                {card.sub}
              </div>
              {card.trend && (
                <div className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] mt-2 px-2 py-0.5 rounded-full font-semibold ${
                  card.trendUp ? "bg-[rgba(77,175,112,0.12)] text-[var(--color-glow)]" : "bg-[rgba(192,57,43,0.12)] text-[#f08070]"
                }`}>
                  {card.trendUp ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                  {card.trend}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="rounded-xl overflow-hidden" style={{
          background: "linear-gradient(145deg, rgba(17,37,24,0.85), rgba(10,26,15,0.75))",
          border: "1px solid rgba(77,175,112,0.18)",
        }}>
          <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-[rgba(77,175,112,0.12)] flex items-center justify-between">
            <h3 className="text-[15px] sm:text-[17px] font-semibold text-[var(--color-ivory)] tracking-[0.03em]" style={{ fontFamily: "var(--font-serif)" }}>
              Recent Bookings
            </h3>
            <a href="/dashboard/bookings" className="text-[11px] tracking-[0.12em] uppercase text-[var(--color-line)] font-semibold hover:text-[var(--color-glow)] transition">
              View All →
            </a>
          </div>
          <div className="px-4 sm:px-5 py-3.5 overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[rgba(77,175,112,0.6)] pb-3 font-semibold border-b border-[rgba(77,175,112,0.1)]">Guest</th>
                  <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[rgba(77,175,112,0.6)] pb-3 font-semibold border-b border-[rgba(77,175,112,0.1)]">Field</th>
                  <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[rgba(77,175,112,0.6)] pb-3 font-semibold border-b border-[rgba(77,175,112,0.1)]">Slot</th>
                  <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[rgba(77,175,112,0.6)] pb-3 font-semibold border-b border-[rgba(77,175,112,0.1)]">Amount</th>
                  <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[rgba(77,175,112,0.6)] pb-3 font-semibold border-b border-[rgba(77,175,112,0.1)]">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[var(--color-ivory-muted)] text-sm">No bookings yet</td>
                  </tr>
                )}
                {bookings.map((b) => (
                  <tr key={b.booking_id} className="border-b border-[rgba(77,175,112,0.06)] last:border-b-0">
                    <td className="py-3 text-[14px] text-[var(--color-ivory)] font-medium" style={{ fontFamily: "var(--font-serif)" }}>
                      {b.user_name || "Unknown"}
                    </td>
                    <td className="py-3 text-[13px] text-[var(--color-line)]">
                      {b.turf_name} · {b.ground_name}
                    </td>
                    <td className="py-3 text-[12px] text-[var(--color-ivory-dim)]">
                      {b.start_time?.slice(0, 5)} – {b.end_time?.slice(0, 5)}
                    </td>
                    <td className="py-3 text-[14px] font-semibold text-[var(--color-ivory)]" style={{ fontFamily: "var(--font-serif)" }}>
                      ₹{Number(b.price).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3">
                      <StatusPill status={b.booking_status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    CONFIRMED: "bg-[rgba(77,175,112,0.12)] text-[var(--color-glow)] border-[rgba(77,175,112,0.25)]",
    PENDING: "bg-[rgba(212,137,10,0.12)] text-[var(--color-gold-light)] border-[rgba(212,137,10,0.25)]",
    CANCELLED: "bg-[rgba(192,57,43,0.12)] text-[#f08070] border-[rgba(192,57,43,0.25)]",
    COMPLETED: "bg-[rgba(26,111,168,0.12)] text-[#7ec8f0] border-[rgba(26,111,168,0.25)]",
  };

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-[0.06em] uppercase border ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
}
