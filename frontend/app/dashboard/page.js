"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import StatusBadge from "../../components/StatusBadge";
import { apiFetch } from "../../lib/api";
import { getProfile } from "../../lib/auth";

function toStatusLabel(status) {
  if (!status) return "Pending";
  const val = String(status).toLowerCase();
  if (val.includes("proses")) return "Diproses";
  if (val.includes("selesai")) return "Selesai";
  if (val.includes("tolak")) return "Ditolak";
  if (val.includes("pending") || val.includes("tunggu")) return "Pending";
  return status;
}

function extractLokasi(bodyText) {
  if (!bodyText) return "-";
  const text = String(bodyText);
  const match = text.match(/^\s*Lokasi:\s*(.+)\s*$/m);
  return match?.[1]?.trim() || "-";
}

function StatCard({ label, value, tone }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
          <span className="text-xs font-extrabold">SP</span>
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-extrabold text-slate-900">{value}</div>
          <div className="text-xs text-slate-600">{label}</div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const stats = useMemo(() => {
    const total = items.length;
    const pending = items.filter((i) => toStatusLabel(i?.status) === "Pending")
      .length;
    const diproses = items.filter(
      (i) => toStatusLabel(i?.status) === "Diproses",
    ).length;
    const selesai = items.filter((i) => toStatusLabel(i?.status) === "Selesai")
      .length;
    const ditolak = items.filter((i) => toStatusLabel(i?.status) === "Ditolak")
      .length;
    return { total, pending, diproses, selesai, ditolak };
  }, [items]);

  useEffect(() => {
    let canceled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [p, laporan] = await Promise.all([
          getProfile(),
          apiFetch("/api/laporan"),
        ]);
        if (canceled) return;
        setProfile(p);
        setItems(Array.isArray(laporan) ? laporan : laporan?.data || []);
      } catch (err) {
        if (canceled) return;
        setError(err?.message || "Gagal memuat data dashboard.");
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    load();
    return () => {
      canceled = true;
    };
  }, []);

  return (
    <div className="bg-slate-50">
      <div className="container-page py-8">
        <div className="rounded-2xl bg-blue-600 px-7 py-7 text-white shadow-sm">
          <div className="text-2xl font-extrabold">
            Selamat Datang{profile?.username ? `, ${profile.username}` : ""}!
          </div>
          <div className="mt-1 text-sm text-white/85">
            Pantau status pengaduan Anda atau sampaikan pengaduan baru melalui
            dashboard ini.
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Total Pengaduan"
            value={stats.total}
            tone="bg-blue-50 text-blue-700"
          />
          <StatCard
            label="Menunggu"
            value={stats.pending}
            tone="bg-amber-50 text-amber-700"
          />
          <StatCard
            label="Diproses"
            value={stats.diproses}
            tone="bg-sky-50 text-sky-700"
          />
          <StatCard
            label="Selesai"
            value={stats.selesai}
            tone="bg-emerald-50 text-emerald-700"
          />
          <StatCard
            label="Ditolak"
            value={stats.ditolak}
            tone="bg-rose-50 text-rose-700"
          />
        </div>

        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-extrabold text-slate-900">
                Ada Pengaduan Baru?
              </div>
              <div className="text-sm text-slate-600">
                Sampaikan keluhan atau aspirasi Anda kepada pemerintah kota
              </div>
            </div>
            <Link href="/laporan/buat" className="btn-primary">
              Buat Pengaduan
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div className="text-base font-extrabold text-slate-900">
              Pengaduan Terbaru
            </div>
            <Link href="/laporan/riwayat" className="text-sm text-blue-700">
              Lihat Semua →
            </Link>
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
                    <th className="px-6 py-3">Judul Pengaduan</th>
                    <th className="px-6 py-3">Kategori</th>
                    <th className="px-6 py-3">Lokasi</th>
                    <th className="px-6 py-3">Tanggal</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.slice(0, 3).map((row) => (
                    <tr key={row?.id || row?._id}>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">
                          {row?.header || row?.judul || row?.title || "-"}
                        </div>
                        <div className="mt-1 max-w-md truncate text-xs text-slate-500">
                          {row?.body || row?.deskripsi || row?.description || ""}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                          {row?.category_name ||
                            row?.kategori?.nama ||
                            row?.kategori ||
                            row?.category ||
                            "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {row?.lokasi ||
                          row?.location ||
                          extractLokasi(row?.body) ||
                          "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {row?.created_at || row?.tanggal || row?.createdAt || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={toStatusLabel(row?.status)} />
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/laporan/${row?.id || row?._id}`}
                          className="inline-flex items-center gap-2 font-semibold text-blue-700 hover:underline"
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
    </div>
  );
}

