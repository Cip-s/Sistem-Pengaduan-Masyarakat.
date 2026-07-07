"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { getUserFromToken } from "../../../lib/auth";
import { apiFetch } from "../../../lib/api";

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="text-sm font-extrabold text-slate-900">{title}</div>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100"
            onClick={onClose}
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

export default function AdminKategoriPage() {
  const user = getUserFromToken();
  const isSuperAdmin = user?.role === "super admin";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [name, setName] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/kategori");
      setItems(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      setError(err?.message || "Gagal memuat kategori.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((i) =>
      String(i?.category_name || "").toLowerCase().includes(q.toLowerCase()),
    );
  }, [items, q]);

  function openCreate() {
    setEdit(null);
    setName("");
    setOpen(true);
  }

  function openEdit(item) {
    setEdit(item);
    setName(item?.category_name || "");
    setOpen(true);
  }

  async function onSave() {
    if (!name.trim()) return;
    try {
      if (edit?.id) {
        await apiFetch(`/api/kategori/${edit.id}`, {
          method: "PUT",
          body: JSON.stringify({ category_name: name }),
        });
      } else {
        await apiFetch("/api/kategori", {
          method: "POST",
          body: JSON.stringify({ category_name: name }),
        });
      }
      setOpen(false);
      await load();
    } catch (err) {
      alert(err?.message || "Gagal menyimpan kategori.");
    }
  }

  async function onDelete(item) {
    if (!isSuperAdmin) return;
    if (!confirm(`Hapus kategori "${item.category_name}"?`)) return;
    try {
      await apiFetch(`/api/kategori/${item.id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      alert(err?.message || "Gagal hapus kategori.");
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-extrabold text-slate-900">Kelola Kategori</div>
          <div className="mt-1 text-sm text-slate-600">
            Kelola kategori pengaduan masyarakat
          </div>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary">
          Tambah Kategori
        </button>
      </div>

      <div className="card p-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari nama kategori..."
          className="input"
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="card p-6 text-sm text-slate-600">Memuat...</div>
        ) : error ? (
          <div className="card p-6 text-sm text-rose-700">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((k) => (
              <div key={k.id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {k.category_name}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">ID: {k.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(k)}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    {isSuperAdmin ? (
                      <button
                        type="button"
                        onClick={() => onDelete(k)}
                        className="rounded-lg border border-rose-200 px-2 py-1 text-xs font-bold text-rose-700 hover:bg-rose-50"
                      >
                        Hapus
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {open ? (
        <Modal
          title={edit ? "Edit Kategori" : "Tambah Kategori Baru"}
          onClose={() => setOpen(false)}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Nama Kategori</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Infrastruktur Jalan"
                className="input mt-1"
              />
              <div className="mt-2 text-xs text-slate-500">
                Catatan: backend hanya punya field `category_name`.
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn-outline" onClick={() => setOpen(false)}>
                Batal
              </button>
              <button type="button" className="btn-primary" onClick={onSave}>
                {edit ? "Simpan" : "Tambah"}
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
