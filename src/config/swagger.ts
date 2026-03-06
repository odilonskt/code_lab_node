import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Controle de Estoque",
      version: "1.0.0",
      description:
        "API para gerenciamento de estoque com controle de entradas, saídas e ajustes",
      contact: {
        name: "Support",
        email: "support@code-lab.com",
      },
      license: {
        name: "ISC",
        url: "https://opensource.org/licenses/ISC",
      },
    },
    servers: [
      {
        url: "http://localhost:3333",
        description: "Servidor de desenvolvimento",
      },
      {
        url: "https://code-lab-node.onrender.com/",
        description: "Servidor de produção",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "JWT token de autenticação. Obtido via endpoint de login.",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Mensagem de erro" },
            error: { type: "string" },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "object" },
            message: { type: "string" },
          },
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "array", items: { type: "object" } },
            count: { type: "integer", example: 10 },
            total: { type: "integer", example: 100 },
          },
        },
        Produto: {
          type: "object",
          required: ["nome", "status"],
          properties: {
            id: { type: "string", example: "uuid" },
            nome: { type: "string", example: "Notebook Dell" },
            descricao: { type: "string", example: "Notebook Dell Inspiron 15" },
            categoria: { type: "string", example: "Eletrônicos" },
            quantidadeAtual: { type: "integer", example: 50 },
            quantidadeMinima: { type: "integer", example: 10 },
            status: {
              type: "string",
              enum: ["ATIVO", "INATIVO", "EM_MANUTENCAO"],
              example: "ATIVO",
            },
            ativo: { type: "boolean", example: true },
            criadoEm: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateProdutoDTO: {
          type: "object",
          required: ["nome", "status"],
          properties: {
            nome: { type: "string", example: "Notebook Dell" },
            descricao: { type: "string", example: "Notebook Dell Inspiron 15" },
            categoria: { type: "string", example: "Eletrônicos" },
            quantidadeAtual: { type: "integer", example: 50 },
            quantidadeMinima: { type: "integer", example: 10 },
            status: {
              type: "string",
              enum: ["ATIVO", "INATIVO", "EM_MANUTENCAO"],
              example: "ATIVO",
            },
          },
        },
        UpdateProdutoDTO: {
          type: "object",
          properties: {
            nome: { type: "string", example: "Notebook Dell" },
            descricao: { type: "string", example: "Notebook Dell Inspiron 15" },
            categoria: { type: "string", example: "Eletrônicos" },
            quantidadeAtual: { type: "integer", example: 50 },
            quantidadeMinima: { type: "integer", example: 10 },
            status: {
              type: "string",
              enum: ["ATIVO", "INATIVO", "EM_MANUTENCAO"],
              example: "ATIVO",
            },
            ativo: { type: "boolean", example: true },
          },
        },
        Usuario: {
          type: "object",
          required: ["nome", "email", "perfil"],
          properties: {
            id: { type: "string", example: "uuid" },
            nome: { type: "string", example: "João Silva" },
            email: {
              type: "string",
              format: "email",
              example: "joao@exemplo.com",
            },
            perfil: {
              type: "string",
              enum: ["ADMIN", "OPERADOR"],
              example: "OPERADOR",
            },
            ativo: { type: "boolean", example: true },
            criadoEm: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateUsuarioDTO: {
          type: "object",
          required: ["nome", "email", "perfil"],
          properties: {
            nome: { type: "string", example: "João Silva" },
            email: {
              type: "string",
              format: "email",
              example: "joao@exemplo.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "senha123",
            },
            perfil: {
              type: "string",
              enum: ["ADMIN", "OPERADOR"],
              example: "OPERADOR",
            },
          },
        },
        UpdateUsuarioDTO: {
          type: "object",
          properties: {
            nome: { type: "string", example: "João Silva" },
            email: {
              type: "string",
              format: "email",
              example: "joao@exemplo.com",
            },
            perfil: {
              type: "string",
              enum: ["ADMIN", "OPERADOR"],
              example: "OPERADOR",
            },
            ativo: { type: "boolean", example: true },
          },
        },
        Movimentacao: {
          type: "object",
          required: ["produtoId", "tipo", "quantidade"],
          properties: {
            id: { type: "string", example: "uuid" },
            produtoId: { type: "string", example: "uuid" },
            usuarioId: { type: "string", example: "uuid" },
            tipo: {
              type: "string",
              enum: ["ENTRADA", "SAIDA", "AJUSTE"],
              example: "ENTRADA",
            },
            quantidade: { type: "integer", example: 10 },
            dataHora: { type: "string", format: "date-time" },
            motivo: { type: "string", example: "Reposição de estoque" },
            observacao: { type: "string", example: "Observação opcional" },
            produto: { $ref: "#/components/schemas/Produto" },
            usuario: { $ref: "#/components/schemas/Usuario" },
            criadoEm: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateMovimentacaoDTO: {
          type: "object",
          required: ["produtoId", "tipo", "quantidade"],
          properties: {
            produtoId: { type: "string", example: "uuid" },
            tipo: {
              type: "string",
              enum: ["ENTRADA", "SAIDA", "AJUSTE"],
              example: "ENTRADA",
            },
            quantidade: { type: "integer", example: 10 },
            motivo: { type: "string", example: "Reposição de estoque" },
            observacao: { type: "string", example: "Observação opcional" },
          },
        },
        LoginDTO: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "admin@exemplo.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "senha123",
            },
          },
        },
        RegisterDTO: {
          type: "object",
          required: ["nome", "email", "password"],
          properties: {
            nome: { type: "string", example: "João Silva" },
            email: {
              type: "string",
              format: "email",
              example: "joao@exemplo.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "senha123",
            },
            perfil: {
              type: "string",
              enum: ["ADMIN", "OPERADOR"],
              example: "OPERADOR",
              default: "OPERADOR",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
                usuario: { $ref: "#/components/schemas/Usuario" },
              },
            },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: "Não autenticado - Token inválido ou ausente",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
              example: { success: false, message: "Token não fornecido" },
            },
          },
        },
        Forbidden: {
          description: "Acesso negado - Permissão insuficiente",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
              example: {
                success: false,
                message: "Acesso negado. Apenas administradores.",
              },
            },
          },
        },
        NotFound: {
          description: "Recurso não encontrado",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
              example: { success: false, message: "Recurso não encontrado" },
            },
          },
        },
        BadRequest: {
          description: "Dados inválidos",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
              example: {
                success: false,
                message: "Dados inválidos",
                error: "Email já está em uso",
              },
            },
          },
        },
        InternalServerError: {
          description: "Erro interno do servidor",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
              example: { success: false, message: "Erro interno do servidor" },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/router/*.ts", "./src/controller/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
