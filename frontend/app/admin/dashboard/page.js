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

function StatCard({ label, value, sub, tone }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
          <span className="text-xs font-extrabold">SP</span>
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-extrabold text-slate-900">{value}</div>
          <div className="text-xs text-slate-600">{label}</div>
          {sub ? <div className="mt-1 text-[11px] text-slate-500">{sub}</div> : null}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const stats = useMemo(() => {
    const total = items.length;
    const pending = items.filter((i) => toStatusLabel(i?.status) === "Pending").length;
    const diproses = items.filter((i) => toStatusLabel(i?.status) === "Diproses").length;
    const selesai = items.filter((i) => toStatusLabel(i?.status) === "Selesai").length;
    const ditolak = items.filter((i) => toStatusLabel(i?.status) === "Ditolak").length;
    return { total, pending, diproses, selesai, ditolak };
  }, [items]);

  return (
    <div>
      <div className="mb-5">
        <div className="text-2xl font-extrabold text-slate-900">Dashboard Admin</div>
        <div className="mt-1 text-sm text-slate-600">
          Ringkasan dan analisis pengaduan masyarakat
        </div>
      </div>

      {loading ? (
        <div className="card p-6 text-sm text-slate-600">Memuat...</div>
      ) : error ? (
        <div className="card p-6 text-sm text-rose-700">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label="Total Pengaduan" value={stats.total} tone="bg-blue-50 text-blue-700" />
            <StatCard label="Menunggu" value={stats.pending} tone="bg-amber-50 text-amber-700" />
            <StatCard label="Diproses" value={stats.diproses} tone="bg-sky-50 text-sky-700" />
            <StatCard label="Selesai" value={stats.selesai} tone="bg-emerald-50 text-emerald-700" />
            <StatCard label="Ditolak" value={stats.ditolak} tone="bg-rose-50 text-rose-700" />
          </div>

          <div className="mt-6 card">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div className="text-sm font-extrabold text-slate-900">Pengaduan Terbaru</div>
              <Link href="/admin/pengaduan" className="text-sm text-blue-700">
                Lihat Semua →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Pelapor</th>
                    <th className="px-6 py-3">Judul</th>
                    <th className="px-6 py-3">Kategori</th>
                    <th className="px-6 py-3">Tanggal</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.slice(0, 5).map((r) => (
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
                          className="font-semibold text-blue-700 hover:underline"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
