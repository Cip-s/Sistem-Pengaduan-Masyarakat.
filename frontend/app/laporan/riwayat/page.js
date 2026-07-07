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

function extractLokasi(bodyText) {
  if (!bodyText) return "-";
  const text = String(bodyText);
  const match = text.match(/^\s*Lokasi:\s*(.+)\s*$/m);
  return match?.[1]?.trim() || "-";
}

export default function RiwayatPage() {
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
        if (canceled) return;
        setItems(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        if (canceled) return;
        setError(err?.message || "Gagal memuat riwayat.");
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
      const name =
        i?.category_name || i?.kategori?.nama || i?.kategori || i?.category;
      if (name) set.add(String(name));
    });
    return Array.from(set);
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const title = String(i?.header || i?.judul || i?.title || "").toLowerCase();
      const location = String(
        i?.lokasi || i?.location || extractLokasi(i?.body) || "",
      ).toLowerCase();
      const statusLabel = toStatusLabel(i?.status);
      const category = String(
        i?.category_name || i?.kategori?.nama || i?.kategori || i?.category || "",
      );
      const hit =
        !q ||
        title.includes(q.toLowerCase()) ||
        location.includes(q.toLowerCase());
      const hitStatus = !status || statusLabel === status;
      const hitKategori = !kategori || category === kategori;
      return hit && hitStatus && hitKategori;
    });
  }, [items, q, status, kategori]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Riwayat Pengaduan
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Kelola dan pantau semua pengaduan yang telah Anda sampaikan
          </p>
        </div>
        <Link
          href="/laporan/buat"
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Buat Pengaduan
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari pengaduan..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="Pending">Pending</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
            <option value="Ditolak">Ditolak</option>
          </select>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4 text-sm text-slate-600">
          Menampilkan {filtered.length} dari {items.length} pengaduan
        </div>

        {loading ? (
          <div className="px-5 py-10 text-sm text-slate-600">Memuat...</div>
        ) : error ? (
          <div className="px-5 py-6 text-sm text-rose-700">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Judul Pengaduan</th>
                  <th className="px-5 py-3">Kategori</th>
                  <th className="px-5 py-3">Lokasi</th>
                  <th className="px-5 py-3">Tanggal</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row?.id || row?._id}>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      <div>{row?.header || row?.judul || row?.title || "-"}</div>
                      <div className="mt-1 max-w-md truncate text-xs text-slate-500">
                        {row?.body || row?.deskripsi || row?.description || ""}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                        {row?.category_name ||
                          row?.kategori?.nama ||
                          row?.kategori ||
                          row?.category ||
                          "-"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {row?.lokasi ||
                        row?.location ||
                        extractLokasi(row?.body) ||
                        "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {row?.created_at ||
                        row?.tanggal ||
                        row?.createdAt ||
                        "-"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={toStatusLabel(row?.status)} />
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/laporan/${row?.id || row?._id}`}
                        className="text-sm font-semibold text-blue-700 hover:underline"
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
