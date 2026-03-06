import { z } from "zod";

/**
 * Schema para criação de movimentação
 */
export const createMovimentacaoSchema = z.object({
  produtoId: z.string().min(1, "Produto ID é obrigatório"),
  usuarioId: z.string().min(1, "Usuário ID é obrigatório"),
  tipo: z.enum(["ENTRADA", "SAIDA", "AJUSTE"]),
  quantidade: z.number().int().positive("Quantidade deve ser positiva"),
  motivo: z.string().optional(),
  observacao: z.string().optional(),
});

/**
 * Schema para listagem com filtros
 */
export const listMovimentacaoQuerySchema = z.object({
  skip: z.coerce.number().int().positive().optional(),
  take: z.coerce.number().int().positive().optional(),
  produtoId: z.string().optional(),
  usuarioId: z.string().optional(),
  tipo: z.enum(["ENTRADA", "SAIDA", "AJUSTE"]).optional(),
  dataInicio: z.coerce.date().optional(),
  dataFim: z.coerce.date().optional(),
});

export type CreateMovimentacaoDTO = z.infer<typeof createMovimentacaoSchema>;
export type ListMovimentacaoQueryDTO = z.infer<
  typeof listMovimentacaoQuerySchema
>;
