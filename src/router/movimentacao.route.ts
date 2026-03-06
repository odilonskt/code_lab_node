import { Router } from "express";
import { movimentacaoController } from "../controller/movimentacao.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate, validateQuery } from "../middleware/validate.js";
import {
  createMovimentacaoSchema,
  listMovimentacaoQuerySchema,
} from "../schemas/movimentacao.schema.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Movimentações
 *   description: Registro de entradas, saídas e ajustes de estoque
 */

/**
 * @swagger
 * /api/movimentacoes:
 *   post:
 *     summary: Registra uma nova movimentação de estoque
 *     description: Cria um registro de entrada, saída ou ajuste de estoque
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMovimentacaoDTO'
 *           example:
 *             produtoId: "uuid-do-produto"
 *             tipo: "ENTRADA"
 *             quantidade: 10
 *             motivo: "Reposição de estoque"
 *             observacao: "Compra de fornecedores"
 *     responses:
 *       201:
 *         description: Movimentação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Erro de validação (produto inativo, estoque insuficiente, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unauthorized'
 */
router.post(
  "/",
  authenticate,
  validate(createMovimentacaoSchema),
  movimentacaoController.create.bind(movimentacaoController),
);

/**
 * @swagger
 * /api/movimentacoes:
 *   get:
 *     summary: Lista movimentações com filtros
 *     description: Retorna uma lista paginada de movimentações com opções de filtragem
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de registros para pular
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Limite de registros
 *       - in: query
 *         name: produtoId
 *         schema:
 *           type: string
 *         description: Filtrar por produto
 *       - in: query
 *         name: usuarioId
 *         schema:
 *           type: string
 *         description: Filtrar por usuário
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [ENTRADA, SAIDA, AJUSTE]
 *         description: Filtrar por tipo de movimentação
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para filtragem
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para filtragem
 *     responses:
 *       200:
 *         description: Lista de movimentações
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unauthorized'
 */
router.get(
  "/",
  authenticate,
  validateQuery(listMovimentacaoQuerySchema),
  movimentacaoController.list.bind(movimentacaoController),
);

/**
 * @swagger
 * /api/movimentacoes/relatorio:
 *   get:
 *     summary: Gera relatório de estoque
 *     description: Retorna dados consolidados do estoque incluindo produtos, totais, produtos com baixo estoque e estatísticas
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalProdutos:
 *                       type: integer
 *                       example: 50
 *                     totalItens:
 *                       type: integer
 *                       example: 1000
 *                     produtosBaixoEstoque:
 *                       type: integer
 *                       example: 5
 *                     valorTotal:
 *                       type: number
 *                       example: 50000.00
 *                     estatisticas:
 *                       type: object
 *                       additionalProperties:
 *                         type: object
 *                         properties:
 *                           total:
 *                             type: integer
 *                           quantidade:
 *                             type: integer
 *                           produtos:
 *                             type: integer
 *                     produtos:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Produto'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unauthorized'
 */
router.get(
  "/relatorio",
  authenticate,
  movimentacaoController.getRelatorio.bind(movimentacaoController),
);

/**
 * @swagger
 * /api/movimentacoes/{id}:
 *   get:
 *     summary: Retorna uma movimentação específica
 *     description: Busca os dados de uma movimentação específica pelo ID
 *     tags: [Movimentações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da movimentação
 *     responses:
 *       200:
 *         description: Dados da movimentação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Movimentação não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFound'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unauthorized'
 */
router.get(
  "/:id",
  authenticate,
  movimentacaoController.getById.bind(movimentacaoController),
);

export default router;
