import FilmeModel from "../models/filmeModel.js";
import { buscarFilmeTMDB } from "../services/tmdbService.js";
import { v4 as uuidv4 } from "uuid";

export const adicionarFilme = async (req, res) => {
  const { titulo } = req.body;
  if (!titulo)
    return res
      .status(400)
      .json({ mensagem: "O título do filme é obrigatório." });

  const filmeInfo = await buscarFilmeTMDB(titulo);
  if (!filmeInfo)
    return res.status(404).json({ mensagem: "Filme não encontrado na TMDB." });

  const novoFilme = new FilmeModel({
    id_filme: uuidv4(),
    titulo: filmeInfo.title,
    sinopse: filmeInfo.overview,
    ano: filmeInfo.release_date
      ? filmeInfo.release_date.split("-")[0]
      : "Desconhecido",
    genero: filmeInfo.genre_ids[0],
    estado: "A assistir",
    historico: [{ acao: "Filme adicionado", timestamp: new Date() }],
  });

  await novoFilme.save();
  res.status(201).json(novoFilme);
};
