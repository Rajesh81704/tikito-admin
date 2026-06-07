"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, isAuthenticated } from "@/lib/auth";
import { authApi } from "@/lib/api";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [adminName, setAdminName] = useState("Admin");
  const [adminRole, setAdminRole] = useState("Super Admin");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const token = getToken()!;
    authApi.me(token).then((data) => {
      setAdminName(data.full_name);
      setAdminRole(data.role || "Admin");
      setReady(true);
    }).catch(() => {
      router.replace("/login");
    });
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-pitch)" }}>
        <div className="text-[var(--color-ivory-muted)] text-lg" style={{ fontFamily: "var(--font-body)" }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar adminName={adminName} adminRole={adminRole} />
      <main className="flex-1 overflow-y-auto flex flex-col" style={{
        background: "radial-gradient(ellipse at 20% 0%, rgba(45,107,62,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(17,37,24,0.6) 0%, transparent 50%), var(--color-pitch)",
      }}>
        {children}
      </main>
    </div>
  );
}
