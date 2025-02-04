import logger from "../config/logger.js";

const logMiddleware = (req, res, next) => {
  logger.info({
    metodo: req.method,
    url: req.originalUrl,
    timestamp: new Date(),
  });
  next();
};

export default logMiddleware;
