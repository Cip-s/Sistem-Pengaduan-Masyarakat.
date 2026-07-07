import express from "express";
import {
  getAllLaporan,
  getLaporanById,
  getStatistik,
  createLaporan,
  updateStatus,
  deleteLaporan,
} from "../controllers/laporanController.js";
import {
  jwtMiddleware,
  roleMiddleware,
} from "../middlewares/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup multer untuk upload foto
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const laporanRouter = express.Router();

// Semua route laporan butuh login (jwtMiddleware)
laporanRouter.get("/", jwtMiddleware, getAllLaporan);
laporanRouter.get("/statistik", jwtMiddleware, getStatistik);
laporanRouter.get("/:id", jwtMiddleware, getLaporanById);
laporanRouter.post("/", jwtMiddleware, upload.single("image"), createLaporan);
laporanRouter.delete("/:id", jwtMiddleware, deleteLaporan);

// Update status hanya admin & super admin
laporanRouter.patch(
  "/:id/status",
  jwtMiddleware,
  roleMiddleware("admin", "super admin"),
  updateStatus,
);

export default laporanRouter;
