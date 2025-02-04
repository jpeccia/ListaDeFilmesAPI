import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import {
  logRequisicao,
  logErro,
  logPerformance,
} from "./middleware/logMiddleware.js";
import filmeRoutes from "./routes/filmeRoutes.js";
import logRoutes from "./routes/logRoutes.js";

dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

app.use(helmet());
app.use(cors());
app.use(express.json());

// Middleware de logs
app.use(logRequisicao);
app.use(logPerformance);

// Proteção contra DDoS
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Rotas
app.use("/filme", filmeRoutes);
app.use("/logs", logRoutes);

// Middleware de captura de erros
app.use(logErro);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Servidor rodando na porta ${PORT}`));

export default app;
