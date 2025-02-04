import FilmeModel from "../models/filmeModel.js";
import { buscarFilmeTMDB } from "../services/tmdbService.js";
import { v4 as uuidv4 } from "uuid";

export const listarFilmes = async (req, res) => {
  try {
    const { estado, page = 1, limit = 10 } = req.query;

    // Converte page e limit para números inteiros
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);

    // Cria o filtro, se o parâmetro estado for informado
    const filtro = {};
    if (estado) {
      const estadosValidos = [
        "A assistir",
        "Assistido",
        "Avaliado",
        "Recomendado",
        "Não recomendado",
      ];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({
          mensagem:
            "Estado inválido. Estados permitidos: A assistir, Assistido, Avaliado, Recomendado, Não recomendado",
        });
      }
      filtro.estado = estado;
    }

    // Conta o total de documentos que correspondem ao filtro
    const totalFilmes = await FilmeModel.countDocuments(filtro);

    // Busca os filmes com paginação
    const filmes = await FilmeModel.find(filtro)
      .skip((pageInt - 1) * limitInt)
      .limit(limitInt);

    // Calcula o número total de páginas
    const totalPaginas = Math.ceil(totalFilmes / limitInt);

    // Retorna os dados com as informações de paginação
    res.json({
      totalFilmes,
      paginaAtual: pageInt,
      totalPaginas,
      filmes,
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao buscar filmes",
      erro: error.message,
    });
  }
};

export const detalhesFilme = async (req, res) => {
  try {
    const filme = await FilmeModel.findById(req.params.id);
    if (!filme) {
      return res.status(404).json({ mensagem: "Filme não encontrado" });
    }
    res.json(filme);
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: "Erro ao buscar filme", erro: error.message });
  }
};

export const adicionarFilme = async (req, res) => {
  const { titulo } = req.body;

  if (!titulo) {
    return res
      .status(400)
      .json({ mensagem: "O título do filme é obrigatório." });
  }

  try {
    const filmeInfo = await buscarFilmeTMDB(titulo);

    if (!filmeInfo) {
      return res
        .status(404)
        .json({ mensagem: "Filme não encontrado na TMDB." });
    }

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
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: "Erro ao adicionar filme", erro: error.message });
  }
};

export const atualizarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const estadosValidos = [
    "A assistir",
    "Assistido",
    "Avaliado",
    "Recomendado",
    "Não recomendado",
  ];

  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ mensagem: "Estado inválido" });
  }

  try {
    const filme = await FilmeModel.findById(id);
    if (!filme)
      return res.status(404).json({ mensagem: "Filme não encontrado" });

    // Validações de transição de estados
    if (estado === "Avaliado" && filme.estado !== "Assistido") {
      return res.status(400).json({
        mensagem: "O filme deve ser assistido antes de ser avaliado.",
      });
    }

    if (
      (estado === "Recomendado" || estado === "Não recomendado") &&
      filme.estado !== "Avaliado"
    ) {
      return res.status(400).json({
        mensagem: "O filme deve ser avaliado antes de ser recomendado.",
      });
    }

    filme.estado = estado;
    filme.historico.push({
      acao: `Filme movido para ${estado}`,
      timestamp: new Date(),
    });

    await filme.save();
    res.json({
      mensagem: `Estado atualizado para ${estado} com sucesso!`,
      filme,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: "Erro ao atualizar estado", erro: error.message });
  }
};

export const avaliarFilme = async (req, res) => {
  const { id } = req.params;
  const { nota } = req.body;

  if (nota < 0 || nota > 5) {
    return res.status(400).json({ mensagem: "A nota deve ser entre 0 e 5." });
  }

  try {
    const filme = await FilmeModel.findById(id);
    if (!filme)
      return res.status(404).json({ mensagem: "Filme não encontrado" });

    if (filme.estado !== "Assistido") {
      return res.status(400).json({
        mensagem: "O filme deve ser assistido antes de ser avaliado.",
      });
    }

    filme.estado = "Avaliado";
    filme.nota = nota;
    filme.historico.push({
      acao: `Filme avaliado com nota ${nota}`,
      timestamp: new Date(),
    });

    await filme.save();
    res.json({ mensagem: "Filme avaliado com sucesso!", filme });
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: "Erro ao avaliar filme", erro: error.message });
  }
};

export const historicoFilme = async (req, res) => {
  try {
    const filme = await FilmeModel.findById(req.params.id);
    if (!filme)
      return res.status(404).json({ mensagem: "Filme não encontrado" });

    res.json(filme.historico);
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: "Erro ao buscar histórico", erro: error.message });
  }
};
