import type { Produto, StatusProduto } from "../../generated/prisma/index.js";
import { prisma } from "../lib/prisma.js";

export interface ICreateProdutoDTO {
  nome: string;
  descricao?: string;
  categoria?: string;
  quantidadeAtual?: number;
  status: StatusProduto;
}

export interface IUpdateProdutoDTO {
  id: string;
  nome?: string;
  descricao?: string;
  categoria?: string;
  quantidadeAtual?: number;
  status?: StatusProduto;
  ativo?: boolean;
}

export class ProdutoService {
  async create(data: ICreateProdutoDTO): Promise<Produto> {
    return prisma.produto.create({
      data: {
        ...data,
        quantidadeAtual: data.quantidadeAtual || 0,
        ativo: true,
      },
    });
  }

  async list(params: {
    skip?: number;
    take?: number;
    categoria?: string;
    status?: StatusProduto;
    ativo?: boolean;
    search?: string;
  }): Promise<Produto[]> {
    const { skip = 0, take = 10, categoria, status, ativo, search } = params;

    return prisma.produto.findMany({
      where: {
        ...(categoria && { categoria }),
        ...(status && { status }),
        ...(ativo !== undefined && { ativo }),
        ...(search && {
          OR: [
            { nome: { contains: search, mode: "insensitive" } },
            { descricao: { contains: search, mode: "insensitive" } },
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

  async getById(id: string): Promise<Produto | null> {
    return prisma.produto.findUnique({
      where: { id },
      include: {
        movimentacoes: {
          orderBy: { dataHora: "desc" },
        },
      },
    });
  }

  async update(data: IUpdateProdutoDTO): Promise<Produto> {
    const { id, ...updateData } = data;

    const existingProduto = await prisma.produto.findUnique({
      where: { id },
    });

    if (!existingProduto) {
      throw new Error("Produto não encontrado");
    }

    return prisma.produto.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<Produto> {
    // Verificar se produto tem movimentações
    const produtoWithMovements = await prisma.produto.findUnique({
      where: { id },
      include: {
        movimentacoes: { take: 1 },
      },
    });

    if (!produtoWithMovements) {
      throw new Error("Produto não encontrado");
    }

    if (produtoWithMovements.movimentacoes.length > 0) {
      // Se tiver movimentações, apenas desativar
      return prisma.produto.update({
        where: { id },
        data: { ativo: false },
      });
    }

    // Se não tiver movimentações, pode deletar
    return prisma.produto.delete({
      where: { id },
    });
  }
}

export const produtoService = new ProdutoService();
