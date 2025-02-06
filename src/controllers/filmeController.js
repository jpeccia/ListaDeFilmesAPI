import FilmeModel from "../models/filmeModel.js";
import { buscarFilmeTMDB } from "../services/tmdbService.js";
import { v4 as uuidv4 } from "uuid";

/**
 * @swagger
 * tags:
 *   - name: Filmes
 *     description: Operações relacionadas a filmes
 */

/**
 * @swagger
 * /filme:
 *   get:
 *     summary: Lista filmes com paginação e filtragem por estado.
 *     tags: [Filmes]
 *     security:
 *       - BasicAuth: []
 *     parameters:
 *       - name: estado
 *         in: query
 *         description: Estado do filme para filtragem (A assistir, Assistido, Avaliado, Recomendado, Não recomendado)
 *         required: false
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Número da página para a paginação
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Número de itens por página
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de filmes com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalFilmes:
 *                   type: integer
 *                   description: Total de filmes encontrados.
 *                 paginaAtual:
 *                   type: integer
 *                   description: Página atual.
 *                 totalPaginas:
 *                   type: integer
 *                   description: Total de páginas.
 *                 filmes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Filme'
 *       400:
 *         description: Estado inválido informado.
 *       500:
 *         description: Erro ao buscar filmes.
 */
export const listarFilmes = async (req, res) => {
  try {
    const { estado, page = 1, limit = 10 } = req.query;

    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);

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

    const totalFilmes = await FilmeModel.countDocuments(filtro);

    const filmes = await FilmeModel.find(filtro)
      .skip((pageInt - 1) * limitInt)
      .limit(limitInt);

    const totalPaginas = Math.ceil(totalFilmes / limitInt);

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

/**
 * @swagger
 * /filme/{id}:
 *   get:
 *     summary: Obtém os detalhes de um filme pelo ID.
 *     tags: [Filmes]
 *     security:
 *       - BasicAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do filme
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do filme.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Filme'
 *       404:
 *         description: Filme não encontrado.
 *       500:
 *         description: Erro ao buscar filme.
 */
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

/**
 * @swagger
 * /filme:
 *   post:
 *     summary: Adiciona um novo filme.
 *     tags: [Filmes]
 *     security:
 *       - BasicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título do filme
 *                 example: Inception
 *     responses:
 *       201:
 *         description: Filme adicionado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Filme'  # Agora o modelo existe!
 *       400:
 *         description: Título do filme é obrigatório ou inválido.
 *       404:
 *         description: Filme não encontrado na TMDB.
 *       500:
 *         description: Erro ao adicionar filme.
 */
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

/**
 * @swagger
 * /filme/{id}/estado:
 *   put:
 *     summary: Atualiza o estado de um filme. (A assistir, Assistido, Avaliado, Recomendado, Não recomendado)
 *     tags: [Filmes]
 *     security:
 *       - BasicAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do filme
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [A assistir, Assistido, Avaliado, Recomendado, Não recomendado]
 *                 description: Novo estado do filme
 *     responses:
 *       200:
 *         description: Estado atualizado com sucesso.
 *       400:
 *         description: Estado inválido ou transição inválida de estado.
 *       404:
 *         description: Filme não encontrado.
 *       500:
 *         description: Erro ao atualizar estado.
 */
export const atualizarEstado = async (req, res) => {
  const { id } = req.params;
  let { estado } = req.body;

  if (typeof estado === "string") {
    estado = estado.trim();
  }

  const estadosValidos = [
    "A assistir",
    "Assistido",
    "Avaliado",
    "Recomendado",
    "Não recomendado",
  ];

  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ mensagem: "Estado inválido." });
  }

  try {
    const filme = await FilmeModel.findById(id);
    if (!filme) {
      return res.status(404).json({ mensagem: "Filme não encontrado." });
    }

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
      .json({ mensagem: "Erro ao atualizar estado.", erro: error.message });
  }
};

/**
 * @swagger
 * /filme/{id}/avaliar:
 *   put:
 *     summary: Avalia um filme (0 a 5).
 *     tags: [Filmes]
 *     security:
 *       - BasicAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do filme
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nota:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 5
 *                 description: Nota para avaliação do filme (0 a 5)
 *     responses:
 *       200:
 *         description: Filme avaliado com sucesso.
 *       400:
 *         description: Nota inválida ou filme não assistido.
 *       404:
 *         description: Filme não encontrado.
 *       500:
 *         description: Erro ao avaliar filme.
 */
export const avaliarFilme = async (req, res) => {
  const { id } = req.params;
  let { nota } = req.body;

  nota = Number(nota);

  if (isNaN(nota) || nota < 0 || nota > 5) {
    return res
      .status(400)
      .json({ mensagem: "A nota deve ser um número entre 0 e 5." });
  }

  try {
    const filme = await FilmeModel.findById(id);
    if (!filme) {
      return res.status(404).json({ mensagem: "Filme não encontrado" });
    }

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

/**
 * @swagger
 * /filme/{id}/historico:
 *   get:
 *     summary: Retorna o histórico de ações de um filme.
 *     tags: [Filmes]
 *     security:
 *       - BasicAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do filme
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Histórico do filme retornado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   acao:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *       404:
 *         description: Filme não encontrado.
 *       500:
 *         description: Erro ao buscar histórico.
 */
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Filme:
 *       type: object
 *       required:
 *         - titulo
 *         - estado
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único do filme
 *         titulo:
 *           type: string
 *           description: Título do filme
 *         sinopse:
 *           type: string
 *           description: Sinopse do filme
 *         ano:
 *           type: string
 *           description: Ano de lançamento do filme
 *         genero:
 *           type: string
 *           description: Gênero do filme
 *         estado:
 *           type: string
 *           description: Estado do filme (A assistir, Assistido, Avaliado, etc.)
 *         nota:
 *           type: integer
 *           description: Nota de avaliação do filme
 *           minimum: 0
 *           maximum: 5
 *         historico:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               acao:
 *                 type: string
 *                 description: Ação realizada no filme
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora da ação
 */
