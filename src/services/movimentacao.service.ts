import type {
  MovimentacaoEstoque,
  TipoMovimentacao,
} from "../../generated/prisma/index.js";
import { prisma } from "../lib/prisma.js";

export interface ICreateMovimentacaoDTO {
  produtoId: string;
  usuarioId: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  motivo?: string;
  observacao?: string;
}

export interface IListMovimentacoesDTO {
  skip?: number;
  take?: number;
  produtoId?: string;
  usuarioId?: string;
  tipo?: TipoMovimentacao;
  dataInicio?: Date;
  dataFim?: Date;
}

export class MovimentacaoService {
  async create(data: ICreateMovimentacaoDTO): Promise<MovimentacaoEstoque> {
    // Validar produto
    const produto = await prisma.produto.findUnique({
      where: { id: data.produtoId },
    });

    if (!produto) {
      throw new Error("Produto não encontrado");
    }

    if (!produto.ativo) {
      throw new Error("Produto inativo não pode receber movimentações");
    }

    // Validar usuário
    const usuario = await prisma.usuario.findUnique({
      where: { id: data.usuarioId },
    });

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    if (!usuario.ativo) {
      throw new Error("Usuário inativo não pode realizar movimentações");
    }

    // Validar quantidade
    if (data.quantidade <= 0) {
      throw new Error("Quantidade deve ser maior que zero");
    }

    // Validar estoque para saídas
    if (data.tipo === "SAIDA" && produto.quantidadeAtual < data.quantidade) {
      throw new Error("Estoque insuficiente");
    }

    // Criar movimentação e atualizar estoque em transação
    const result = await prisma.$transaction(async (tx) => {
      // Calcular nova quantidade
      let novaQuantidade = produto.quantidadeAtual;

      switch (data.tipo) {
        case "ENTRADA":
          novaQuantidade += data.quantidade;
          break;
        case "SAIDA":
          novaQuantidade -= data.quantidade;
          break;
        case "AJUSTE":
          novaQuantidade = data.quantidade;
          break;
      }

      // Atualizar produto
      await tx.produto.update({
        where: { id: data.produtoId },
        data: { quantidadeAtual: novaQuantidade },
      });

      // Criar movimentação
      return tx.movimentacaoEstoque.create({
        data: {
          produtoId: data.produtoId,
          usuarioId: data.usuarioId,
          tipo: data.tipo,
          quantidade: data.quantidade,
          motivo: data.motivo,
          observacao: data.observacao,
        },
        include: {
          produto: true,
          usuario: {
            select: { id: true, nome: true, email: true, perfil: true },
          },
        },
      });
    });

    return result;
  }

  async list(params: IListMovimentacoesDTO): Promise<MovimentacaoEstoque[]> {
    const {
      skip = 0,
      take = 20,
      produtoId,
      usuarioId,
      tipo,
      dataInicio,
      dataFim,
    } = params;

    return prisma.movimentacaoEstoque.findMany({
      where: {
        ...(produtoId && { produtoId }),
        ...(usuarioId && { usuarioId }),
        ...(tipo && { tipo }),
        ...(dataInicio || dataFim
          ? {
              dataHora: {
                ...(dataInicio && { gte: dataInicio }),
                ...(dataFim && { lte: dataFim }),
              },
            }
          : {}),
      },
      skip,
      take,
      orderBy: { dataHora: "desc" },
      include: {
        produto: {
          select: { id: true, nome: true, categoria: true },
        },
        usuario: {
          select: { id: true, nome: true, perfil: true },
        },
      },
    });
  }

  async getById(id: string): Promise<MovimentacaoEstoque | null> {
    return prisma.movimentacaoEstoque.findUnique({
      where: { id },
      include: {
        produto: true,
        usuario: true,
      },
    });
  }

  async getRelatorioEstoque(): Promise<any> {
    const produtos = await prisma.produto.findMany({
      where: { ativo: true },
      select: {
        id: true,
        nome: true,
        categoria: true,
        quantidadeAtual: true,
        status: true,
        movimentacoes: {
          orderBy: { dataHora: "desc" },
          take: 1,
        },
      },
    });

    const totalProdutos = produtos.length;
    const totalItens = produtos.reduce((acc, p) => acc + p.quantidadeAtual, 0);
    const produtosBaixoEstoque = produtos.filter(
      (p) => p.quantidadeAtual < 10,
    ).length;

    // Estatísticas por categoria
    const estatisticas = produtos.reduce(
      (acc, produto) => {
        const categoria = produto.categoria || "Sem categoria";
        if (!acc[categoria]) {
          acc[categoria] = {
            total: 0,
            quantidade: 0,
            produtos: 0,
          };
        }
        acc[categoria].total++;
        acc[categoria].quantidade += produto.quantidadeAtual;
        acc[categoria].produtos++;
        return acc;
      },
      {} as Record<string, any>,
    );

    return {
      totalProdutos,
      totalItens,
      produtosBaixoEstoque,
      estatisticas,
      produtos,
    };
  }
}

export const movimentacaoService = new MovimentacaoService();
