import { z } from "zod";

/**
 * Schema para criação de produto
 */
export const createProdutoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
  categoria: z.string().optional(),
  quantidadeAtual: z.number().int().min(0).optional(),
  status: z.enum(["ATIVO", "INATIVO", "EM_MANUTENCAO"]),
});

/**
 * Schema para atualização de produto
 */
export const updateProdutoSchema = z.object({
  nome: z.string().min(1, "Nome não pode ser vazio").optional(),
  descricao: z.string().optional(),
  categoria: z.string().optional(),
  quantidadeAtual: z.number().int().min(0).optional(),
  status: z.enum(["ATIVO", "INATIVO", "EM_MANUTENCAO"]).optional(),
  ativo: z.boolean().optional(),
});

/**
 * Schema para listagem com filtros
 */
export const listProdutoQuerySchema = z.object({
  skip: z.coerce.number().int().positive().optional(),
  take: z.coerce.number().int().positive().optional(),
  categoria: z.string().optional(),
  status: z.enum(["ATIVO", "INATIVO", "EM_MANUTENCAO"]).optional(),
  ativo: z.coerce.boolean().optional(),
  search: z.string().optional(),
});

export type CreateProdutoDTO = z.infer<typeof createProdutoSchema>;
export type UpdateProdutoDTO = z.infer<typeof updateProdutoSchema>;
export type ListProdutoQueryDTO = z.infer<typeof listProdutoQuerySchema>;
