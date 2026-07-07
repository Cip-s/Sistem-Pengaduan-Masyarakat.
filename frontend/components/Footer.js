export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="text-base font-extrabold">Sistem Pengaduan Masyarakat</div>
          <p className="mt-2 text-sm text-slate-300">
            Platform resmi untuk menyampaikan pengaduan dan aspirasi masyarakat
            kepada pemerintah kota.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-extrabold">Kontak</div>
          <div className="mt-3 space-y-1 text-slate-300">
            <div>Email: pengaduan@pemkot.go.id</div>
            <div>Telepon: (021) 1234-5678</div>
            <div>WhatsApp: 0812-3456-7890</div>
          </div>
        </div>
        <div className="text-sm">
          <div className="font-extrabold">Jam Operasional</div>
          <div className="mt-3 space-y-1 text-slate-300">
            <div>Senin - Jumat: 08:00 - 16:00 WIB</div>
            <div>Sabtu: 08:00 - 12:00 WIB</div>
            <div>Minggu & Libur: Tutup</div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-400">
        © 2026 Pemerintah Kota. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
