import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  atualizarEstado,
  avaliarFilme,
  historicoFilme,
  adicionarFilme,
  listarFilmes,
  detalhesFilme
} from "../controllers/filmeController.js";

const router = express.Router();

router.post('/', auth, adicionarFilme);
router.get('/', auth, listarFilmes);
router.get('/:id', auth, detalhesFilme);
router.put('/:id/estado', auth, atualizarEstado);
router.post('/:id/avaliar', auth, avaliarFilme);
router.get('/:id/historico', auth, historicoFilme);

export default router;
