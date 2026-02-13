import type { Request, Response } from "express";
import type { StatusProduto } from "../../generated/prisma/index.js";
import { produtoService } from "../services/produto.service.js";
export class ProdutoController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const produto = await produtoService.create(req.body);
      res.status(201).json({
        success: true,
        data: produto,
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
      const { skip, take, categoria, status, ativo, search } = req.query;

      const params: {
        skip?: number;
        take?: number;
        categoria?: string;
        status?: StatusProduto;
        ativo?: boolean;
        search?: string;
      } = {};

      if (skip) params.skip = Number(skip);
      if (take) params.take = Number(take);
      if (categoria) params.categoria = categoria as string;
      if (status) params.status = status as StatusProduto;
      if (ativo) params.ativo = ativo === "true";
      if (search) params.search = search as string;

      const produtos = await produtoService.list({
        ...params,
      });

      res.json({
        success: true,
        data: produtos,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar produtos" });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || Array.isArray(id)) {
        res.status(400).json({ error: "ID é obrigatório" });
        return;
      }

      const produto = await produtoService.getById(id);

      if (!produto) {
        res.status(404).json({ error: "Produto não encontrado" });
        return;
      }

      res.json({
        success: true,
        data: produto,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar produto" });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const produto = await produtoService.update({
        id,
        ...req.body,
      });

      res.json({
        success: true,
        data: produto,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || Array.isArray(id)) {
        res.status(400).json({ error: "ID é obrigatório" });
        return;
      }

      await produtoService.delete(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }
}

export const produtoController = new ProdutoController();
