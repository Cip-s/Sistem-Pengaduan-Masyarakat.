import express from "express";
import {
  getAllKategori,
  createKategori,
  updateKategori,
  deleteKategori,
} from "../controllers/kategoriController.js";
import {
  jwtMiddleware,
  roleMiddleware,
} from "../middlewares/authMiddleware.js";

const kategoriRouter = express.Router();

// GET semua kategori — semua user yang login bisa akses
kategoriRouter.get("/", jwtMiddleware, getAllKategori);

// Buat & update kategori — admin & super admin
kategoriRouter.post(
  "/",
  jwtMiddleware,
  roleMiddleware("admin", "super admin"),
  createKategori,
);
kategoriRouter.put(
  "/:id",
  jwtMiddleware,
  roleMiddleware("admin", "super admin"),
  updateKategori,
);

// Hapus kategori — super admin only
kategoriRouter.delete(
  "/:id",
  jwtMiddleware,
  roleMiddleware("super admin"),
  deleteKategori,
);

export default kategoriRouter;
