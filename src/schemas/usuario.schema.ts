import { z } from "zod";

/**
 * Schema para criação de usuário
 */
export const createUsuarioSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  perfil: z.enum(["ADMIN", "OPERADOR"]),
});

/**
 * Schema para atualização de usuário
 */
export const updateUsuarioSchema = z.object({
  nome: z.string().min(1, "Nome não pode ser vazio").optional(),
  email: z.string().email("Email inválido").optional(),
  perfil: z.enum(["ADMIN", "OPERADOR"]).optional(),
  ativo: z.boolean().optional(),
});

/**
 * Schema para atualização do perfil do usuário logado
 */
export const updateProfileSchema = z.object({
  nome: z.string().min(1, "Nome não pode ser vazio").optional(),
  email: z.string().email("Email inválido").optional(),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .optional(),
});

/**
 * Schema para listagem com filtros
 */
export const listUsuarioQuerySchema = z.object({
  skip: z.coerce.number().int().positive().optional(),
  take: z.coerce.number().int().positive().optional(),
  perfil: z.enum(["ADMIN", "OPERADOR"]).optional(),
  ativo: z.coerce.boolean().optional(),
  search: z.string().optional(),
});

export type CreateUsuarioDTO = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioDTO = z.infer<typeof updateUsuarioSchema>;
export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
export type ListUsuarioQueryDTO = z.infer<typeof listUsuarioQuerySchema>;
