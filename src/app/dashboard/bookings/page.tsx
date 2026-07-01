"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import { adminApi, BookingRecord } from "@/lib/api";
import Topbar from "@/components/Topbar";
import { useDashboardContext } from "../layout";
import { SkeletonTable } from "@/components/SkeletonRow";
import { XCircle, Trash2 } from "lucide-react";

export default function BookingsPage() {
  const { onMenuClick } = useDashboardContext();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    const token = getToken()!;
    adminApi.getBookings(token).then(setBookings).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" ? bookings : bookings.filter((b) => b.booking_status === filter);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this booking?")) return;
    const token = getToken()!;
    try {
      await adminApi.cancelBooking(token, id);
      setBookings((prev) => prev.map((b) => b.booking_id === id ? { ...b, booking_status: "CANCELLED" } : b));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this booking?")) return;
    const token = getToken()!;
    try {
      await adminApi.deleteBooking(token, id);
      setBookings((prev) => prev.filter((b) => b.booking_id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <>
      <Topbar title="Bookings" onMenuClick={onMenuClick} />
      <div className="p-4 sm:p-7 flex-1">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          {["ALL", "CONFIRMED", "PENDING", "CANCELLED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] tracking-[0.08em] uppercase font-semibold transition cursor-pointer border ${
                filter === f
                  ? "bg-[var(--color-pitch-mid)] text-[var(--color-glow)] border-[var(--color-pitch-light)]"
                  : "bg-transparent text-[var(--color-ivory-muted)] border-[rgba(255,255,255,0.08)] hover:border-[var(--color-pitch-light)]"
              }`}
            >
              {f === "ALL" ? "All" : f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden" style={{
          background: "linear-gradient(145deg, var(--color-pitch-mid), var(--color-pitch))",
          border: "1px solid var(--color-pitch-light)",
        }}>
          <div className="px-5 py-3.5 overflow-x-auto">
            {loading ? (
              <table className="w-full border-collapse min-w-[800px]">
                <SkeletonTable rows={8} cols={8} />
              </table>
            ) : (
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[var(--color-ivory-muted)] pb-3 font-semibold border-b border-[rgba(255,255,255,0.1)]">Guest</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[var(--color-ivory-muted)] pb-3 font-semibold border-b border-[rgba(255,255,255,0.1)]">Turf / Ground</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[var(--color-ivory-muted)] pb-3 font-semibold border-b border-[rgba(255,255,255,0.1)]">Date</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[var(--color-ivory-muted)] pb-3 font-semibold border-b border-[rgba(255,255,255,0.1)]">Slot</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[var(--color-ivory-muted)] pb-3 font-semibold border-b border-[rgba(255,255,255,0.1)]">Amount</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[var(--color-ivory-muted)] pb-3 font-semibold border-b border-[rgba(255,255,255,0.1)]">Payment</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[var(--color-ivory-muted)] pb-3 font-semibold border-b border-[rgba(255,255,255,0.1)]">Status</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[var(--color-ivory-muted)] pb-3 font-semibold border-b border-[rgba(255,255,255,0.1)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="py-8 text-center text-[var(--color-ivory-muted)] text-sm">No bookings found</td></tr>
                  )}
                  {filtered.map((b) => (
                    <tr key={b.booking_id} className="border-b border-[rgba(255,255,255,0.05)] last:border-b-0">
                      <td className="py-3 text-[14px] text-[var(--color-ivory)] font-medium" style={{ fontFamily: "var(--font-serif)" }}>
                        {b.user_name || "—"}
                        <div className="text-[11px] text-[var(--color-ivory-muted)] font-normal">{b.user_phone || ""}</div>
                      </td>
                      <td className="py-3 text-[13px] text-[var(--color-line)]">
                        {b.turf_name}
                        <div className="text-[11px] text-[var(--color-ivory-muted)]">{b.ground_name}</div>
                      </td>
                      <td className="py-3 text-[12px] text-[var(--color-ivory-dim)]">{b.booking_date}</td>
                      <td className="py-3 text-[12px] text-[var(--color-ivory-dim)]">{b.start_time?.slice(0, 5)} – {b.end_time?.slice(0, 5)}</td>
                      <td className="py-3 text-[14px] font-semibold text-[var(--color-ivory)]" style={{ fontFamily: "var(--font-serif)" }}>₹{Number(b.price).toLocaleString("en-IN")}</td>
                      <td className="py-3"><StatusPill status={b.payment_status} /></td>
                      <td className="py-3"><StatusPill status={b.booking_status} /></td>
                      <td className="py-3">
                        <div className="flex gap-1.5">
                          {b.booking_status !== "CANCELLED" && (
                            <button onClick={() => handleCancel(b.booking_id)} className="p-1.5 rounded hover:bg-[rgba(212,137,10,0.15)] transition cursor-pointer" title="Cancel">
                              <XCircle className="w-4 h-4 text-[var(--color-amber)]" />
                            </button>
                          )}
                          <button onClick={() => handleDelete(b.booking_id)} className="p-1.5 rounded hover:bg-[rgba(192,57,43,0.15)] transition cursor-pointer" title="Delete">
                            <Trash2 className="w-4 h-4 text-[#f08070]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    CONFIRMED: "bg-[rgba(255,255,255,0.05)] text-[var(--color-glow)] border-[rgba(255,255,255,0.1)]",
    PENDING: "bg-[rgba(212,137,10,0.12)] text-[var(--color-gold-light)] border-[rgba(212,137,10,0.25)]",
    CANCELLED: "bg-[rgba(192,57,43,0.12)] text-[#f08070] border-[rgba(192,57,43,0.25)]",
    COMPLETED: "bg-[rgba(26,111,168,0.12)] text-[#7ec8f0] border-[rgba(26,111,168,0.25)]",
    PAID: "bg-[rgba(255,255,255,0.05)] text-[var(--color-glow)] border-[rgba(255,255,255,0.1)]",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-[0.06em] uppercase border ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
}
