import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Controle de Estoque",
      version: "1.0.0",
      description: "Documentação da API de Controle de Estoque",
    },
    servers: [
      {
        url: "http://localhost:3333",
        description: "Servidor de desenvolvimento",
      },
    ],
    components: {
      schemas: {
        // Os schemas serão definidos nos comentários JSDoc
      },
    },
  },
  // Caminhos para os arquivos que contêm as anotações JSDoc
  apis: [
    "./src/router/*.ts", // rotas
    "./src/controller/*.ts", // controllers (se quiser documentar métodos)
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
