import { Router } from "express";
import { produtoController } from "../controller/produto.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate, validateQuery } from "../middleware/validate.js";
import {
  createProdutoSchema,
  listProdutoQuerySchema,
  updateProdutoSchema,
} from "../schemas/produto.schema.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Gerenciamento de produtos do estoque
 */

/**
 * @swagger
 * /api/produtos:
 *   post:
 *     summary: Cria um novo produto
 *     description: Adiciona um novo produto ao estoque
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProdutoDTO'
 *           example:
 *             nome: "Notebook Dell Inspiron 15"
 *             descricao: "Notebook Dell Inspiron 15 5000"
 *             categoria: "Eletrônicos"
 *             quantidadeAtual: 50
 *             quantidadeMinima: 10
 *             status: "ATIVO"
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Dados inválidos
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
 *       403:
 *         description: Acesso negado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Forbidden'
 */
router.post(
  "/",
  authenticate,
  validate(createProdutoSchema),
  produtoController.create.bind(produtoController),
);

/**
 * @swagger
 * /api/produtos:
 *   get:
 *     summary: Lista todos os produtos com filtros opcionais
 *     description: Retorna uma lista paginada de produtos com opções de filtragem
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de registros para pular (paginação)
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
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
  validateQuery(listProdutoQuerySchema),
  produtoController.list.bind(produtoController),
);

/**
 * @swagger
 * /api/produtos/{id}:
 *   get:
 *     summary: Retorna um produto pelo ID
 *     description: Busca os dados de um produto específico
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
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
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Produto não encontrado
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
  produtoController.getById.bind(produtoController),
);

/**
 * @swagger
 * /api/produtos/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     description: Atualiza os dados de um produto do estoque
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
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
 *           example:
 *             nome: "Notebook Dell Atualizado"
 *             descricao: "Notebook Dell Inspiron 15 5000"
 *             categoria: "Eletrônicos"
 *             quantidadeAtual: 75
 *             quantidadeMinima: 15
 *             status: "ATIVO"
 *             ativo: true
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Produto não encontrado
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
router.put(
  "/:id",
  authenticate,
  validate(updateProdutoSchema),
  produtoController.update.bind(produtoController),
);

/**
 * @swagger
 * /api/produtos/{id}:
 *   delete:
 *     summary: Remove (desativa) um produto
 *     description: Desativa um produto do sistema (soft delete)
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       204:
 *         description: Produto desativado com sucesso
 *       400:
 *         description: Erro ao desativar produto
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
 *       403:
 *         description: Acesso negado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Forbidden'
 */
router.delete(
  "/:id",
  authenticate,
  produtoController.delete.bind(produtoController),
);

export default router;
