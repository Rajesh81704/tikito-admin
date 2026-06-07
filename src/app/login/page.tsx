"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authApi.login(email, password);
      if ("error" in res) {
        setError((res as unknown as { error: string }).error);
      } else {
        setToken(res.access_token);
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: "radial-gradient(ellipse at 30% 20%, rgba(45,107,62,0.15) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(17,37,24,0.6) 0%, transparent 50%), var(--color-pitch)",
    }}>
      <div className="w-full max-w-md mx-4 p-6 sm:p-8 rounded-2xl border border-[rgba(77,175,112,0.2)]" style={{
        background: "linear-gradient(145deg, rgba(17,37,24,0.9), rgba(10,26,15,0.8))",
      }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[var(--color-gold)] mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5">
              <path d="M6.5 21.5s1-2 5.5-2 5.5 2 5.5 2M12 3c-2 0-4 1.5-4 4s1 4 4 6c3-2 4-3 4-6s-2-4-4-4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-ivory)]" style={{ fontFamily: "var(--font-serif)" }}>
            Tikito
          </h1>
          <p className="text-xs tracking-[0.22em] uppercase text-[var(--color-gold)] mt-1 font-medium">
            Admin Panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-[rgba(192,57,43,0.12)] border border-[rgba(192,57,43,0.3)] text-sm text-[#f08070]">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-[var(--color-line)] mb-2 font-semibold">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[rgba(77,175,112,0.06)] border border-[rgba(77,175,112,0.2)] text-[var(--color-ivory)] placeholder:text-[var(--color-ivory-muted)] focus:outline-none focus:border-[var(--color-line)] transition"
              placeholder="admin@tikito.in"
              style={{ fontFamily: "var(--font-body)", fontSize: "15px" }}
            />
          </div>

          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-[var(--color-line)] mb-2 font-semibold">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[rgba(77,175,112,0.06)] border border-[rgba(77,175,112,0.2)] text-[var(--color-ivory)] placeholder:text-[var(--color-ivory-muted)] focus:outline-none focus:border-[var(--color-line)] transition"
              placeholder="••••••••"
              style={{ fontFamily: "var(--font-body)", fontSize: "15px" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-sm tracking-[0.08em] uppercase transition cursor-pointer disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, var(--color-turf), var(--color-turf-bright))",
              border: "1px solid rgba(77,175,112,0.4)",
              color: "var(--color-ivory)",
              fontFamily: "var(--font-serif)",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
