import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import semua router
import authRouter from "./routes/authRoute.js";
import laporanRouter from "./routes/laporanRoute.js";
import komentarRouter from "./routes/komentarRoute.js";
import userRouter from "./routes/userRoute.js";
import kategoriRouter from "./routes/kategoriRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Izinkan akses dari frontend (React/Expo Web).
// Default dev origins: React (3001) dan Expo Web (8081). Bisa override via env `CORS_ORIGINS`
// contoh: CORS_ORIGINS=http://localhost:8081,http://localhost:3001
const allowedOrigins = (process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean)
  : [
      "http://localhost:3001",
      "http://127.0.0.1:3001",
      "http://localhost:8081",
      "http://127.0.0.1:8081",
    ]);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (no Origin header): e.g. Postman, mobile native, server-to-server
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);

// Supaya bisa baca JSON dari body request
app.use(express.json());

// Supaya bisa baca form biasa (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Serve folder uploads sebagai file statis
// Foto bisa diakses di: http://localhost:3000/uploads/namafile.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRouter); // Login, Register, Profile
app.use("/api/laporan", laporanRouter); // CRUD Laporan
app.use("/api/komentar", komentarRouter); // CRUD Komentar
app.use("/api/users", userRouter); // CRUD User (super admin)
app.use("/api/kategori", kategoriRouter); // CRUD Kategori

// Route cek server
app.get("/", (req, res) => {
  res.json({ message: "Server Pengaduan Masyarakat Udh Nyala Cuyy", port });
});

app.listen(port, () => {
  console.log(`✅ Server berjalan di http://localhost:${port}`);
});
