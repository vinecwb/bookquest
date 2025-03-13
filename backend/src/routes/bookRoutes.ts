import express from "express";
import { recommendBooksForUser, getUserBookRecommendations, updateReadingProgress } from "../controllers/bookController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/recommendation", authenticateToken, recommendBooksForUser);
router.get("/user-books", authenticateToken, getUserBookRecommendations);
router.put("/update-progress", authenticateToken, updateReadingProgress);

export default router;
