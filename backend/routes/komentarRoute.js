import express from "express";
import {
  addKomentar,
  deleteKomentar,
} from "../controllers/komentarController.js";
import { jwtMiddleware } from "../middlewares/authMiddleware.js";

const komentarRouter = express.Router();

// POST /api/komentar/:public_report_id  → tambah komentar ke laporan
komentarRouter.post("/:public_report_id", jwtMiddleware, addKomentar);

// DELETE /api/komentar/:id             → hapus komentar
komentarRouter.delete("/:id", jwtMiddleware, deleteKomentar);

export default komentarRouter;
