import connection from "../database.js";

// GET SEMUA USER — khusus super admin
export async function getAllUsers(req, res) {
  const [users] = await connection.execute(
    "SELECT id, username, email, role FROM users ORDER BY id ASC",
  );
  return res.json(users);
}

// GET USER BY ID
export async function getUserById(req, res) {
  const [users] = await connection.execute(
    "SELECT id, username, email, role FROM users WHERE id = ?",
    [req.params.id],
  );

  if (!users.length) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }

  return res.json(users[0]);
}

// BUAT USER BARU (manual oleh super admin)
export async function createUser(req, res) {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, password wajib diisi" });
  }

  // Cek email duplikat
  const [existing] = await connection.execute(
    "SELECT id FROM users WHERE email = ?",
    [email],
  );
  if (existing.length) {
    return res.status(409).json({ message: "Email sudah dipakai" });
  }

  const [result] = await connection.execute(
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
    [username, email, password, role || "user"],
  );

  return res
    .status(201)
    .json({ message: "User berhasil dibuat", id: result.insertId });
}

// UPDATE USER
export async function updateUser(req, res) {
  const { username, email, role } = req.body;
  const { id } = req.params;

  const [result] = await connection.execute(
    "UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?",
    [username, email, role, id],
  );

  if (!result.affectedRows) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }

  return res.json({ message: "User berhasil diperbarui" });
}

// HAPUS USER
export async function deleteUser(req, res) {
  const [result] = await connection.execute("DELETE FROM users WHERE id = ?", [
    req.params.id,
  ]);

  if (!result.affectedRows) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }

  return res.json({ message: "User berhasil dihapus" });
}
