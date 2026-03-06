import { Router } from "express";
import { authController } from "../controller/auth.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  loginSchema,
  registerAdminSchema,
  registerSchema,
} from "../schemas/auth.schema.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints para registro e login de usuários
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     description: Cria um novo usuário no sistema com perfil OPERADOR por padrão
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDTO'
 *           example:
 *             nome: "João Silva"
 *             email: "joao@exemplo.com"
 *             password: "senha123"
 *             perfil: "OPERADOR"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Dados inválidos ou email já em uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/register",
  validate(registerSchema),
  authController.register.bind(authController),
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuário
 *     description: Autentica qualquer usuário (ADMIN ou OPERADOR)
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDTO'
 *           example:
 *             email: "admin@exemplo.com"
 *             password: "senha123"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/login",
  validate(loginSchema),
  authController.login.bind(authController),
);

/**
 * @swagger
 * /api/auth/login-admin:
 *   post:
 *     summary: Login de administrador
 *     description: Autentica apenas usuários com perfil ADMIN
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDTO'
 *           example:
 *             email: "admin@exemplo.com"
 *             password: "senha123"
 *     responses:
 *       200:
 *         description: Login de admin bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Usuário não é administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/login-admin",
  validate(loginSchema),
  authController.loginAdmin.bind(authController),
);

/**
 * @swagger
 * /api/auth/register-admin:
 *   post:
 *     summary: Cria um novo administrador
 *     description: Registra um novo usuário com perfil ADMIN. Requer token de admin válido.
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDTO'
 *           example:
 *             nome: "Admin Principal"
 *             email: "admin@exemplo.com"
 *             password: "senhaAdmin123"
 *             perfil: "ADMIN"
 *     responses:
 *       201:
 *         description: Administrador criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Dados inválidos ou email já em uso
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
 *         description: Acesso negado - apenas administradores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Forbidden'
 */
router.post(
  "/register-admin",
  authenticate,
  requireAdmin,
  validate(registerAdminSchema),
  authController.registerAdmin.bind(authController),
);

export default router;
