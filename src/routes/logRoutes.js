import express from "express";
import auth from "../middleware/authMiddleware.js";
import { listarLogs } from "../controllers/logController.js";

const router = express.Router();

router.get("/", auth, listarLogs);

export default router;
