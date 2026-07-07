"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconCheck } from "../../components/Icons";
import { register } from "../../lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi password tidak sama.");
      return;
    }
    if (!agree) {
      setError("Anda harus menyetujui syarat & ketentuan.");
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      router.push("/login");
    } catch (err) {
      setError(err?.message || "Registrasi gagal. Coba lagi.");
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
              Daftar Sekarang
            </h1>
            <p className="mt-3 text-sm text-white/85">
              Bergabunglah dengan ribuan warga yang telah menyampaikan aspirasi
              dan pengaduan melalui platform kami.
            </p>
          </div>

          <div className="mt-10 rounded-2xl bg-blue-600/25 p-5 text-sm text-white/90">
            <div className="font-extrabold">Keuntungan Mendaftar:</div>
            <ul className="mt-3 space-y-2">
              {[
                "Sampaikan pengaduan kapan saja, di mana saja",
                "Pantau status pengaduan secara real-time",
                "Berkomunikasi langsung dengan petugas",
                "Riwayat pengaduan tersimpan dengan aman",
                "Gratis tanpa biaya apapun",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                    <IconCheck className="h-4 w-4" />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-10">
          <h2 className="text-2xl font-extrabold text-slate-900">Buat Akun Baru</h2>
          <p className="mt-1 text-sm text-slate-600">
            Isi data diri Anda untuk mendaftar
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Nama Lengkap
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                required
                className="input mt-1"
              />
            </div>
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
                placeholder="Minimal 6 karakter"
                required
                className="input mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Konfirmasi Password
              </label>
              <input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                type="password"
                placeholder="Ulangi password"
                required
                className="input mt-1"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              Saya menyetujui Syarat dan Ketentuan serta Kebijakan Privasi
            </label>

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
              {loading ? "Memproses..." : "Daftar"}
            </button>

            <div className="text-center text-sm text-slate-600">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-semibold text-blue-700">
                Masuk di sini
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
