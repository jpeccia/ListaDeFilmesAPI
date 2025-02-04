import LogModel from "../models/logModel.js";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BasicAuth:
 *       type: http
 *       scheme: basic
 *       description: Autenticação básica para acessar os logs
 *
 *   schemas:
 *     Log:
 *       type: object
 *       required:
 *         - tipo
 *         - timestamp
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do log (gerado automaticamente pelo MongoDB)
 *         tipo:
 *           type: string
 *           enum: [request, error, performance]
 *           description: Tipo de log (pode ser "request", "error" ou "performance")
 *         metodo:
 *           type: string
 *           description: Método HTTP (GET, POST, etc.) da requisição
 *         url:
 *           type: string
 *           description: URL da requisição ou erro
 *         status:
 *           type: integer
 *           description: Código de status HTTP da resposta (ex: 200, 404, 500)
 *         responseTime:
 *           type: string
 *           description: Tempo de resposta da requisição (em milissegundos)
 *         mensagem:
 *           type: string
 *           description: Mensagem detalhada sobre o log (ex: erro ou descrição da requisição)
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Data e hora em que o log foi gerado
 */

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Retorna uma lista de todos os logs registrados. Requer autenticação.
 *     tags: [Logs]
 *     security:
 *       - BasicAuth: []  # Especifica que é necessário autenticação básica
 *     responses:
 *       200:
 *         description: Lista de logs.
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Log'  # Referência ao modelo Log
 *       401:
 *         description: Não autorizado. A autenticação é necessária para acessar os logs.
 *       500:
 *         description: Erro ao buscar logs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   description: Descrição do erro
 *                 erro:
 *                   type: string
 *                   description: Detalhes do erro
 */
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
