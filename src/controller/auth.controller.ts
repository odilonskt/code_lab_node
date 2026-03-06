import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { authService } from "../services/auth.service.js";
export class AuthController {
  /**
   * Registra o primeiro administrador (sem autenticação)
   * Apenas funciona quando não existe nenhum admin no sistema
   */
  async registerFirstAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { nome, email, password } = req.body;
      console.log(
        `[${new Date().toISOString()}] REGISTER-FIRST-admin: Tentativa de registro - Email: ${email}`,
      );

      if (!nome || !email || !password) {
        console.log(
          `[${new Date().toISOString()}] REGISTER-FIRST-admin: Dados inválidos`,
        );
        res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
        return;
      }

      const result = await authService.registerFirstAdmin({
        nome,
        email,
        password,
      });

      console.log(
        `[${new Date().toISOString()}] REGISTER-FIRST-admin: Sucesso - Email: ${email}, ID: ${result.usuario.id}`,
      );
      res.status(201).json({
        success: true,
        data: result,
        message: "Administrador criado com sucesso",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(
          `[${new Date().toISOString()}] REGISTER-FIRST-admin: Erro - ${error.message}`,
        );
        res.status(400).json({ error: error.message });
      } else {
        console.log(
          `[${new Date().toISOString()}] REGISTER-FIRST-admin: Erro interno`,
        );
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { nome, email, password, perfil } = req.body;
      console.log(
        `[${new Date().toISOString()}] REGISTER: Tentativa de registro - Email: ${email}, Perfil: ${perfil || "OPERADOR"}`,
      );

      if (!nome || !email || !password) {
        console.log(`[${new Date().toISOString()}] REGISTER: Dados inválidos`);
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

      console.log(
        `[${new Date().toISOString()}] REGISTER: Sucesso - Email: ${email}, ID: ${result.usuario.id}, Perfil: ${result.usuario.perfil}`,
      );
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(
          `[${new Date().toISOString()}] REGISTER: Erro - ${error.message}`,
        );
        res.status(400).json({ error: error.message });
      } else {
        console.log(`[${new Date().toISOString()}] REGISTER: Erro interno`);
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log(
        `[${new Date().toISOString()}] LOGIN: Tentativa - Email: ${email}`,
      );

      if (!email || !password) {
        console.log(`[${new Date().toISOString()}] LOGIN: Dados inválidos`);
        res.status(400).json({ error: "Email e senha são obrigatórios" });
        return;
      }

      const result = await authService.login({ email, password });
      console.log(
        `[${new Date().toISOString()}] LOGIN: Sucesso - Email: ${email}, ID: ${result.usuario.id}, Perfil: ${result.usuario.perfil}`,
      );
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(
          `[${new Date().toISOString()}] LOGIN: Erro - ${error.message}`,
        );
        res.status(401).json({ error: error.message });
      } else {
        console.log(`[${new Date().toISOString()}] LOGIN: Erro interno`);
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }

  async registerAdmin(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { nome, email, password } = req.body;
      const adminId = req.user?.id;
      console.log(
        `[${new Date().toISOString()}] REGISTER-ADMIN: Tentativa - Email: ${email}, Criado por Admin ID: ${adminId}`,
      );

      if (!nome || !email || !password) {
        console.log(
          `[${new Date().toISOString()}] REGISTER-ADMIN: Dados inválidos`,
        );
        res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
        return;
      }

      const result = await authService.register({
        nome,
        email,
        password,
        perfil: "ADMIN",
      });

      console.log(
        `[${new Date().toISOString()}] REGISTER-ADMIN: Sucesso - Email: ${email}, ID: ${result.usuario.id}, Criado por: ${adminId}`,
      );
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(
          `[${new Date().toISOString()}] REGISTER-ADMIN: Erro - ${error.message}`,
        );
        res.status(400).json({ error: error.message });
      } else {
        console.log(
          `[${new Date().toISOString()}] REGISTER-ADMIN: Erro interno`,
        );
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }

  async loginAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log(
        `[${new Date().toISOString()}] LOGIN-ADMIN: Tentativa - Email: ${email}`,
      );

      if (!email || !password) {
        console.log(
          `[${new Date().toISOString()}] LOGIN-ADMIN: Dados inválidos`,
        );
        res.status(400).json({ error: "Email e senha são obrigatórios" });
        return;
      }
      const result = await authService.login({ email, password });
      if (result.usuario.perfil !== "ADMIN") {
        console.log(
          `[${new Date().toISOString()}] LOGIN-ADMIN: Acesso negado - Não é admin - Email: ${email}`,
        );
        res
          .status(403)
          .json({ error: "Acesso negado: perfil de administrador necessário" });
        return;
      }

      console.log(
        `[${new Date().toISOString()}] LOGIN-ADMIN: Sucesso - Email: ${email}, ID: ${result.usuario.id}`,
      );
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(
          `[${new Date().toISOString()}] LOGIN-ADMIN: Erro - ${error.message}`,
        );
        res.status(401).json({ error: error.message });
      } else {
        console.log(`[${new Date().toISOString()}] LOGIN-ADMIN: Erro interno`);
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }
}

export const authController = new AuthController();
