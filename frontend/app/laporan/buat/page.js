"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "../../../lib/api";

export default function BuatLaporanPage() {
  const router = useRouter();
  const [judul, setJudul] = useState("");
  const [kategoriId, setKategoriId] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deskripsiCount = useMemo(() => deskripsi.trim().length, [deskripsi]);

  useEffect(() => {
    let canceled = false;
    async function loadKategori() {
      try {
        const data = await apiFetch("/api/kategori");
        if (!canceled) setKategori(Array.isArray(data) ? data : data?.data || []);
      } catch {
        // ignore
      }
    }
    loadKategori();
    return () => {
      canceled = true;
    };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (deskripsi.trim().length < 50) {
        throw new Error("Deskripsi minimal 50 karakter.");
      }

      const bodyText = `Lokasi: ${lokasi}\n\nDeskripsi:\n${deskripsi}`;
      const fd = new FormData();
      fd.append("header", judul);
      fd.append("body", bodyText);
      if (kategoriId) fd.append("category_id", kategoriId);
      if (imageFile) fd.append("image", imageFile);

      await apiFetch("/api/laporan", { method: "POST", body: fd });
      router.push("/laporan/riwayat");
    } catch (err) {
      setError(err?.message || "Gagal mengirim pengaduan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Buat Pengaduan Baru
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Sampaikan pengaduan atau aspirasi Anda dengan mengisi formulir di bawah
          ini
        </p>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm text-slate-700">
        <div className="font-bold">Petunjuk Pengisian:</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Isi semua kolom dengan lengkap dan jelas</li>
          <li>Sertakan bukti foto jika memungkinkan</li>
          <li>Cantumkan lokasi kejadian dengan detail</li>
          <li>
            Deskripsi yang jelas akan mempercepat proses penanganan
          </li>
        </ul>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Judul Pengaduan <span className="text-rose-600">*</span>
          </label>
          <input
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
            placeholder="Contoh: Jalan Berlubang di Jl. Merdeka"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Kategori Pengaduan <span className="text-rose-600">*</span>
          </label>
          <select
            value={kategoriId}
            onChange={(e) => setKategoriId(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-blue-500"
          >
            <option value="">Pilih Kategori</option>
            {kategori.map((k) => (
              <option key={k.id || k._id} value={k.id || k._id}>
                {k.category_name || k.nama || k.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Lokasi Kejadian <span className="text-rose-600">*</span>
          </label>
          <input
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            required
            placeholder="Contoh: Jl. Merdeka No. 45, Jakarta Pusat"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Deskripsi Pengaduan <span className="text-rose-600">*</span>
          </label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            required
            rows={6}
            placeholder="Jelaskan pengaduan Anda dengan detail. Semakin lengkap informasi yang diberikan, akan mempermudah tim kami untuk menindaklanjuti."
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
          />
          <div className="mt-1 text-xs text-slate-500">
            Minimal 50 karakter ({deskripsiCount})
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Bukti Foto (Opsional)
          </label>
          <div className="mt-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <div className="text-sm text-slate-600">
              Klik untuk upload atau drag & drop
            </div>
            <div className="mt-1 text-xs text-slate-500">PNG, JPG hingga 5MB</div>
            <input
              type="file"
              accept="image/*"
              className="mt-4 w-full text-sm"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <div className="font-bold">Perhatian:</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">
            <li>Data yang Anda masukkan akan diproses sesuai kebijakan privasi kami</li>
            <li>Pengaduan yang tidak sesuai atau mengandung SARA akan ditolak</li>
            <li>Anda akan menerima notifikasi setiap update status pengaduan</li>
          </ul>
        </div>

        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Batal
          </Link>
          <button
            disabled={loading}
            type="submit"
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? "Mengirim..." : "Kirim Pengaduan"}
          </button>
        </div>
      </form>
    </div>
  );
}
