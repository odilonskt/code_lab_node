import type { Request, Response } from "express";
import type { PerfilUsuario } from "../../generated/prisma/index.js";
import { usuarioService } from "../services/usuario.service.js";

export class UsuarioController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const usuario = await usuarioService.crate(req.body);
      res.status(201).json({
        success: true,
        data: usuario,
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
      const { skip, take, perfil, ativo, search } = req.query;

      const params: {
        skip?: number;
        take?: number;
        perfil?: PerfilUsuario;
        ativo?: boolean;
        search?: string;
      } = {};

      if (skip) params.skip = Number(skip);
      if (take) params.take = Number(take);
      if (perfil) params.perfil = perfil as PerfilUsuario;
      if (ativo !== undefined) params.ativo = ativo === "true";
      if (search) params.search = search as string;

      const usuarios = await usuarioService.list(params);

      res.json({
        success: true,
        data: usuarios,
        count: usuarios.length,
      });
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      res.status(500).json({ error: "Erro ao listar usuários" });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || Array.isArray(id)) {
        res.status(400).json({ error: "ID é obrigatório" });
        return;
      }

      const usuario = await usuarioService.getById(id);

      if (!usuario) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }

      res.json({
        success: true,
        data: usuario,
      });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const usuario = await usuarioService.update({
        id,
        ...req.body,
      });

      res.json({
        success: true,
        data: usuario,
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

      await usuarioService.delete(id);
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

export const usuarioController = new UsuarioController();
