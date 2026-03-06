import { type NextFunction, type Request, type Response } from "express";
import { z, ZodError, type ZodSchema } from "zod";

/**
 * Middleware de validação com logs
 * Valida o corpo da requisição usando Zod schemas
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Log da requisição recebida
      console.log(
        `[${new Date().toISOString()}] VALIDATE: ${req.method} ${req.path}`,
      );
      console.log(
        `[${new Date().toISOString()}] REQUEST BODY:`,
        JSON.stringify(req.body, null, 2),
      );

      // Valida o corpo da requisição
      schema.parse(req.body);

      // Log de sucesso
      console.log(
        `[${new Date().toISOString()}] VALIDATE SUCCESS: ${req.method} ${req.path}`,
      );

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Log detalhado do erro de validação
        const errors = error.issues.map((err: z.ZodIssue) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        console.error(
          `[${new Date().toISOString()}] VALIDATE ERROR: ${req.method} ${req.path}`,
        );
        console.error(
          `[${new Date().toISOString()}] VALIDATION ERRORS:`,
          JSON.stringify(errors, null, 2),
        );

        res.status(400).json({
          success: false,
          error: "Erro de validação",
          details: errors,
        });
      } else {
        // Erro inesperado
        console.error(
          `[${new Date().toISOString()}] VALIDATE UNEXPECTED ERROR: ${req.method} ${req.path}`,
        );
        console.error(error);

        res.status(500).json({
          success: false,
          error: "Erro interno do servidor",
        });
      }
    }
  };
};

/**
 * Middleware de validação de query params com logs
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      console.log(
        `[${new Date().toISOString()}] VALIDATE QUERY: ${req.method} ${req.path}`,
      );
      console.log(
        `[${new Date().toISOString()}] QUERY PARAMS:`,
        JSON.stringify(req.query, null, 2),
      );

      schema.parse(req.query);

      console.log(
        `[${new Date().toISOString()}] VALIDATE QUERY SUCCESS: ${req.method} ${req.path}`,
      );

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: z.ZodIssue) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        console.error(
          `[${new Date().toISOString()}] VALIDATE QUERY ERROR: ${req.method} ${req.path}`,
        );
        console.error(
          `[${new Date().toISOString()}] VALIDATION ERRORS:`,
          JSON.stringify(errors, null, 2),
        );

        res.status(400).json({
          success: false,
          error: "Erro de validação nos parâmetros",
          details: errors,
        });
      } else {
        console.error(
          `[${new Date().toISOString()}] VALIDATE QUERY UNEXPECTED ERROR: ${req.method} ${req.path}`,
        );
        console.error(error);

        res.status(500).json({
          success: false,
          error: "Erro interno do servidor",
        });
      }
    }
  };
};
