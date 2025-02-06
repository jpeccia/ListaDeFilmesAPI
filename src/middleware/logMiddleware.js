import logger from "../config/logger.js";
import LogModel from "../models/logModel.js";

export const logRequisicao = async (req, res, next) => {
  const start = process.hrtime(); 

  const logData = {
    tipo: "request",
    metodo: req.method,
    url: req.originalUrl,
    status: null, 
    responseTime: null, 
    mensagem: "Requisição recebida",
  };

  const logEntry = await LogModel.create(logData); 

  res.on("finish", async () => {
    const duration = process.hrtime(start);
    const responseTime = `${(duration[0] * 1000 + duration[1] / 1e6).toFixed(
      2
    )}ms`;

    await LogModel.findByIdAndUpdate(logEntry._id, {
      status: res.statusCode,
      responseTime,
      mensagem: "Requisição registrada",
    });

    logger.info({ ...logData, status: res.statusCode, responseTime });
  });

  next();
};

export const logErro = (err, req, res, next) => {
  const status = err.status || 500; 
  const logData = {
    tipo: "error",
    metodo: req.method,
    url: req.originalUrl,
    status,
    mensagem: err.message || "Erro desconhecido",
  };

  logger.error(logData);

  LogModel.create(logData).catch((e) =>
    console.error("Erro ao salvar log:", e)
  );

  res.status(status).json({ mensagem: "Erro interno do servidor" });
};

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
