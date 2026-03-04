import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { authService } from "../services/auth.service.js";
export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { nome, email, password, perfil } = req.body;
      if (!nome || !email || !password) {
        return res
          .status(400)
          .json({ error: "Nome, email e senha são obrigatórios" });
      }
      const result = await authService.register({
        nome,
        email,
        password,
        perfil,
      });
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email e senha são obrigatórios" });
        return;
      }

      const result = await authService.login({ email, password });
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }

  async registerAdmin(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { nome, email, password } = req.body;
      if (!nome || !email || !password) {
        res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
        return;
      }

      const result = await authService.register({
        nome,
        email,
        password,
        perfil: "ADMIN",
      });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }

  async loginAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email e senha são obrigatórios" });
        return;
      }
      const result = await authService.login({ email, password });
      if (result.usuario.perfil !== "ADMIN") {
        res
          .status(403)
          .json({ error: "Acesso negado: perfil de administrador necessário" });
        return;
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }
}

export const authController = new AuthController();
