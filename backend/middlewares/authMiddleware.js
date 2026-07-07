import jwt from "jsonwebtoken";

const SECRET = "secretkey";

// Middleware 1: Verifikasi JWT Token
export function jwtMiddleware(req, res, next) {
  // 1. Ambil token dari header Authorization
  const headerToken = req.headers.authorization;
  if (!headerToken) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  // 2. Pisahin dari prefix "Bearer "
  const token = headerToken.split(" ")[1];

  // 3. Verifikasi token
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Token tidak valid atau expired" });
    }
    // 4. Simpan data user ke req.user supaya bisa dipakai di controller
    req.user = decoded;
    next();
  });
}

// Middleware 2: Cek Role (bisa dipakai di route manapun)
// Contoh pakai: roleMiddleware("admin", "super admin")
export function roleMiddleware(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Akses ditolak. Butuh role: ${roles.join(" / ")}`,
      });
    }
    next();
  };
}

export { SECRET };
