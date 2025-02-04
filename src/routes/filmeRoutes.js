import express from 'express';
import autenticacao from '../middleware/authMiddleware.js';
import { adicionarFilme } from '../controllers/filmeController.js';

const router = express.Router();

router.post('/', autenticacao, adicionarFilme);

export default router;
