import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import {
  jwtMiddleware,
  roleMiddleware,
} from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

// Semua endpoint user hanya bisa diakses super admin
// jwtMiddleware + roleMiddleware dipasang di semua route
userRouter.use(jwtMiddleware, roleMiddleware("super admin"));

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", createUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
