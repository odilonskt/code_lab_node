import type { TipoMovimentacao } from "../../generated/prisma/index.js";
import type { Request, Response } from "express";
import { movimentacaoService } from "../services/movimentacao.service.js";

export class MovimentacaoController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const movimentacao = await movimentacaoService.create(req.body);
      res.status(201).json({
        success: true,
        data: movimentacao,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const { skip, take, produtoId, usuarioId, tipo, dataInicio, dataFim } =
        req.query;

      const params: {
        skip?: number;
        take?: number;
        produtoId?: string;
        usuarioId?: string;
        tipo?: TipoMovimentacao;
        dataInicio?: Date;
        dataFim?: Date;
      } = {};

      if (skip) params.skip = Number(skip);
      if (take) params.take = Number(take);
      if (produtoId) params.produtoId = produtoId as string;
      if (usuarioId) params.usuarioId = usuarioId as string;
      if (tipo) params.tipo = tipo as TipoMovimentacao;
      if (dataInicio) params.dataInicio = new Date(dataInicio as string);
      if (dataFim) params.dataFim = new Date(dataFim as string);

      const movimentacoes = await movimentacaoService.list(params);

      res.json({
        success: true,
        data: movimentacoes,
        count: movimentacoes.length,
      });
    } catch (error) {
      console.error("Erro ao listar movimentações:", error);
      res.status(500).json({ error: "Erro ao listar movimentações" });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || Array.isArray(id)) {
        res.status(400).json({ error: "ID é obrigatório" });
        return;
      }

      const movimentacao = await movimentacaoService.getById(id);

      if (!movimentacao) {
        res.status(404).json({ error: "Movimentação não encontrada" });
        return;
      }

      res.json({
        success: true,
        data: movimentacao,
      });
    } catch (error) {
      console.error("Erro ao buscar movimentação:", error);
      res.status(500).json({ error: "Erro ao buscar movimentação" });
    }
  }

  async getRelatorio(req: Request, res: Response): Promise<void> {
    try {
      const relatorio = await movimentacaoService.getRelatorioEstoque();
      res.json({
        success: true,
        data: relatorio,
      });
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      res.status(500).json({ error: "Erro ao gerar relatório" });
    }
  }
}

export const movimentacaoController = new MovimentacaoController();
