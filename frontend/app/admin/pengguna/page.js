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

export default function AdminPenggunaPage() {
  const user = getUserFromToken();
  const isSuperAdmin = user?.role === "super admin";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/users");
      setItems(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      setError(err?.message || "Gagal memuat pengguna.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isSuperAdmin) load();
  }, [isSuperAdmin]);

  const filtered = useMemo(() => {
    return items.filter((u) => {
      const hay = `${u.username} ${u.email} ${u.role}`.toLowerCase();
      return !q || hay.includes(q.toLowerCase());
    });
  }, [items, q]);

  function openCreate() {
    setEdit(null);
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("user");
    setOpen(true);
  }

  function openEdit(u) {
    setEdit(u);
    setUsername(u.username || "");
    setEmail(u.email || "");
    setPassword("");
    setRole(u.role || "user");
    setOpen(true);
  }

  async function onSave() {
    try {
      if (edit?.id) {
        await apiFetch(`/api/users/${edit.id}`, {
          method: "PUT",
          body: JSON.stringify({ username, email, role }),
        });
      } else {
        await apiFetch("/api/users", {
          method: "POST",
          body: JSON.stringify({ username, email, password, role }),
        });
      }
      setOpen(false);
      await load();
    } catch (err) {
      alert(err?.message || "Gagal menyimpan pengguna.");
    }
  }

  async function onDelete(u) {
    if (!confirm(`Hapus user "${u.username}"?`)) return;
    try {
      await apiFetch(`/api/users/${u.id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      alert(err?.message || "Gagal hapus user.");
    }
  }

  if (!isSuperAdmin) {
    return (
      <div className="card p-6 text-sm text-rose-700">
        Akses ditolak. Halaman ini hanya untuk Super Admin.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-extrabold text-slate-900">Kelola Pengguna</div>
          <div className="mt-1 text-sm text-slate-600">
            Kelola akun pengguna dan hak akses sistem
          </div>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary">
          Tambah Pengguna
        </button>
      </div>

      <div className="card p-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari nama, email, atau role pengguna..."
          className="input"
        />
      </div>

      <div className="mt-6 card">
        <div className="border-b border-slate-200 px-6 py-4 text-sm text-slate-600">
          Menampilkan {filtered.length} dari {items.length} pengguna
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
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Pengguna</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 text-slate-700">{u.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{u.username}</td>
                    <td className="px-6 py-4 text-slate-700">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(u)}
                          className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(u)}
                          className="rounded-lg border border-rose-200 px-2 py-1 text-xs font-bold text-rose-700 hover:bg-rose-50"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open ? (
        <Modal title={edit ? "Edit Pengguna" : "Tambah Pengguna Baru"} onClose={() => setOpen(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input mt-1"
                placeholder="Masukkan username"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input mt-1"
                placeholder="nama@email.com"
              />
            </div>
            {!edit ? (
              <div>
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input mt-1"
                  placeholder="Minimal 6 karakter"
                  type="password"
                />
              </div>
            ) : null}
            <div>
              <label className="text-sm font-semibold text-slate-700">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="input mt-1">
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="super admin">super admin</option>
              </select>
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
