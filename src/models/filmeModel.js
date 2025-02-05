import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const FilmeSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  titulo: { type: String, required: true },
  sinopse: String,
  ano: String,
  genero: String,
  estado: {
    type: String,
    enum: [
      "A assistir",
      "Assistido",
      "Avaliado",
      "Recomendado",
      "Não recomendado",
    ],
    default: "A assistir",
  },
  nota: { type: Number, min: 0, max: 5, default: null }, // Apenas se avaliado
  historico: [{ acao: String, timestamp: Date }],
});

export default mongoose.model("Filme", FilmeSchema);
