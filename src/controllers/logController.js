import LogModel from "../models/logModel.js";

export const listarLogs = async (req, res) => {
  try {
    const logs = await LogModel.find();
    res.json(logs);
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: "Erro ao buscar logs", erro: error.message });
  }
};
