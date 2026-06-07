"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-pitch)" }}>
      <div className="text-[var(--color-ivory-muted)] text-lg" style={{ fontFamily: "var(--font-body)" }}>
        Loading...
      </div>
    </div>
  );
}
