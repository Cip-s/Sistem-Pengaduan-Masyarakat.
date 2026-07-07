"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StatusBadge from "../../../../components/StatusBadge";
import { apiFetch } from "../../../../lib/api";

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

export default function AdminPengaduanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [item, setItem] = useState(null);
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const comments = Array.isArray(item?.komentar) ? item.komentar : [];

  useEffect(() => {
    let canceled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch(`/api/laporan/${id}`);
        if (canceled) return;
        setItem(data);
        setStatus(toStatusLabel(data?.status));
      } catch (err) {
        if (!canceled) setError(err?.message || "Gagal memuat detail.");
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    if (id) load();
    return () => {
      canceled = true;
    };
  }, [id]);

  async function onSaveStatus() {
    setSaving(true);
    try {
      const map = {
        Pending: "pending",
        Diproses: "diproses",
        Selesai: "selesai",
        Ditolak: "ditolak",
      };
      const next = map[status] || "pending";
      await apiFetch(`/api/laporan/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: next }),
      });
      const data = await apiFetch(`/api/laporan/${id}`);
      setItem(data);
      setStatus(toStatusLabel(data?.status));
      alert("Status berhasil disimpan.");
    } catch (err) {
      alert(err?.message || "Gagal simpan status.");
    } finally {
      setSaving(false);
    }
  }

  async function onPostComment() {
    if (!comment.trim()) return;
    try {
      await apiFetch(`/api/komentar/${id}`, {
        method: "POST",
        body: JSON.stringify({ body: comment }),
      });
      setComment("");
      const data = await apiFetch(`/api/laporan/${id}`);
      setItem(data);
    } catch (err) {
      alert(err?.message || "Gagal kirim komentar.");
    }
  }

  const statusLabel = useMemo(() => toStatusLabel(item?.status), [item?.status]);

  return (
    <div>
      <button
        type="button"
        onClick={() => router.back()}
        className="text-sm text-slate-600 hover:text-slate-900"
      >
        ← Kembali ke Kelola Pengaduan
      </button>

      {loading ? (
        <div className="mt-6 card p-6 text-sm text-slate-600">Memuat...</div>
      ) : error ? (
        <div className="mt-6 card p-6 text-sm text-rose-700">{error}</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="card overflow-hidden">
              <div className="bg-blue-50 px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xl font-extrabold text-slate-900">
                      {item?.header || "-"}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                      <div>Dibuat: {item?.created_at || "-"}</div>
                      <div>•</div>
                      <div>{item?.category_name || "-"}</div>
                    </div>
                  </div>
                  <StatusBadge status={statusLabel} />
                </div>
              </div>

              <div className="px-6 py-5">
                <div className="text-sm font-bold text-slate-900">Deskripsi Pengaduan</div>
                <div className="mt-2 text-sm text-slate-700">{item?.body || "-"}</div>
              </div>

              {item?.image ? (
                <div className="border-t border-slate-100 px-6 py-5">
                  <div className="text-sm font-bold text-slate-900">Bukti Foto</div>
                  <div className="relative mt-3 aspect-[16/9] overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <Image
                      src={`/uploads/${item.image}`}
                      alt="Bukti Foto"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              ) : null}

              <div className="border-t border-slate-100 px-6 py-5">
                <div className="text-sm font-bold text-slate-900">Lokasi Kejadian</div>
                <div className="mt-2 text-sm text-slate-700">{extractLokasi(item?.body)}</div>
              </div>
            </div>

            <div className="card">
              <div className="border-b border-slate-100 px-6 py-4 text-sm font-extrabold text-slate-900">
                Komentar Publik ({comments.length})
              </div>
              <div className="px-6 py-6">
                {comments.length ? (
                  <div className="mb-5 space-y-3">
                    {comments.map((c, idx) => (
                      <div key={c?.id || idx} className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-extrabold text-slate-900">
                            {c?.username || "Pengguna"}
                          </div>
                          <div className="text-xs text-slate-500">{c?.created_at || ""}</div>
                        </div>
                        <div className="mt-2 text-sm text-slate-700">{c?.body || "-"}</div>
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
                    placeholder="Tulis komentar atau update untuk pelapor..."
                    className="input resize-none"
                  />
                  <div className="mt-3 flex justify-end">
                    <button type="button" onClick={onPostComment} className="btn-primary">
                      Kirim Komentar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-5">
              <div className="text-sm font-extrabold text-slate-900">Informasi Pelapor</div>
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

            <div className="card p-5">
              <div className="text-sm font-extrabold text-slate-900">Update Status Pengaduan</div>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="text-xs font-bold text-slate-500">Status</div>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="input mt-1">
                    <option value="Pending">Pending</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={onSaveStatus}
                  disabled={saving}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <div className="text-xs text-slate-500">
                  Catatan: backend hanya menyimpan field status.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
