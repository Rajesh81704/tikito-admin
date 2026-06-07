"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import { adminApi, VendorRecord } from "@/lib/api";
import Topbar from "@/components/Topbar";
import { ToggleLeft, ToggleRight, Trash2, CheckCircle } from "lucide-react";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<VendorRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken()!;
    adminApi.getVendors(token).then(setVendors).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleVerify = async (id: string) => {
    const token = getToken()!;
    try {
      await adminApi.verifyVendor(token, id);
      setVendors((prev) => prev.map((v) => v.vendor_id === id ? { ...v, is_verified: true } : v));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  const handleToggle = async (vendor: VendorRecord) => {
    const token = getToken()!;
    try {
      await adminApi.toggleVendorStatus(token, vendor.vendor_id, !vendor.is_active);
      setVendors((prev) => prev.map((v) => v.vendor_id === vendor.vendor_id ? { ...v, is_active: !v.is_active } : v));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this vendor? This will cascade delete all their turfs, grounds, and slots.")) return;
    const token = getToken()!;
    try {
      await adminApi.deleteVendor(token, id);
      setVendors((prev) => prev.filter((v) => v.vendor_id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <>
      <Topbar title="Vendors" />
      <div className="p-7 flex-1">
        {/* Summary */}
        <div className="flex gap-4 mb-5">
          <MiniStat label="Total Vendors" value={vendors.length.toString()} />
          <MiniStat label="Active" value={vendors.filter((v) => v.is_active).length.toString()} />
          <MiniStat label="Verified" value={vendors.filter((v) => v.is_verified).length.toString()} />
          <MiniStat label="Pending Verification" value={vendors.filter((v) => !v.is_verified).length.toString()} />
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden" style={{
          background: "linear-gradient(145deg, rgba(17,37,24,0.85), rgba(10,26,15,0.75))",
          border: "1px solid rgba(77,175,112,0.18)",
        }}>
          <div className="px-5 py-3.5 overflow-x-auto">
            {loading ? (
              <p className="py-8 text-center text-[var(--color-ivory-muted)]">Loading...</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[rgba(77,175,112,0.6)] pb-3 font-semibold border-b border-[rgba(77,175,112,0.1)]">Name</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[rgba(77,175,112,0.6)] pb-3 font-semibold border-b border-[rgba(77,175,112,0.1)]">Phone</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[rgba(77,175,112,0.6)] pb-3 font-semibold border-b border-[rgba(77,175,112,0.1)]">Email</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[rgba(77,175,112,0.6)] pb-3 font-semibold border-b border-[rgba(77,175,112,0.1)]">Address</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[rgba(77,175,112,0.6)] pb-3 font-semibold border-b border-[rgba(77,175,112,0.1)]">Verified</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[rgba(77,175,112,0.6)] pb-3 font-semibold border-b border-[rgba(77,175,112,0.1)]">Status</th>
                    <th className="text-left text-[10px] tracking-[0.2em] uppercase text-[rgba(77,175,112,0.6)] pb-3 font-semibold border-b border-[rgba(77,175,112,0.1)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.length === 0 && (
                    <tr><td colSpan={7} className="py-8 text-center text-[var(--color-ivory-muted)] text-sm">No vendors found</td></tr>
                  )}
                  {vendors.map((v) => (
                    <tr key={v.vendor_id} className="border-b border-[rgba(77,175,112,0.06)] last:border-b-0">
                      <td className="py-3 text-[14px] text-[var(--color-ivory)] font-medium" style={{ fontFamily: "var(--font-serif)" }}>{v.vendor_full_name}</td>
                      <td className="py-3 text-[13px] text-[var(--color-ivory-dim)]">{v.vendor_phone_no || "—"}</td>
                      <td className="py-3 text-[13px] text-[var(--color-ivory-dim)]">{v.vendor_email_id || "—"}</td>
                      <td className="py-3 text-[12px] text-[var(--color-ivory-muted)] max-w-[200px] truncate">{v.vendor_address || "—"}</td>
                      <td className="py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${
                          v.is_verified
                            ? "bg-[rgba(77,175,112,0.12)] text-[var(--color-glow)] border-[rgba(77,175,112,0.25)]"
                            : "bg-[rgba(212,137,10,0.12)] text-[var(--color-gold-light)] border-[rgba(212,137,10,0.25)]"
                        }`}>
                          {v.is_verified ? "Yes" : "Pending"}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${
                          v.is_active
                            ? "bg-[rgba(77,175,112,0.12)] text-[var(--color-glow)] border-[rgba(77,175,112,0.25)]"
                            : "bg-[rgba(192,57,43,0.12)] text-[#f08070] border-[rgba(192,57,43,0.25)]"
                        }`}>
                          {v.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1.5">
                          {!v.is_verified && (
                            <button onClick={() => handleVerify(v.vendor_id)} className="p-1.5 rounded hover:bg-[rgba(77,175,112,0.12)] transition cursor-pointer" title="Verify">
                              <CheckCircle className="w-4 h-4 text-[var(--color-line)]" />
                            </button>
                          )}
                          <button onClick={() => handleToggle(v)} className="p-1.5 rounded hover:bg-[rgba(77,175,112,0.12)] transition cursor-pointer" title={v.is_active ? "Deactivate" : "Activate"}>
                            {v.is_active ? <ToggleRight className="w-4 h-4 text-[var(--color-glow)]" /> : <ToggleLeft className="w-4 h-4 text-[var(--color-ivory-muted)]" />}
                          </button>
                          <button onClick={() => handleDelete(v.vendor_id)} className="p-1.5 rounded hover:bg-[rgba(192,57,43,0.15)] transition cursor-pointer" title="Delete">
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
