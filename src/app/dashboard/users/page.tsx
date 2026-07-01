"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import { adminApi, UserRecord } from "@/lib/api";
import Topbar from "@/components/Topbar";
import { useDashboardContext } from "../layout";
import { SkeletonTable } from "@/components/SkeletonRow";
import { ToggleLeft, ToggleRight, Trash2 } from "lucide-react";

export default function UsersPage() {
  const { onMenuClick } = useDashboardContext();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken()!;
    adminApi.getUsers(token).then(setUsers).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleToggle = async (user: UserRecord) => {
    const token = getToken()!;
    try {
      await adminApi.toggleUserStatus(token, user.user_id, !user.is_active);
      setUsers((prev) => prev.map((u) => u.user_id === user.user_id ? { ...u, is_active: !u.is_active } : u));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this user?")) return;
    const token = getToken()!;
    try {
      await adminApi.deleteUser(token, id);
      setUsers((prev) => prev.filter((u) => u.user_id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <>
      <Topbar title="Users" onMenuClick={onMenuClick} />
      <div className="p-4 sm:p-7 flex-1">
        {/* Summary */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-5">
          <MiniStat label="Total Users" value={users.length.toString()} />
          <MiniStat label="Active" value={users.filter((u) => u.is_active).length.toString()} />
          <MiniStat label="Verified" value={users.filter((u) => u.is_verified).length.toString()} />
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden" style={{
          background: "var(--color-pitch-mid)",
          border: "1px solid var(--color-pitch-light)",
        }}>
          <div className="px-5 py-3.5 overflow-x-auto">
            {loading ? (
              <table className="w-full border-collapse">
                <SkeletonTable rows={8} cols={7} />
              </table>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[var(--color-ivory-muted)] pb-3 font-semibold border-b border-[var(--color-pitch-light)]">Name</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[var(--color-ivory-muted)] pb-3 font-semibold border-b border-[var(--color-pitch-light)]">Phone</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[var(--color-ivory-muted)] pb-3 font-semibold border-b border-[var(--color-pitch-light)]">Email</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[var(--color-ivory-muted)] pb-3 font-semibold border-b border-[var(--color-pitch-light)]">Verified</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[var(--color-ivory-muted)] pb-3 font-semibold border-b border-[var(--color-pitch-light)]">Status</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[var(--color-ivory-muted)] pb-3 font-semibold border-b border-[var(--color-pitch-light)]">Joined</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[var(--color-ivory-muted)] pb-3 font-semibold border-b border-[var(--color-pitch-light)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 && (
                    <tr><td colSpan={7} className="py-8 text-center text-[var(--color-ivory-muted)] text-sm">No users found</td></tr>
                  )}
                  {users.map((u) => (
                    <tr key={u.user_id} className="border-b border-[var(--color-pitch-light)] opacity-80 last:border-b-0 last:opacity-100">
                      <td className="py-3 text-[14px] text-[var(--color-ivory)] font-medium" style={{ fontFamily: "var(--font-serif)" }}>{u.full_name}</td>
                      <td className="py-3 text-[13px] text-[var(--color-ivory-dim)]">{u.phone_no}</td>
                      <td className="py-3 text-[13px] text-[var(--color-ivory-dim)]">{u.email || "—"}</td>
                      <td className="py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${
                          u.is_verified
                            ? "bg-[rgba(34,197,94,0.12)] text-[var(--color-turf-bright)] border-[rgba(34,197,94,0.25)]"
                            : "bg-[rgba(201,168,76,0.12)] text-[var(--color-gold-light)] border-[rgba(201,168,76,0.25)]"
                        }`}>
                          {u.is_verified ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${
                          u.is_active
                            ? "bg-[rgba(34,197,94,0.12)] text-[var(--color-turf-bright)] border-[rgba(34,197,94,0.25)]"
                            : "bg-[rgba(239,68,68,0.12)] text-[var(--color-red)] border-[rgba(239,68,68,0.25)]"
                        }`}>
                          {u.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 text-[12px] text-[var(--color-ivory-muted)]">{new Date(u.created_at).toLocaleDateString("en-IN")}</td>
                      <td className="py-3">
                        <div className="flex gap-1.5">
                          <button onClick={() => handleToggle(u)} className="p-1.5 rounded hover:bg-[var(--color-pitch-light)] transition cursor-pointer" title={u.is_active ? "Deactivate" : "Activate"}>
                            {u.is_active ? <ToggleRight className="w-4 h-4 text-[var(--color-turf-bright)]" /> : <ToggleLeft className="w-4 h-4 text-[var(--color-ivory-muted)]" />}
                          </button>
                          <button onClick={() => handleDelete(u.user_id)} className="p-1.5 rounded hover:bg-[rgba(239,68,68,0.15)] transition cursor-pointer" title="Delete">
                            <Trash2 className="w-4 h-4 text-[var(--color-red)]" />
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

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3 rounded-lg" style={{
      background: "var(--color-pitch-mid)",
      border: "1px solid var(--color-pitch-light)",
    }}>
      <div className="text-[10px] tracking-[0.15em] uppercase text-[var(--color-ivory-muted)] font-medium mb-1 opacity-70">{label}</div>
      <div className="text-[22px] font-bold text-[var(--color-ivory)]" style={{ fontFamily: "var(--font-serif)" }}>{value}</div>
    </div>
  );
}
