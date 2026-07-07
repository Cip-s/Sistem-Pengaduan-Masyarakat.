import express from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import { jwtMiddleware } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

// POST /api/auth/register  → daftar akun baru (publik)
authRouter.post("/register", register);

// POST /api/auth/login     → login, dapat token (publik)
authRouter.post("/login", login);

// GET  /api/auth/profile   → lihat profil sendiri (butuh token)
authRouter.get("/profile", jwtMiddleware, getProfile);

export default authRouter;
