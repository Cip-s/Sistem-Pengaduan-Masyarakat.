"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken, getUserFromToken, logout } from "../lib/auth";
import { IconBell, IconLogOut, IconUserCircle } from "./Icons";

function SideItem({ href, label, active }) {
  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold",
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "text-slate-700 hover:bg-slate-100",
      ].join(" ")}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-50" />
      {label}
    </Link>
  );
}

export default function AdminShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const token = getToken();
  const user = getUserFromToken();
  const role = user?.role;

  const isAdmin = role === "admin" || role === "super admin";
  const isSuperAdmin = role === "super admin";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!token) router.replace("/login");
    else if (!isAdmin) router.replace("/dashboard");
  }, [token, isAdmin, router]);

  async function onLogout() {
    logout();
    router.push("/login");
  }

  const menu = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/pengaduan", label: "Kelola Pengaduan" },
    ...(mounted && isSuperAdmin
      ? [{ href: "/admin/pengguna", label: "Kelola Pengguna" }]
      : []),
    { href: "/admin/kategori", label: "Kelola Kategori" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-gradient-to-b from-blue-700 to-blue-800 shadow-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white font-extrabold">
                SP
              </div>
              <div className="leading-tight">
                <div className="text-sm font-extrabold text-white">Admin Panel</div>
                <div className="text-[11px] text-white/80">
                  Sistem Pengaduan Masyarakat
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/15"
              onClick={() => alert("Notifikasi belum dibuat.")}
              aria-label="Notifikasi"
            >
              <IconBell className="h-5 w-5" />
            </button>
            <div className="hidden items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-white md:flex">
              <IconUserCircle className="h-6 w-6" />
              <div className="leading-tight">
                <div className="text-xs font-bold">
                  {mounted ? user?.username || "-" : "-"}
                </div>
                <div className="text-[11px] text-white/80">
                  {mounted ? role || "" : ""}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-white/95"
            >
              <IconLogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-0 px-0 lg:px-4">
        <aside className="hidden w-[260px] shrink-0 border-r border-slate-200 bg-white lg:block">
          <div className="sticky top-16 h-[calc(100vh-64px)] overflow-y-auto px-4 py-6">
            <div className="text-xs font-bold text-slate-500">MENU</div>
            <nav className="mt-3 space-y-1">
              {menu.map((m) => (
                <SideItem
                  key={m.href}
                  href={m.href}
                  label={m.label}
                  active={pathname === m.href || pathname?.startsWith(`${m.href}/`)}
                />
              ))}
            </nav>
          </div>
        </aside>

        <section className="w-full px-4 py-6 lg:px-6">{children}</section>
      </div>
    </div>
  );
}
