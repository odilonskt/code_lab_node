import type { PerfilUsuario, Usuario } from "../../generated/prisma/index.js";
import { prisma } from "../lib/prisma.js";

export interface ICreateUsuarioDTO {
  nome: string;
  email: string;
  perfil: PerfilUsuario;
}

export interface IUpdateUsuarioDTO {
  id: string;
  nome?: string;
  email?: string;
  perfil?: PerfilUsuario;
  ativo?: boolean;
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

    return prisma.usuario.create({
      data: {
        ...data,
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
}
export const usuarioService = new UsuarioService();
