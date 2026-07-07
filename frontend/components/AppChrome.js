"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppChrome({ children }) {
  const pathname = usePathname();
  const isAuth = pathname === "/login" || pathname === "/register";
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {isAuth || isAdmin ? null : <Navbar />}
      <main className={isAuth ? "min-h-screen" : "min-h-[calc(100vh-64px)]"}>
        {children}
      </main>
      {isAuth || isAdmin ? null : <Footer />}
    </>
  );
}
