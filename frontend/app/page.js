import Image from "next/image";
import Link from "next/link";
import { IconCheck } from "../components/Icons";

export default function HomePage() {
  return (
    <div>
      <section className="bg-linear-to-b from-blue-700 to-blue-800">
        <div className="container-page grid grid-cols-1 gap-10 py-10 md:grid-cols-2 md:items-center md:py-16">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Platform Resmi Pemerintah
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              Layanan Pengaduan Masyarakat
            </h1>
            <p className="mt-4 max-w-xl text-white/90">
              Sampaikan aspirasi dan pengaduan Anda langsung kepada pemerintah
              kota. Kami berkomitmen untuk memberikan pelayanan terbaik dan
              menindaklanjuti setiap laporan dengan transparan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="btn bg-white text-blue-700 hover:bg-white/95"
              >
                Buat Pengaduan →
              </Link>
              <Link
                href="/login"
                className="btn bg-white/10 text-white hover:bg-white/15"
              >
                Masuk Akun
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-2 shadow-xl">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl">
              <Image
                src="/add.jpg"
                alt="Banner Layanan"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="container-page py-12">
          <h2 className="text-center text-2xl font-extrabold text-slate-900">
            Statistik Pengaduan
          </h2>
          <p className="mt-1 text-center text-sm text-slate-600">
            Data pengaduan masyarakat yang telah disampaikan
          </p>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Total Pengaduan",
                value: 5,
                tone: "bg-blue-50 text-blue-700",
              },
              {
                label: "Menunggu Proses",
                value: 2,
                tone: "bg-amber-50 text-amber-700",
              },
              {
                label: "Selesai",
                value: 1,
                tone: "bg-emerald-50 text-emerald-700",
              },
              { label: "Ditolak", value: 1, tone: "bg-rose-50 text-rose-700" },
            ].map((item) => (
              <div key={item.label} className="card p-5">
                <div className="flex items-start justify-between">
                  <div className="text-sm font-semibold text-slate-600">
                    {item.label}
                  </div>
                  <div
                    className={`rounded-xl px-3 py-2 text-xs font-bold ${item.tone}`}
                  >
                    SP
                  </div>
                </div>
                <div className="mt-3 text-3xl font-extrabold text-slate-900">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-page py-14">
          <h3 className="text-center text-2xl font-extrabold text-slate-900">
            Kenapa Memilih Layanan Kami?
          </h3>
          <p className="mt-1 text-center text-sm text-slate-600">
            Keunggulan sistem pengaduan masyarakat kami
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Aman & Terpercaya",
                desc: "Data Anda dijamin aman dengan sistem keamanan tingkat tinggi.",
              },
              {
                title: "Respon Cepat",
                desc: "Pengaduan akan diproses maksimal 2x24 jam kerja.",
              },
              {
                title: "Transparan",
                desc: "Pantau status pengaduan Anda secara real-time.",
              },
              {
                title: "Komunikasi Dua Arah",
                desc: "Berdiskusi langsung dengan petugas terkait.",
              },
            ].map((f) => (
              <div key={f.title} className="card p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-sm font-extrabold text-white">
                  SP
                </div>
                <div className="mt-4 text-sm font-extrabold text-slate-900">
                  {f.title}
                </div>
                <div className="mt-1 text-sm text-slate-600">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-linear-to-b from-blue-700 to-blue-800">
        <div className="container-page grid grid-cols-1 gap-8 py-14 md:grid-cols-2 md:items-center">
          <div className="text-white">
            <div className="text-sm font-bold text-white/90">
              Tentang Layanan
            </div>
            <h3 className="mt-2 text-3xl font-extrabold">
              Sistem Pengaduan Masyarakat
            </h3>
            <p className="mt-3 text-sm text-white/90">
              Sistem Pengaduan Masyarakat adalah platform digital resmi
              pemerintah kota yang memudahkan warga untuk menyampaikan aspirasi,
              keluhan, dan pengaduan terkait pelayanan publik.
            </p>
            <p className="mt-3 text-sm text-white/90">
              Setiap pengaduan yang masuk akan ditindaklanjuti oleh dinas atau
              instansi terkait dengan transparan dan akuntabel.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-white/90">
              {[
                {
                  t: "Mudah Digunakan",
                  d: "Interface sederhana dan user-friendly",
                },
                {
                  t: "Gratis Tanpa Biaya",
                  d: "Tidak ada biaya apapun untuk menggunakan layanan ini",
                },
                {
                  t: "Terpantau Real-time",
                  d: "Lacak status pengaduan kapan saja",
                },
              ].map((x) => (
                <li key={x.t} className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-100">
                    <IconCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-bold">{x.t}</div>
                    <div className="text-white/80">{x.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-blue-50 p-4">
                <div className="text-xs font-bold text-slate-500">Telepon</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">
                  (021) 1234-5678
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  WhatsApp: 0812-3456-7890
                </div>
              </div>
              <div className="rounded-xl bg-blue-50 p-4">
                <div className="text-xs font-bold text-slate-500">Email</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">
                  pengaduan@pemkot.go.id
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  info@pemkot.go.id
                </div>
              </div>
              <div className="rounded-xl bg-blue-50 p-4 sm:col-span-2">
                <div className="text-xs font-bold text-slate-500">Alamat</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">
                  Jl. Merdeka No. 1
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  Jakarta Pusat, DKI Jakarta 10110
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
