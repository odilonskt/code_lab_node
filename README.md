# 🚀 API de Controle de Estoque

API RESTful desenvolvida com Node.js, Express, TypeScript e Prisma ORM para gerenciamento completo de estoque, incluindo produtos, usuários e movimentações.

---

## 📋 Índice

Tecnologias

Estrutura do Projeto

Pré-requisitos

Instalação

Configuração do Banco de Dados

Executando o Projeto

Documentação da API

Endpoints

Modelos de Dados

Comandos Úteis

Estrutura de Pastas

---

## 🛠 Tecnologias

Node.js (v18+)

Express 5.x

TypeScript 5.x

Prisma ORM 7.x

PostgreSQL (via NeonDB)

Swagger/OpenAPI para documentação

CORS habilitado

ES Modules (type: module)

---

## 📁 Estrutura do Projeto

```code_lab_node/
├── src/
│   ├── controllers/           # Controladores da API
│   │   ├── produto.controller.ts
│   │   ├── usuario.controller.ts
│   │   └── movimentacao.controller.ts
│   ├── services/              # Lógica de negócio
│   │   ├── produto.service.ts
│   │   ├── usuario.service.ts
│   │   └── movimentacao.service.ts
│   ├── routes/                # Definição de rotas
│   │   ├── produto.route.ts
│   │   ├── usuario.route.ts
│   │   └── movimentacao.route.ts
│   ├── lib/
│   │   └── prisma.ts          # Cliente Prisma configurado
│   ├── config/
│   │   └── swagger.ts         # Configuração do Swagger
│   └── index.ts               # Arquivo principal
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── migrations/            # Migrações do banco
├── generated/                  # Código gerado pelo Prisma
├── .env                        # Variáveis de ambiente
├── .gitignore                  # Arquivos ignorados pelo Git
├── package.json                # Dependências e scripts
├── tsconfig.json               # Configuração do TypeScript
├── nodemon.json                 # Configuração do Nodemon
└── README.md                   # Documentação
```

---

## 🔧 Pré-requisitos

Node.js 18 ou superior

npm ou yarn

PostgreSQL (ou NeonDB para cloud)

---

## 📦 Instalação

### Clone o repositório

```
git clone https://github.com/odilonskt/code_lab_node.git
cd code_lab_node
```

### Instale as dependências

```
npm install
```

Configure as variáveis de ambiente

### Crie um arquivo .env na raiz do projeto:

```
DATABASE_URL="postgresql://usuario:senha@host:5432/banco"
PORT=3333
NODE_ENV=development
```

🗄 Configuração do Banco de Dados
Configure o Prisma schema (já está configurado em prisma/schema.prisma)

### Execute as migrações

```
# Criar e aplicar a migração inicial
npx prisma migrate dev --name init

# Ou apenas gerar o cliente sem migrar (se o banco já existir)
npx prisma generate
```

---

## 🚀 Executando o Projeto

### Modo Desenvolvimento

```
npm run dev
```

O servidor iniciará em http://localhost:3333 com hot reload.

### Modo Produção

```
# Compilar TypeScript
npm run build

# Iniciar o servidor
npm start
```

---

## 📚 Documentação da API

A API possui documentação interativa via Swagger UI:

Swagger UI: http://localhost:3333/api-docs

Especificação OpenAPI: http://localhost:3333/api-docs.json

A documentação inclui:

Todos os endpoints

Schemas de dados

Parâmetros de consulta

Exemplos de requisição/resposta

Possibilidade de testar as rotas diretamente

---

## 🎯 Endpoints

Produtos (/api/produtos)
Método Rota Descrição
POST / Criar novo produto
GET / Listar produtos (com filtros)
GET /:id Buscar produto por ID
PUT /:id Atualizar produto
DELETE /:id Remover/desativar produto
Filtros para listagem:

skip: Paginação - pular registros

take: Paginação - limitar registros

categoria: Filtrar por categoria

status: Filtrar por status (ATIVO, INATIVO, EM_MANUTENCAO)

ativo: Filtrar por ativo/inativo

search: Buscar por nome ou descrição

Usuários (/api/usuarios)
Método Rota Descrição
POST / Criar novo usuário
GET / Listar usuários (com filtros)
GET /:id Buscar usuário por ID
PUT /:id Atualizar usuário
DELETE /:id Remover/desativar usuário
Filtros para listagem:

skip: Paginação

take: Paginação

perfil: Filtrar por perfil (ADMIN, OPERADOR)

ativo: Filtrar por ativo/inativo

search: Buscar por nome ou email

Movimentações (/api/movimentacoes)
Método Rota Descrição
POST / Registrar movimentação (entrada/saída/ajuste)
GET / Listar movimentações (com filtros)
GET /relatorio Relatório de estoque
GET /:id Buscar movimentação por ID
Filtros para listagem:

skip: Paginação

take: Paginação

produtoId: Filtrar por produto

usuarioId: Filtrar por usuário

tipo: Filtrar por tipo (ENTRADA, SAIDA, AJUSTE)

dataInicio: Data inicial

dataFim: Data final

## 📊 Modelos de Dados

### Produto

```
{
  id: string (UUID)
  nome: string
  descricao?: string
  categoria?: string
  quantidadeAtual: number (default: 0)
  status: "ATIVO" | "INATIVO" | "EM_MANUTENCAO"
  ativo: boolean (default: true)
  criadoEm: DateTime
  updatedAt: DateTime
}
```

### Usuário

```{
  id: string (UUID)
  nome: string
  email: string (único)
  perfil: "ADMIN" | "OPERADOR"
  ativo: boolean (default: true)
  criadoEm: DateTime
  updatedAt: DateTime
}
```

### Movimentação

```
{
  id: string (UUID)
  produtoId: string
  usuarioId: string
  tipo: "ENTRADA" | "SAIDA" | "AJUSTE"
  quantidade: number
  dataHora: DateTime (default: now())
  motivo?: string
  observacao?: string
  produto: Produto
  usuario: Usuario
}
```

## 💻 Comandos Úteis

### Prisma

```
# Gerar cliente Prisma após alterar o schema
npm run prisma:generate

# Criar e aplicar migração
npm run prisma:migrate

# Abrir Prisma Studio (interface gráfica)
npm run prisma:studio
```

### TypeScript

```
# Compilar TypeScript
npm run build

# Verificar tipos sem compilar
npx tsc --noEmit
```

## 📁 Estrutura de Pastas Detalhada

```
src/
├── controllers/     # Recebem requisições, chamam serviços e retornam respostas
├── services/        # Contêm regras de negócio e interagem com Prisma
├── routes/          # Definem os endpoints e mapeiam para controllers
├── lib/             # Configurações globais (Prisma, etc.)
├── config/          # Configurações (Swagger, etc.)
└── index.ts         # Ponto de entrada da aplicação
```

## ✨ Funcionalidades Implementadas

✅ CRUD completo para Produtos

✅ CRUD completo para Usuários

✅ CRUD para Movimentações de estoque

✅ Validações de negócio (estoque insuficiente, email duplicado, etc.)

✅ Transações para garantir consistência

✅ Desativação lógica em vez de exclusão física quando há dependências

✅ Documentação Swagger interativa

✅ Paginação e filtros em todas as listagens

✅ Relatório de estoque com estatísticas

✅ Arquitetura MVC bem definida

✅ TypeScript com configuração strict

✅ ES Modules

🔒 Regras de Negócio
Produtos

Não podem ser deletados se tiverem movimentações (apenas desativados)

Quantidade atual nunca pode ser negativa

Status define disponibilidade

Usuários

Email deve ser único

Não podem ser deletados se tiverem movimentações (apenas desativados)

Perfis definem nível de acesso

Movimentações

Saídas não podem exceder estoque atual

Ajuste define quantidade absoluta

Todas as movimentações são registradas em transação

Usuário e produto devem estar ativos
