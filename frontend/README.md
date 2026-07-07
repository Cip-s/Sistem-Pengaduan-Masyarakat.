Frontend Next.js (App Router) untuk Sistem Pengaduan Masyarakat.

## Jalanin (Development)

1. Jalankan backend di `C:\laragon\www\aas\jwt-main` (default: `http://localhost:3000`)
2. (Opsional) Copy env: `frontend\.env.example` → `frontend\.env.local`
3. Jalankan frontend (port `3001`, sesuai CORS backend):
   - `npm run dev`

## Struktur (Simple)

- `app/page.js` landing
- `app/login/page.js`
- `app/register/page.js`
- `app/dashboard/page.js`
- `app/laporan/buat/page.js`
- `app/laporan/riwayat/page.js`
- `app/laporan/[id]/page.js`
- `components/*`
- `lib/api.js`
- `lib/auth.js`

