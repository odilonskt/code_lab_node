import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { PerfilUsuario, Usuario } from "../../generated/prisma/index.js";
import { prisma } from "../lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "";
const SALT_ROUNDS = 10;

export interface IRegisterDTO {
  nome: string;
  email: string;
  password: string;
  perfil?: PerfilUsuario; // se não informado, será OPERADOR
}

export interface ILoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  usuario: Omit<Usuario, "password">;
  token: string;
}

export class AuthService {
  /**
   * Verifica se existe algum administrador no sistema
   */
  async hasAdmin(): Promise<boolean> {
    const adminCount = await prisma.usuario.count({
      where: { perfil: "ADMIN" },
    });
    return adminCount > 0;
  }

  /**
   * Registra o primeiro administrador (sem necessidade de autenticação)
   * Apenas funciona quando não existe nenhum admin no sistema
   */
  async registerFirstAdmin(data: IRegisterDTO): Promise<AuthResponse> {
    // Verificar se já existe algum admin
    const hasAdmin = await this.hasAdmin();
    if (hasAdmin) {
      throw new Error(
        "Já existe um administrador no sistema. Use o endpoint register-admin autenticado.",
      );
    }

    // Verificar se email já existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new Error("Email já está em uso");
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Criar usuário admin
    const usuario = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        password: hashedPassword,
        perfil: "ADMIN",
        ativo: true,
      },
    });

    // Remover senha do objeto retornado
    const { password: _, ...usuarioSemSenha } = usuario;

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return { usuario: usuarioSemSenha, token };
  }

  async register(data: IRegisterDTO): Promise<AuthResponse> {
    // Verificar se email já existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new Error("Email já está em uso");
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Criar usuário (perfil padrão: OPERADOR)
    const usuario = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        password: hashedPassword,
        perfil: data.perfil || "OPERADOR",
        ativo: true,
      },
    });

    // Remover senha do objeto retornado
    const { password: _, ...usuarioSemSenha } = usuario;

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return { usuario: usuarioSemSenha, token };
  }

  async login(data: ILoginDTO): Promise<AuthResponse> {
    // Buscar usuário pelo email
    const usuario = await prisma.usuario.findUnique({
      where: { email: data.email },
    });
    if (!usuario) {
      throw new Error("Email ou senha inválidos");
    }

    // Verificar se está ativo
    if (!usuario.ativo) {
      throw new Error("Usuário inativo");
    }

    // Comparar senha
    const senhaValida = await bcrypt.compare(data.password, usuario.password);
    if (!senhaValida) {
      throw new Error("Email ou senha inválidos");
    }

    // Remover senha do objeto retornado
    const { password: _, ...usuarioSemSenha } = usuario;

    // Gerar token
    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return { usuario: usuarioSemSenha, token };
  }
}

export const authService = new AuthService();
