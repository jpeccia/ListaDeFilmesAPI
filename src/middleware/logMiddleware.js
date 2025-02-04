import logger, { salvarLogNoBanco } from "../config/logger.js";

const logMiddleware = async (req, res, next) => {
  const start = process.hrtime(); // Captura o tempo inicial da requisição

  res.on("finish", async () => {
    const duration = process.hrtime(start);
    const responseTime = `${(duration[0] * 1000 + duration[1] / 1e6).toFixed(
      2
    )}ms`;

    // Tenta obter o ID do filme, se aplicável
    const idFilme = req.params.id || (req.body && req.body.idFilme) || null;

    const logData = {
      metodo: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime,
      idFilme,
      mensagem: "Requisição registrada",
    };

    logger.info(logData);
    await salvarLogNoBanco(logData);
  });

  next();
};

export default logMiddleware;
