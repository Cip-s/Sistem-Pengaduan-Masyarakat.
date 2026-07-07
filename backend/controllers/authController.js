import connection from "../database.js";
import jwt from "jsonwebtoken";
import { SECRET } from "../middlewares/authMiddleware.js";

// REGISTER — Daftar user baru
export async function register(req, res) {
  // 1. Ambil data dari body request
  const { username, email, password } = req.body;

  // 2. Validasi — semua field wajib ada
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, dan password wajib diisi" });
  }

  // 3. Cek apakah email sudah terdaftar
  const [existing] = await connection.execute(
    "SELECT id FROM users WHERE email = ?",
    [email],
  );
  if (existing.length > 0) {
    return res.status(409).json({ message: "Email sudah terdaftar" });
  }

  // 4. Simpan user baru ke database (role default: 'user')
  // Catatan: password disimpan plain text sesuai latihan awal
  // Nanti bisa di-upgrade pakai bcrypt
  const [result] = await connection.execute(
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'user')",
    [username, email, password],
  );

  // 5. Response sukses
  return res.status(201).json({
    message: "Registrasi berhasil",
    userId: result.insertId,
  });
}

// LOGIN — Masuk dan dapat JWT token
export async function login(req, res) {
  // 1. Ambil email & password dari body
  const { email, password } = req.body;

  // 2. Validasi input
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  // 3. Cari user berdasarkan email di database
  const [users] = await connection.execute(
    "SELECT * FROM users WHERE email = ?",
    [email],
  );

  // 4. Kalau user tidak ditemukan
  if (!users.length) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }

  // 5. Bandingkan password
  if (users[0].password !== password) {
    return res.status(401).json({ message: "Password salah" });
  }

  // 6. Buat JWT token
  // Isi token: id, username, email, role
  const payload = {
    id: users[0].id,
    username: users[0].username,
    email: users[0].email,
    role: users[0].role,
  };
  const token = jwt.sign(payload, SECRET, { expiresIn: "24h" });

  // 7. Kirim response
  return res.json({
    message: "Login berhasil",
    token: token,
    user: payload,
  });
}

// GET PROFILE — Lihat profil sendiri (butuh token)
export async function getProfile(req, res) {
  // req.user sudah diisi oleh jwtMiddleware
  const [users] = await connection.execute(
    "SELECT id, username, email, role FROM users WHERE id = ?",
    [req.user.id],
  );

  if (!users.length) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }

  return res.json(users[0]);
}
