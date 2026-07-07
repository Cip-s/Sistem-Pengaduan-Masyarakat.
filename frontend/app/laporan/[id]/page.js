"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
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

export default function LaporanDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [item, setItem] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [posting, setPosting] = useState(false);

  const statusLabel = useMemo(
    () => toStatusLabel(item?.status),
    [item?.status],
  );

  const comments = Array.isArray(item?.komentar) ? item.komentar : [];

  useEffect(() => {
    let canceled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch(`/api/laporan/${id}`);
        if (!canceled) setItem(data);
      } catch (err) {
        if (!canceled) setError(err?.message || "Gagal memuat detail laporan.");
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    if (id) load();
    return () => {
      canceled = true;
    };
  }, [id]);

  async function onPostComment() {
    if (!comment.trim()) return;
    setPosting(true);
    try {
      await apiFetch(`/api/komentar/${id}`, {
        method: "POST",
        body: JSON.stringify({ body: comment }),
      });
      setComment("");
      // Reload detail (so comments appear if backend includes them)
      const data = await apiFetch(`/api/laporan/${id}`);
      setItem(data);
    } catch (err) {
      alert(err?.message || "Gagal kirim komentar.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/laporan/riwayat"
        className="text-sm text-slate-600 hover:text-slate-900"
      >
        ← Kembali ke Riwayat Pengaduan
      </Link>

      {loading ? (
        <div className="mt-6 text-sm text-slate-600">Memuat...</div>
      ) : error ? (
        <div className="mt-6 text-sm text-rose-700">{error}</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl bg-blue-50 px-6 py-5">
                <div>
                  <div className="text-xl font-extrabold text-slate-900">
                    {item?.header || item?.judul || item?.title || "Detail Laporan"}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    <div>Dibuat: {item?.created_at || item?.createdAt || "-"}</div>
                    <div>•</div>
                    <div>
                      {item?.category_name ||
                        item?.kategori?.nama ||
                        item?.kategori ||
                        item?.category ||
                        "-"}
                    </div>
                  </div>
                </div>
                <StatusBadge status={statusLabel} />
              </div>

              <div className="px-6 py-5">
                <div className="text-sm font-bold text-slate-900">
                  Deskripsi Pengaduan
                </div>
                <div className="mt-2 text-sm text-slate-700">
                  {item?.body || item?.deskripsi || item?.description || "-"}
                </div>
              </div>

              {item?.image ? (
                <div className="border-t border-slate-100 px-6 py-5">
                  <div className="text-sm font-bold text-slate-900">
                    Bukti Foto
                  </div>
                  <div className="relative mt-3 aspect-[16/9] overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <Image
                      src={`/uploads/${item.image}`}
                      alt="Bukti Foto"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    File: {item.image}
                  </div>
                </div>
              ) : null}

              <div className="border-t border-slate-100 px-6 py-5">
                <div className="text-sm font-bold text-slate-900">Lokasi Kejadian</div>
                <div className="mt-2 text-sm text-slate-700">
                  {extractLokasi(item?.body)}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4 text-sm font-extrabold text-slate-900">
                Komentar ({comments.length})
              </div>
              <div className="px-6 py-6">
                {comments.length ? (
                  <div className="mb-5 space-y-3">
                    {comments.map((c, idx) => (
                      <div
                        key={c?.id || idx}
                        className="rounded-xl border border-slate-200 bg-white p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-extrabold text-slate-900">
                            {c?.username || "Pengguna"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {c?.created_at || ""}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-slate-700">
                          {c?.body || "-"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                    Belum ada komentar
                  </div>
                )}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Tulis komentar atau pertanyaan Anda..."
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={onPostComment}
                      disabled={posting}
                      className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                    >
                      {posting ? "Mengirim..." : "Kirim Komentar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-extrabold text-slate-900">
                Timeline Pengaduan
              </div>
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <div className="font-semibold">Pengaduan Dibuat</div>
                <div className="text-xs text-slate-500">
                  {item?.created_at || item?.createdAt || "-"}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-extrabold text-slate-900">
                Informasi Pelapor
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <div>
                  <div className="text-xs text-slate-500">Nama</div>
                  <div className="font-semibold">{item?.username || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Email</div>
                  <div className="font-semibold">{item?.email || "-"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
