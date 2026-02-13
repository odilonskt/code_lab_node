import { Router } from "express";
import { usuarioController } from "../controller/usuario.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - perfil
 *       properties:
 *         id:
 *           type: string
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         perfil:
 *           type: string
 *           enum: [ADMIN, OPERADOR]
 *         ativo:
 *           type: boolean
 *         criadoEm:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateUsuarioDTO:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - perfil
 *       properties:
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         perfil:
 *           type: string
 *           enum: [ADMIN, OPERADOR]
 *     UpdateUsuarioDTO:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         perfil:
 *           type: string
 *           enum: [ADMIN, OPERADOR]
 *         ativo:
 *           type: boolean
 */

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUsuarioDTO'
 *     responses:
 *       201:
 *         description: Usuário criado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Email já em uso ou dados inválidos
 */
router.post("/", usuarioController.create.bind(usuarioController));

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista usuários com filtros
 *     tags: [Usuários]
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
 *         name: perfil
 *         schema:
 *           type: string
 *           enum: [ADMIN, OPERADOR]
 *       - in: query
 *         name: ativo
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de usuários
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
 *                     $ref: '#/components/schemas/Usuario'
 *                 count:
 *                   type: integer
 */
router.get("/", usuarioController.list.bind(usuarioController));

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Busca usuário por ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/:id", usuarioController.getById.bind(usuarioController));

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUsuarioDTO'
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Usuário não encontrado
 */
router.put("/:id", usuarioController.update.bind(usuarioController));

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Remove (ou desativa) um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Usuário removido/desativado
 *       400:
 *         description: Erro
 */
router.delete("/:id", usuarioController.delete.bind(usuarioController));

export default router;
