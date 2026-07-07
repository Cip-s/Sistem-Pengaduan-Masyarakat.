import connection from "../database.js";

// GET SEMUA LAPORAN
// - Semua user yang login: lihat semua laporan (bersifat public)
export async function getAllLaporan(req, res) {
  const query = `
    SELECT 
      pr.id,
      pr.header,
      pr.body,
      pr.image,
      pr.status,
      pr.created_at,
      u.username,
      u.email,
      c.category_name
    FROM public_reports pr
    JOIN users u ON pr.user_id = u.id
    LEFT JOIN categories c ON pr.category_id = c.id
  `;

  const [laporan] = await connection.execute(
    `${query} ORDER BY pr.created_at DESC`,
  );
  return res.json(laporan);
}

// GET DETAIL LAPORAN + KOMENTAR
export async function getLaporanById(req, res) {
  const { id } = req.params;

  // Ambil data laporan
  const [laporan] = await connection.execute(
    `SELECT 
      pr.*,
      u.username,
      u.email,
      c.category_name
    FROM public_reports pr
    JOIN users u ON pr.user_id = u.id
    LEFT JOIN categories c ON pr.category_id = c.id
    WHERE pr.id = ?`,
    [id],
  );

  if (!laporan.length) {
    return res.status(404).json({ message: "Laporan tidak ditemukan" });
  }

  // Ambil komentar laporan ini
  const [komentar] = await connection.execute(
    `SELECT 
      cm.*,
      u.username,
      u.role
    FROM comments cm
    JOIN users u ON cm.user_id = u.id
    WHERE cm.public_report_id = ?
    ORDER BY cm.created_at ASC`,
    [id],
  );

  return res.json({
    ...laporan[0],
    komentar: komentar,
  });
}

// GET STATISTIK LAPORAN
export async function getStatistik(req, res) {
  const [[{ total }]] = await connection.execute(
    "SELECT COUNT(*) as total FROM public_reports",
  );
  const [[{ pending }]] = await connection.execute(
    "SELECT COUNT(*) as pending FROM public_reports WHERE status = 'pending'",
  );
  const [[{ diproses }]] = await connection.execute(
    "SELECT COUNT(*) as diproses FROM public_reports WHERE status = 'diproses'",
  );
  const [[{ selesai }]] = await connection.execute(
    "SELECT COUNT(*) as selesai FROM public_reports WHERE status = 'selesai'",
  );
  const [[{ ditolak }]] = await connection.execute(
    "SELECT COUNT(*) as ditolak FROM public_reports WHERE status = 'ditolak'",
  );

  return res.json({ total, pending, diproses, selesai, ditolak });
}

// BUAT LAPORAN BARU
export async function createLaporan(req, res) {
  const { header, body, category_id } = req.body;

  // Validasi input wajib
  if (!header || !body) {
    return res
      .status(400)
      .json({ message: "Header dan body laporan wajib diisi" });
  }

  // Ambil nama file foto kalau ada upload
  const image = req.file ? req.file.filename : null;

  const [result] = await connection.execute(
    "INSERT INTO public_reports (header, body, user_id, category_id, image, status) VALUES (?, ?, ?, ?, ?, 'pending')",
    [header, body, req.user.id, category_id || null, image],
  );

  return res.status(201).json({
    message: "Laporan berhasil dibuat",
    id: result.insertId,
  });
}

// UPDATE STATUS LAPORAN — khusus admin & super admin
export async function updateStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const validStatus = ["pending", "diproses", "selesai", "ditolak"];
  if (!validStatus.includes(status)) {
    return res
      .status(400)
      .json({
        message: "Status tidak valid. Pilih: pending, diproses, selesai, ditolak",
      });
  }

  const [result] = await connection.execute(
    "UPDATE public_reports SET status = ? WHERE id = ?",
    [status, id],
  );

  if (!result.affectedRows) {
    return res.status(404).json({ message: "Laporan tidak ditemukan" });
  }

  return res.json({
    message: `Status laporan berhasil diubah menjadi '${status}'`,
  });
}

// HAPUS LAPORAN
// - User biasa: hanya bisa hapus miliknya
// - Admin/Super Admin: bisa hapus semua
export async function deleteLaporan(req, res) {
  const { id } = req.params;

  // Cek laporan ada
  const [laporan] = await connection.execute(
    "SELECT * FROM public_reports WHERE id = ?",
    [id],
  );

  if (!laporan.length) {
    return res.status(404).json({ message: "Laporan tidak ditemukan" });
  }

  // Cek kepemilikan untuk user biasa
  if (req.user.role === "user" && laporan[0].user_id !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Akses ditolak: bukan laporan kamu" });
  }

  await connection.execute("DELETE FROM public_reports WHERE id = ?", [id]);
  return res.json({ message: "Laporan berhasil dihapus" });
}
