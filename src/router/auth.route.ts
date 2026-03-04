import { Router } from "express";
import { authController } from "../controller/auth.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Registro e login de usuários
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuário (público)
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - password
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               perfil:
 *                 type: string
 *                 enum: [ADMIN, OPERADOR]
 *                 default: OPERADOR
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro de validação
 */
router.post("/register", authController.register.bind(authController));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login genérico (qualquer perfil)
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", authController.login.bind(authController));

/**
 * @swagger
 * /api/auth/login-admin:
 *   post:
 *     summary: Login exclusivo para administradores
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login de admin bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 *       403:
 *         description: Usuário não é administrador
 */
router.post("/login-admin", authController.loginAdmin.bind(authController));

/**
 * @swagger
 * /api/auth/register-admin:
 *   post:
 *     summary: Cria um novo administrador (requer token de admin)
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - password
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Administrador criado
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado (precisa ser admin)
 */
router.post(
  "/register-admin",
  authenticate,
  requireAdmin,
  authController.registerAdmin.bind(authController),
);

export default router;
