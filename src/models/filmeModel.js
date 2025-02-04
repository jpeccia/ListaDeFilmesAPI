import mongoose from "mongoose";

const FilmeSchema = new mongoose.Schema({
  id_filme: String,
  titulo: String,
  sinopse: String,
  ano: String,
  genero: String,
  estado: { type: String, default: "A assistir" },
  historico: [{ acao: String, timestamp: Date }],
});

export default mongoose.model("Filme", FilmeSchema);
