import { Router } from "express";
import { produtoController } from "../controller/produto.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Gerenciamento de produtos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Produto:
 *       type: object
 *       required:
 *         - nome
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-gerado do produto
 *         nome:
 *           type: string
 *         descricao:
 *           type: string
 *         categoria:
 *           type: string
 *         quantidadeAtual:
 *           type: integer
 *           default: 0
 *         status:
 *           type: string
 *           enum: [ATIVO, INATIVO, EM_MANUTENCAO]
 *         ativo:
 *           type: boolean
 *           default: true
 *         criadoEm:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateProdutoDTO:
 *       type: object
 *       required:
 *         - nome
 *         - status
 *       properties:
 *         nome:
 *           type: string
 *         descricao:
 *           type: string
 *         categoria:
 *           type: string
 *         quantidadeAtual:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [ATIVO, INATIVO, EM_MANUTENCAO]
 *     UpdateProdutoDTO:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *         descricao:
 *           type: string
 *         categoria:
 *           type: string
 *         quantidadeAtual:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [ATIVO, INATIVO, EM_MANUTENCAO]
 *         ativo:
 *           type: boolean
 */

/**
 * @swagger
 * /api/produtos:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProdutoDTO'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Erro de validação
 */
router.post("/", produtoController.create.bind(produtoController));

/**
 * @swagger
 * /api/produtos:
 *   get:
 *     summary: Lista todos os produtos com filtros opcionais
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: Número de registros para pular (paginação)
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *         description: Número de registros para retornar (paginação)
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por categoria
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ATIVO, INATIVO, EM_MANUTENCAO]
 *         description: Filtrar por status
 *       - in: query
 *         name: ativo
 *         schema:
 *           type: boolean
 *         description: Filtrar por ativo/inativo
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nome ou descrição
 *     responses:
 *       200:
 *         description: Lista de produtos
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
 *                     $ref: '#/components/schemas/Produto'
 */
router.get("/", produtoController.list.bind(produtoController));

/**
 * @swagger
 * /api/produtos/{id}:
 *   get:
 *     summary: Retorna um produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Dados do produto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 */
router.get("/:id", produtoController.getById.bind(produtoController));

/**
 * @swagger
 * /api/produtos/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProdutoDTO'
 *     responses:
 *       200:
 *         description: Produto atualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Produto não encontrado
 */
router.put("/:id", produtoController.update.bind(produtoController));

/**
 * @swagger
 * /api/produtos/{id}:
 *   delete:
 *     summary: Remove (ou desativa) um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       204:
 *         description: Produto removido/desativado com sucesso (sem conteúdo)
 *       400:
 *         description: Erro (ex.: produto não encontrado)
 */
router.delete("/:id", produtoController.delete.bind(produtoController));

export default router;
