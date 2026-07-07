"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import StatusBadge from "../../../components/StatusBadge";
import { apiFetch } from "../../../lib/api";

function toStatusLabel(status) {
  if (!status) return "Pending";
  const val = String(status).toLowerCase();
  if (val.includes("proses")) return "Diproses";
  if (val.includes("selesai")) return "Selesai";
  if (val.includes("tolak")) return "Ditolak";
  if (val.includes("pending") || val.includes("tunggu")) return "Pending";
  return status;
}

export default function AdminPengaduanPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [kategori, setKategori] = useState("");

  useEffect(() => {
    let canceled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch("/api/laporan");
        if (!canceled) setItems(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        if (!canceled) setError(err?.message || "Gagal memuat data.");
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    load();
    return () => {
      canceled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    items.forEach((i) => {
      if (i?.category_name) set.add(i.category_name);
    });
    return Array.from(set);
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const title = String(i?.header || "").toLowerCase();
      const pelapor = String(i?.username || "").toLowerCase();
      const hitQ = !q || title.includes(q.toLowerCase()) || pelapor.includes(q.toLowerCase());
      const hitStatus = !status || toStatusLabel(i?.status) === status;
      const hitKategori = !kategori || i?.category_name === kategori;
      return hitQ && hitStatus && hitKategori;
    });
  }, [items, q, status, kategori]);

  return (
    <div>
      <div className="mb-5">
        <div className="text-2xl font-extrabold text-slate-900">Kelola Pengaduan</div>
        <div className="mt-1 text-sm text-slate-600">
          Pantau dan kelola semua pengaduan masyarakat
        </div>
      </div>

      <div className="card p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari pengaduan, pelapor..."
            className="input"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input">
            <option value="">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
            <option value="Ditolak">Ditolak</option>
          </select>
          <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="input">
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 card">
        <div className="border-b border-slate-200 px-6 py-4 text-sm text-slate-600">
          Menampilkan {filtered.length} dari {items.length} pengaduan
        </div>

        {loading ? (
          <div className="px-6 py-10 text-sm text-slate-600">Memuat...</div>
        ) : error ? (
          <div className="px-6 py-6 text-sm text-rose-700">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3">Pelapor</th>
                  <th className="px-6 py-3">Judul Pengaduan</th>
                  <th className="px-6 py-3">Kategori</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{r.username}</div>
                      <div className="text-xs text-slate-500">{r.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{r.header}</div>
                      <div className="mt-1 max-w-md truncate text-xs text-slate-500">
                        {r.body || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                        {r.category_name || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{r.created_at || "-"}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={toStatusLabel(r.status)} />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/pengaduan/${r.id}`}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

