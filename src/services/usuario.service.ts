import bcrypt from "bcrypt";
import type { PerfilUsuario, Usuario } from "../../generated/prisma/index.js";
import { prisma } from "../lib/prisma.js";

export interface ICreateUsuarioDTO {
  nome: string;
  email: string;
  password: string;
  perfil: PerfilUsuario;
}

export interface IUpdateUsuarioDTO {
  id: string;
  nome?: string;
  email?: string;
  perfil?: PerfilUsuario;
  ativo?: boolean;
}

export interface IUpdateProfileDTO {
  nome?: string;
  email?: string;
  password?: string;
}

export class UsuarioService {
  async crate(data: ICreateUsuarioDTO): Promise<Usuario> {
    const existingUser = await prisma.usuario.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new Error("Email já está em uso");
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        password: hashedPassword,
        perfil: data.perfil,
        ativo: true,
      },
    });
  }

  async list(params: {
    skip?: number;
    take?: number;
    perfil?: PerfilUsuario;
    ativo?: boolean;
    search?: string;
  }): Promise<Usuario[]> {
    const { skip = 0, take = 10, perfil, ativo, search } = params;

    return prisma.usuario.findMany({
      where: {
        ...(perfil && { perfil }),
        ...(ativo !== undefined && { ativo }),
        ...(search && {
          OR: [
            { nome: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      skip,
      take,
      orderBy: { nome: "asc" },
      include: {
        movimentacoes: {
          orderBy: { dataHora: "desc" },
          take: 5,
        },
      },
    });
  }

  async getById(id: string): Promise<Usuario | null> {
    return prisma.usuario.findUnique({
      where: { id },
      include: {
        movimentacoes: {
          orderBy: { dataHora: "desc" },
        },
      },
    });
  }

  async update(data: IUpdateUsuarioDTO): Promise<Usuario> {
    const { id, ...updateData } = data;
    const existingUser = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error("Usuário não encontrado");
    }

    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await prisma.usuario.findUnique({
        where: { email: updateData.email },
      });

      if (emailExists) {
        throw new Error("Email já está em uso");
      }
    }

    return prisma.usuario.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<Usuario> {
    // Verificar se usuário tem movimentações
    const userWithMovements = await prisma.usuario.findUnique({
      where: { id },
      include: {
        movimentacoes: { take: 1 },
      },
    });

    if (!userWithMovements) {
      throw new Error("Usuário não encontrado");
    }

    if (userWithMovements.movimentacoes.length > 0) {
      // Se tiver movimentações, apenas desativar
      return prisma.usuario.update({
        where: { id },
        data: { ativo: false },
      });
    }

    // Se não tiver movimentações, pode deletar
    return prisma.usuario.delete({
      where: { id },
    });
  }

  async updateProfile(
    userId: string,
    data: IUpdateProfileDTO,
  ): Promise<Omit<Usuario, "password">> {
    const existingUser = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error("Usuário não encontrado");
    }

    // Verificar se o email está sendo alterado e se já está em uso
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.usuario.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        throw new Error("Email já está em uso");
      }
    }

    // Preparar dados para atualização
    const updateData: Partial<Usuario> = {};

    if (data.nome) updateData.nome = data.nome;
    if (data.email) updateData.email = data.email;
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.usuario.update({
      where: { id: userId },
      data: updateData,
    });

    // Retornar sem a senha
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}
export const usuarioService = new UsuarioService();
