import express from "express";
import { addUserInterests } from "../controllers/interestController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/add", authenticateToken, addUserInterests);

export default router;
