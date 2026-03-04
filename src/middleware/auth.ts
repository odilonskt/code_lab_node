import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    perfil: "ADMIN" | "OPERADOR";
  };
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) {
    res.status(401).json({ error: "Token mal formatado" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      perfil: "ADMIN" | "OPERADOR";
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }
  if (req.user.perfil !== "ADMIN") {
    res
      .status(403)
      .json({ error: "Acesso negado: necessário perfil de administrador" });
    return;
  }
  next();
}
