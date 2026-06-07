"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import { adminApi, TurfRecord } from "@/lib/api";
import Topbar from "@/components/Topbar";
import { useDashboardContext } from "../layout";
import { SkeletonCard } from "@/components/SkeletonRow";
import { ToggleLeft, ToggleRight, Trash2 } from "lucide-react";

export default function TurfsPage() {
  const { onMenuClick } = useDashboardContext();
  const [turfs, setTurfs] = useState<TurfRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken()!;
    adminApi.getTurfs(token).then(setTurfs).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleToggle = async (turf: TurfRecord) => {
    const token = getToken()!;
    try {
      await adminApi.toggleTurfStatus(token, turf.turf_field_id, !turf.is_active);
      setTurfs((prev) => prev.map((t) => t.turf_field_id === turf.turf_field_id ? { ...t, is_active: !t.is_active } : t));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this turf? This will cascade delete all grounds, slots, and related bookings.")) return;
    const token = getToken()!;
    try {
      await adminApi.deleteTurf(token, id);
      setTurfs((prev) => prev.filter((t) => t.turf_field_id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <>
      <Topbar title="Turfs & Fields" onMenuClick={onMenuClick} />
      <div className="p-4 sm:p-7 flex-1">
        {/* Summary */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-5">
          <MiniStat label="Total Turfs" value={turfs.length.toString()} />
          <MiniStat label="Active" value={turfs.filter((t) => t.is_active).length.toString()} />
          <MiniStat label="Total Grounds" value={turfs.reduce((acc, t) => acc + (t.no_of_grounds || 0), 0).toString()} />
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          {!loading && turfs.length === 0 && <p className="col-span-full text-center text-[var(--color-ivory-muted)] py-8">No turfs found</p>}
          {turfs.map((t) => (
            <div key={t.turf_field_id} className="rounded-xl p-5 relative overflow-hidden transition hover:border-[rgba(77,175,112,0.4)]" style={{
              background: "linear-gradient(145deg, rgba(17,37,24,0.9), rgba(10,26,15,0.8))",
              border: `1px solid ${t.is_active ? "rgba(77,175,112,0.2)" : "rgba(192,57,43,0.2)"}`,
            }}>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-[16px] font-semibold text-[var(--color-ivory)]" style={{ fontFamily: "var(--font-serif)" }}>
                    {t.turf_name}
                  </h4>
                  <p className="text-[12px] text-[var(--color-ivory-muted)] mt-0.5">
                    by {t.vendor_full_name}
                  </p>
                </div>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${
                  t.is_active
                    ? "bg-[rgba(77,175,112,0.12)] text-[var(--color-glow)] border-[rgba(77,175,112,0.25)]"
                    : "bg-[rgba(192,57,43,0.12)] text-[#f08070] border-[rgba(192,57,43,0.25)]"
                }`}>
                  {t.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-1.5 mb-4">
                {t.turf_location && (
                  <p className="text-[12px] text-[var(--color-line)]">📍 {t.turf_location}</p>
                )}
                {t.turf_address && (
                  <p className="text-[12px] text-[var(--color-ivory-muted)]">{t.turf_address}</p>
                )}
                <p className="text-[12px] text-[var(--color-ivory-dim)]">
                  {t.no_of_grounds || 0} grounds · Created {new Date(t.created_at).toLocaleDateString("en-IN")}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-[rgba(77,175,112,0.1)]">
                <button onClick={() => handleToggle(t)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-[0.06em] transition cursor-pointer" style={{
                  background: "rgba(77,175,112,0.08)",
                  border: "1px solid rgba(77,175,112,0.18)",
                  color: t.is_active ? "var(--color-glow)" : "var(--color-ivory-muted)",
                }}>
                  {t.is_active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                  {t.is_active ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => handleDelete(t.turf_field_id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-[0.06em] transition cursor-pointer" style={{
                  background: "rgba(192,57,43,0.08)",
                  border: "1px solid rgba(192,57,43,0.18)",
                  color: "#f08070",
                }}>
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3 rounded-lg" style={{
      background: "linear-gradient(145deg, rgba(17,37,24,0.9), rgba(10,26,15,0.8))",
      border: "1px solid rgba(77,175,112,0.2)",
    }}>
      <div className="text-[10px] tracking-[0.15em] uppercase text-[var(--color-line)] font-medium mb-1">{label}</div>
      <div className="text-[22px] font-bold text-[var(--color-ivory)]" style={{ fontFamily: "var(--font-serif)" }}>{value}</div>
    </div>
  );
}
