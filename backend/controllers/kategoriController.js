import connection from "../database.js";

//  GET SEMUA KATEGORI — bisa diakses semua user
export async function getAllKategori(req, res) {
  const [kategori] = await connection.execute(
    "SELECT * FROM categories ORDER BY id ASC",
  );
  return res.json(kategori);
}

//  BUAT KATEGORI BARU — khusus admin & super admin
export async function createKategori(req, res) {
  const { category_name } = req.body;

  if (!category_name) {
    return res.status(400).json({ message: "Nama kategori wajib diisi" });
  }

  const [result] = await connection.execute(
    "INSERT INTO categories (category_name) VALUES (?)",
    [category_name],
  );

  return res.status(201).json({
    message: "Kategori berhasil dibuat",
    id: result.insertId,
  });
}

//  UPDATE KATEGORI — khusus admin & super admin
export async function updateKategori(req, res) {
  const { category_name } = req.body;
  const { id } = req.params;

  const [result] = await connection.execute(
    "UPDATE categories SET category_name = ? WHERE id = ?",
    [category_name, id],
  );

  if (!result.affectedRows) {
    return res.status(404).json({ message: "Kategori tidak ditemukan" });
  }

  return res.json({ message: "Kategori berhasil diperbarui" });
}

//  HAPUS KATEGORI — khusus super admin
export async function deleteKategori(req, res) {
  const [result] = await connection.execute(
    "DELETE FROM categories WHERE id = ?",
    [req.params.id],
  );

  if (!result.affectedRows) {
    return res.status(404).json({ message: "Kategori tidak ditemukan" });
  }

  return res.json({ message: "Kategori berhasil dihapus" });
}
