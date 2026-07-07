"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getUserFromToken, logout } from "../lib/auth";
import {
  IconBell,
  IconHome,
  IconList,
  IconLogOut,
  IconPlusCircle,
  IconUserCircle,
} from "./Icons";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isLanding = pathname === "/";
  const user = getUserFromToken();

  async function onLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-blue-700 to-blue-800 shadow-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white font-extrabold">
            SP
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold text-white">
              Sistem Pengaduan
            </div>
            <div className="text-[11px] text-white/80">Pemerintah Kota</div>
          </div>
        </Link>

        {isAuthPage ? null : isLanding ? (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-white/95"
            >
              Daftar
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-2 md:flex">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                <IconHome className="h-4 w-4" />
                Beranda
              </Link>
              <Link
                href="/laporan/buat"
                className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
              >
                <IconPlusCircle className="h-4 w-4" />
                Buat Pengaduan
              </Link>
              <Link
                href="/laporan/riwayat"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                <IconList className="h-4 w-4" />
                Riwayat Pengaduan
              </Link>
            </nav>

            <button
              type="button"
              className="hidden rounded-lg bg-white/10 p-2 text-white hover:bg-white/15 md:inline-flex"
              onClick={() => alert("Notifikasi belum dibuat.")}
              aria-label="Notifikasi"
            >
              <IconBell className="h-5 w-5" />
            </button>

            <div className="hidden items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-white md:flex">
              <IconUserCircle className="h-6 w-6" />
              <div className="leading-tight">
                <div className="text-xs font-bold">
                  {user?.username || "Pengguna"}
                </div>
                <div className="text-[11px] text-white/80">
                  {user?.email || ""}
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
        )}
      </div>
    </header>
  );
}
