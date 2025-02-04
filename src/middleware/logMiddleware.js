import logger from "../config/logger.js";
import LogModel from "../models/logModel.js";

// 🔹 Middleware de logs de requisição
export const logRequisicao = async (req, res, next) => {
  const start = process.hrtime(); // Captura o tempo inicial da requisição

  res.on("finish", async () => {
    const duration = process.hrtime(start);
    const responseTime = `${(duration[0] * 1000 + duration[1] / 1e6).toFixed(
      2
    )}ms`;

    const logData = {
      tipo: "request",
      metodo: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime,
      mensagem: "Requisição registrada",
    };

    logger.info(logData);
    await LogModel.create(logData);
  });

  next();
};

// 🔹 Middleware para capturar erros
export const logErro = async (err, req, res, next) => {
  const logData = {
    tipo: "error",
    metodo: req.method,
    url: req.originalUrl,
    status: res.statusCode || 500,
    mensagem: err.message,
  };

  logger.error(logData);
  await LogModel.create(logData);

  res.status(500).json({ mensagem: "Erro interno do servidor" });
};

// 🔹 Middleware para medir desempenho
export const logPerformance = async (req, res, next) => {
  const start = process.hrtime(); // Tempo inicial

  res.on("finish", async () => {
    const duration = process.hrtime(start);
    const responseTime = `${(duration[0] * 1000 + duration[1] / 1e6).toFixed(
      2
    )}ms`;

    const logData = {
      tipo: "performance",
      metodo: req.method,
      url: req.originalUrl,
      responseTime,
      mensagem: "Tempo de resposta registrado",
    };

    logger.info(logData);
    await LogModel.create(logData);
  });

  next();
};
