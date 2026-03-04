import { Router } from "express";
import { dashboardController } from "../controller/dashboard.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Estatísticas e visão geral do estoque
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Retorna dados consolidados para o dashboard (requer autenticação e perfil ADMIN)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do dashboard
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado (somente admin)
 */
router.get(
  "/",
  authenticate,
  requireAdmin,
  dashboardController.getDashboard.bind(dashboardController),
);

export default router;
