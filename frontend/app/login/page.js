"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconCheck } from "../../components/Icons";
import { login } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login({ email, password, remember });
      const role = data?.user?.role;
      if (role === "admin" || role === "super admin") router.push("/admin/dashboard");
      else router.push("/dashboard");
    } catch (err) {
      setError(err?.message || "Login gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-800 via-blue-700 to-blue-900 px-4 py-10">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-2">
        <div className="relative bg-linear-to-b from-blue-700 to-blue-900 p-10 text-white">
          <Link href="/" className="text-sm text-white/90 hover:text-white">
            ← Kembali ke Beranda
          </Link>

          <div className="mt-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-700 text-lg font-extrabold">
              SP
            </div>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight">
              Sistem Pengaduan <br />
              Masyarakat
            </h1>
            <p className="mt-3 text-sm text-white/85">
              Masuk ke akun Anda untuk menyampaikan pengaduan dan memantau status
              laporan yang telah disampaikan.
            </p>
          </div>

          <div className="mt-10 space-y-4 text-sm text-white/90">
            {[
              {
                t: "Mudah & Cepat",
                d: "Sampaikan pengaduan dalam hitungan menit",
              },
              {
                t: "Transparan",
                d: "Pantau progres pengaduan secara real-time",
              },
              { t: "Aman & Terpercaya", d: "Data Anda dijamin keamanannya" },
            ].map((x) => (
              <div key={x.t} className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                  <IconCheck className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-bold">{x.t}</div>
                  <div className="text-xs text-white/75">{x.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-10">
          <h2 className="text-2xl font-extrabold text-slate-900">Masuk ke Akun</h2>
          <p className="mt-1 text-sm text-slate-600">
            Silakan masukkan kredensial Anda
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="nama@email.com"
                required
                className="input mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                required
                className="input mt-1"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                ingat saya
              </label>
              <button
                type="button"
                className="text-blue-700 hover:underline"
                onClick={() => alert("Fitur lupa password belum dibuat.")}
              >
                Lupa password?
              </button>
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              disabled={loading}
              className="btn-primary w-full py-3"
              type="submit"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>

            <div className="text-center text-sm text-slate-600">
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-blue-700">
                Daftar Sekarang
              </Link>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <div className="text-center text-xs text-slate-500">
                Dengan masuk, Anda menyetujui kebijakan layanan.
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
