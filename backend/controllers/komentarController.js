import connection from "../database.js";

// TAMBAH KOMENTAR ke laporan tertentu
export async function addKomentar(req, res) {
  const { public_report_id } = req.params; // ID laporan dari URL
  const { body } = req.body; // Isi komentar dari request body

  // Validasi isi komentar
  if (!body) {
    return res.status(400).json({ message: "Isi komentar wajib diisi" });
  }

  // Cek apakah laporan ada di database
  const [laporan] = await connection.execute(
    "SELECT id FROM public_reports WHERE id = ?",
    [public_report_id],
  );
  if (!laporan.length) {
    return res.status(404).json({ message: "Laporan tidak ditemukan" });
  }

  // Simpan komentar
  const [result] = await connection.execute(
    "INSERT INTO comments (body, user_id, public_report_id) VALUES (?, ?, ?)",
    [body, req.user.id, public_report_id],
  );

  // Ambil data komentar lengkap (dengan username) untuk dikembalikan
  const [komentar] = await connection.execute(
    `SELECT cm.*, u.username, u.role 
     FROM comments cm 
     JOIN users u ON cm.user_id = u.id 
     WHERE cm.id = ?`,
    [result.insertId],
  );

  return res.status(201).json({
    message: "Komentar berhasil ditambahkan",
    komentar: komentar[0],
  });
}

// HAPUS KOMENTAR
// - User biasa: hanya bisa hapus komentar miliknya
// - Admin/Super Admin: bisa hapus komentar siapapun
export async function deleteKomentar(req, res) {
  const { id } = req.params;

  // Cek komentar ada
  const [komentar] = await connection.execute(
    "SELECT * FROM comments WHERE id = ?",
    [id],
  );

  if (!komentar.length) {
    return res.status(404).json({ message: "Komentar tidak ditemukan" });
  }

  // Cek kepemilikan untuk user biasa
  if (req.user.role === "user" && komentar[0].user_id !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Akses ditolak: bukan komentar kamu" });
  }

  await connection.execute("DELETE FROM comments WHERE id = ?", [id]);
  return res.json({ message: "Komentar berhasil dihapus" });
}
