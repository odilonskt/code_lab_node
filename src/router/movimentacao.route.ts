import { Router } from "express";
import { movimentacaoController } from "../controller/movimentacao.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Movimentações
 *   description: Registro de entradas, saídas e ajustes de estoque
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Movimentacao:
 *       type: object
 *       required:
 *         - produtoId
 *         - usuarioId
 *         - tipo
 *         - quantidade
 *       properties:
 *         id:
 *           type: string
 *         produtoId:
 *           type: string
 *         usuarioId:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [ENTRADA, SAIDA, AJUSTE]
 *         quantidade:
 *           type: integer
 *         dataHora:
 *           type: string
 *           format: date-time
 *         motivo:
 *           type: string
 *         observacao:
 *           type: string
 *         criadoEm:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         produto:
 *           $ref: '#/components/schemas/Produto'
 *         usuario:
 *           $ref: '#/components/schemas/Usuario'
 *     CreateMovimentacaoDTO:
 *       type: object
 *       required:
 *         - produtoId
 *         - usuarioId
 *         - tipo
 *         - quantidade
 *       properties:
 *         produtoId:
 *           type: string
 *         usuarioId:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [ENTRADA, SAIDA, AJUSTE]
 *         quantidade:
 *           type: integer
 *         motivo:
 *           type: string
 *         observacao:
 *           type: string
 */

/**
 * @swagger
 * /api/movimentacoes:
 *   post:
 *     summary: Registra uma nova movimentação de estoque
 *     tags: [Movimentações]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMovimentacaoDTO'
 *     responses:
 *       201:
 *         description: Movimentação criada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Movimentacao'
 *       400:
 *         description: Erro de validação (produto inativo, estoque insuficiente, etc.)
 */
router.post("/", movimentacaoController.create.bind(movimentacaoController));

/**
 * @swagger
 * /api/movimentacoes:
 *   get:
 *     summary: Lista movimentações com filtros
 *     tags: [Movimentações]
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *       - in: query
 *         name: produtoId
 *         schema:
 *           type: string
 *       - in: query
 *         name: usuarioId
 *         schema:
 *           type: string
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [ENTRADA, SAIDA, AJUSTE]
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista de movimentações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movimentacao'
 *                 count:
 *                   type: integer
 */
router.get("/", movimentacaoController.list.bind(movimentacaoController));

/**
 * @swagger
 * /api/movimentacoes/relatorio:
 *   get:
 *     summary: Gera relatório de estoque (produtos, totais, baixo estoque, estatísticas)
 *     tags: [Movimentações]
 *     responses:
 *       200:
 *         description: Relatório gerado
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
 *                     totalItens:
 *                       type: integer
 *                     produtosBaixoEstoque:
 *                       type: integer
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
 */
router.get(
  "/relatorio",
  movimentacaoController.getRelatorio.bind(movimentacaoController),
);

/**
 * @swagger
 * /api/movimentacoes/{id}:
 *   get:
 *     summary: Retorna uma movimentação específica
 *     tags: [Movimentações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados da movimentação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Movimentacao'
 *       404:
 *         description: Movimentação não encontrada
 */
router.get("/:id", movimentacaoController.getById.bind(movimentacaoController));

export default router;
