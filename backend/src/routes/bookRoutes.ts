import express from "express";
import {
  recommendBooksForUser,
  getUserBookRecommendations,
  updateReadingProgress,
} from "../controllers/bookController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * 🔹 Retorna até 5 livros novos ao usuário por semana
 */
router.get("/recommendations", authenticateToken, recommendBooksForUser);

/**
 * 🔹 Retorna os livros já recomendados ao usuário
 */
router.get("/user-books", authenticateToken, getUserBookRecommendations);

/**
 * 🔹 Atualiza o progresso de leitura do usuário
 */
router.put("/update-progress", authenticateToken, updateReadingProgress);

export default router;
