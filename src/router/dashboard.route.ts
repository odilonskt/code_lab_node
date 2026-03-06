import { Router } from "express";
import { dashboardController } from "../controller/dashboard.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Estatísticas e visão geral do sistema
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Retorna dados consolidados para o dashboard
 *     description: Retorna estatísticas gerais do sistema incluindo total de usuários, produtos, movimentações e outras métricas. Requer autenticação e perfil de ADMIN.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do dashboard retornados com sucesso
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
 *                     totalUsuarios:
 *                       type: integer
 *                       example: 10
 *                     totalProdutos:
 *                       type: integer
 *                       example: 50
 *                     totalMovimentacoes:
 *                       type: integer
 *                       example: 100
 *                     produtosAtivos:
 *                       type: integer
 *                       example: 45
 *                     produtosInativos:
 *                       type: integer
 *                       example: 5
 *                     usuariosAtivos:
 *                       type: integer
 *                       example: 8
 *                     ultimoMes:
 *                       type: object
 *                       properties:
 *                         entradas:
 *                           type: integer
 *                         saidas:
 *                           type: integer
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
router.get(
  "/",
  authenticate,
  requireAdmin,
  dashboardController.getDashboard.bind(dashboardController),
);

export default router;
