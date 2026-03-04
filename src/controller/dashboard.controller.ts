import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { movimentacaoService } from "../services/movimentacao.service.js";
import { prisma } from "../lib/prisma.js";

export class DashboardController {
  async getDashboard(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Estatísticas gerais
      const totalProdutos = await prisma.produto.count({
        where: { ativo: true },
      });
      const totalUsuarios = await prisma.usuario.count({
        where: { ativo: true },
      });
      const totalMovimentacoes = await prisma.movimentacaoEstoque.count();

      // Relatório de estoque (reutilizando serviço existente)
      const relatorio = await movimentacaoService.getRelatorioEstoque();

      // Últimas 10 movimentações
      const ultimasMovimentacoes = await prisma.movimentacaoEstoque.findMany({
        take: 10,
        orderBy: { dataHora: "desc" },
        include: {
          produto: { select: { id: true, nome: true } },
          usuario: { select: { id: true, nome: true } },
        },
      });

      res.json({
        success: true,
        data: {
          totalProdutos,
          totalUsuarios,
          totalMovimentacoes,
          ...relatorio,
          ultimasMovimentacoes,
        },
      });
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
      res.status(500).json({ error: "Erro ao carregar dashboard" });
    }
  }
}

export const dashboardController = new DashboardController();
