import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  atualizarEstado,
  avaliarFilme,
  historicoFilme,
} from "../controllers/filmeController.js";

const router = express.Router();

router.put("/:id/estado", auth, atualizarEstado);
router.post("/:id/avaliar", auth, avaliarFilme);
router.get("/:id/historico", auth, historicoFilme);

export default router;
