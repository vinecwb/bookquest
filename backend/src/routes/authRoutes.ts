import express from "express";
import { register, login, getUserProfile, getAllUsers, deleteUser } from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, getUserProfile);
router.get("/users", authenticateToken, getAllUsers);
router.delete("/users/:id", authenticateToken, deleteUser);

export default router;
