import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js"; // ajuste o caminho
import authRoutes from "./router/auth.route.js";
import dashboardRoutes from "./router/dashboard.route.js";
import movimentacaoRoutes from "./router/movimentacao.route.js";
import produtoRoutes from "./router/produto.route.js";
import usuarioRoutes from "./router/usuario.route.js";
const app = express();

app.use(cors());
app.use(express.json());

// Rota da documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
// Rotas da API
app.use("/api/produtos", produtoRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/movimentacoes", movimentacaoRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "API de Controle de Estoque 🚀",
    version: "1.0.0",
    endpoints: {
      produtos: {
        base: "/api/produtos",
        methods: ["GET", "POST", "PUT", "DELETE"],
      },
      usuarios: {
        base: "/api/usuarios",
        methods: ["GET", "POST", "PUT", "DELETE"],
      },
      movimentacoes: {
        base: "/api/movimentacoes",
        methods: ["GET", "POST"],
        relatorio: "/api/movimentacoes/relatorio",
      },
    },
    docs: "/api-docs",
  });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(
    `📦 Documentação disponível em http://localhost:${PORT}/api-docs`,
  );
});
