import logger from "../config/logger.js";
import LogModel from "../models/logModel.js";

// 🔹 Middleware de logs de requisição
export const logRequisicao = async (req, res, next) => {
  const start = process.hrtime(); // Captura o tempo inicial da requisição

  // 🔹 Registra a requisição imediatamente
  const logData = {
    tipo: "request",
    metodo: req.method,
    url: req.originalUrl,
    status: null, // Ainda não temos o status da resposta
    responseTime: null, // Ainda não sabemos o tempo de resposta
    mensagem: "Requisição recebida",
  };

  const logEntry = await LogModel.create(logData); // Insere o log inicialmente

  res.on("finish", async () => {
    const duration = process.hrtime(start);
    const responseTime = `${(duration[0] * 1000 + duration[1] / 1e6).toFixed(
      2
    )}ms`;

    // 🔹 Atualiza o log com status e tempo de resposta
    await LogModel.findByIdAndUpdate(logEntry._id, {
      status: res.statusCode,
      responseTime,
      mensagem: "Requisição registrada",
    });

    logger.info({ ...logData, status: res.statusCode, responseTime });
  });

  next();
};

// 🔹 Middleware para capturar erros
export const logErro = (err, req, res, next) => {
  const status = err.status || 500; // Pega o status do erro ou usa 500
  const logData = {
    tipo: "error",
    metodo: req.method,
    url: req.originalUrl,
    status,
    mensagem: err.message || "Erro desconhecido",
  };

  logger.error(logData);

  // Salva o log no banco sem bloquear a resposta ao cliente
  LogModel.create(logData).catch((e) =>
    console.error("Erro ao salvar log:", e)
  );

  res.status(status).json({ mensagem: "Erro interno do servidor" });
};

// 🔹 Middleware para medir desempenho
export const logPerformance = async (req, res, next) => {
  const start = process.hrtime();

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
