import { createLogger, format, transports } from "winston";
import LogModel from "../models/logModel.js";

const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(), // Exibe logs no console
    new transports.File({ filename: "logs/app.log" }), // Salva logs em arquivo
  ],
});

// Função para salvar logs no banco
export const salvarLogNoBanco = async (logData) => {
  try {
    await LogModel.create(logData);
  } catch (error) {
    console.error("Erro ao salvar log no banco:", error);
  }
};

export default logger;
