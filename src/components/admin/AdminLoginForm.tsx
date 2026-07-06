"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { brand, barlow } from "@/lib/brand";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");
      localStorage.setItem("adminToken", data.token);
      router.push("/admin/panel");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-20">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl p-8" style={{ background: brand.card, border: `1px solid ${brand.goldMuted}` }}>
        <h1 className="mb-6 text-center text-xl font-black uppercase tracking-[0.15em]" style={{ fontFamily: barlow, color: brand.gold }}>
          Admin Login
        </h1>
        <input className="admin-input mb-4" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input className="admin-input mb-4" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="mb-4 text-center text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-xs font-black uppercase tracking-[0.16em]"
          style={{ fontFamily: barlow, background: brand.gold, color: brand.bg, borderRadius: 4 }}
        >
          {loading ? "…" : "Login"}
        </button>
      </form>
    </div>
  );
}
