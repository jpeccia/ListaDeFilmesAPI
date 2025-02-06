import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import {
  logRequisicao,
  logErro,
  logPerformance,
} from "./middleware/logMiddleware.js";
import filmeRoutes from "./routes/filmeRoutes.js";
import logRoutes from "./routes/logRoutes.js";

dotenv.config();

const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Lista de Filmes API - Carefy",
      version: "1.0.0",
      description:
        "API para gerenciamento de filmes assistidos, avaliados e recomendados. Com integração de logs",
    },
    servers: [{ url: "http://localhost:3000", description: "Servidor Local" }],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

const specs = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(logRequisicao);
app.use(logPerformance);

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

app.use("/filme", filmeRoutes);
app.use("/logs", logRoutes);

app.use((req, res, next) => {
  const erro = new Error("Erro interno do servidor");
  erro.status = 500;
  next(erro);
});

app.use(logErro);

export default app;
