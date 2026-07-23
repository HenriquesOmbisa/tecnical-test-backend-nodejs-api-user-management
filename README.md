# User Management API - Angola

API RESTful para gestão de utilizadores, províncias e municípios de Angola.

Desenvolvida como parte do teste técnico para Backend Developer Pleno na VAM Soluções.

## Visão da Implementação

Embora o desafio proponha o desenvolvimento de uma API RESTful para gestão de utilizadores,
províncias e municípios de Angola, procurei ir além da implementação funcional dos requisitos.

O objetivo foi construir uma base de projeto próxima de um ambiente de produção, aplicando
princípios de arquitetura de software que facilitam manutenção, testes e evolução da aplicação.

Durante o desenvolvimento foram adotadas as seguintes decisões arquiteturais:

- Arquitetura modular, separando os domínios de Utilizadores, Autenticação, Províncias e Municípios
- Aplicação do princípio Dependency Inversion Principle (DIP) para reduzir o acoplamento entre as regras de negócio e a infraestrutura
- Utilização de Dependency Injection (DI) para inversão das dependências entre Services e Repositories
- Abstração da camada de persistência através de interfaces, permitindo substituir o MongoDB por outro banco de dados (como PostgreSQL) com impacto mínimo na aplicação
- Separação entre Domínio e Infraestrutura, isolando implementações específicas do Mongoose
- Validação centralizada utilizando Zod
- Documentação automática utilizando Swagger/OpenAPI
- Conteinerização da aplicação com Docker e Docker Compose para facilitar execução e distribuição

Como melhoria adicional em relação ao escopo solicitado, também foi implementado um sistema
simples de autorização baseado em papéis (RBAC), contendo as roles admin e user, protegendo
operações administrativas através de middleware de autorização.

## Tecnologias

- Node.js + TypeScript
- Express.js 5
- MongoDB + Mongoose 9
- JWT (jsonwebtoken) para autenticação
- Zod 4 para validação de dados
- tsyringe para injeção de dependência
- Swagger (swagger-jsdoc + swagger-ui-express) para documentação
- Docker + Docker Compose

## Arquitetura

O projeto segue uma arquitetura modular com separação clara entre domínio e infraestrutura.

```
src/
  modules/       # Dominio da aplicacao (users, provinces, municipalities, auth)
    users/       #   entity, dto, repository interface, service, controller, schema, routes
    provinces/
    municipalities/
    auth/
  infra/         # Implementacoes concretas
    auth/        #   JwtService, PasswordService
    database/    #   MongoDB connection, models, repositories
    http/        #   Swagger setup
    middlewares/ #   auth.middleware, authorize
  shared/        # Container DI, config
  types/         # Declaracoes globais (Express.Request)
```

### Dependency Inversion

As camadas de domínio (modules) definem interfaces de repositório. A camada de infraestrutura as implementa. A injeção de dependência (tsyringe) faz a ponte entre elas, permitindo trocar a base de dados alterando apenas uma linha no container.

### RBAC

Roles implementadas: `admin` e `user`. Endpoints de escrita (criar, atualizar, remover) são protegidos com `authorize("admin")`. Consumidores da API podem autenticar-se via JWT e aceder apenas aos recursos permitidos.

A role de um utilizador pode ser alterada por um admin através do `PUT /api/v1/usuarios/:id`, enviando o campo `role` no corpo da requisição.

## Funcionalidades

- Autenticação (register + login com JWT)
- CRUD de utilizadores (listar, consultar, criar, atualizar, remover)
- CRUD de províncias
- CRUD de municípios (vinculados a províncias)
- Validação de dados com Zod
- Soft delete para utilizadores
- Regras de negócio (email único, município pertence à província, etc.)
- Documentação Swagger em /api-docs

## Requisitos

- Node.js 18+ ou Bun
- MongoDB (local ou Docker)
- Docker (opcional, para execução conteinerizada)

## Variáveis de Ambiente

```env
PORT=3000
MONGO_URI=mongodb://admin:admin123@localhost:27017/meu_app?authSource=admin
JWT_SECRET=minha-chave-secreta-aqui
```

## Instalação e Execução

```bash
# Instalar dependencias
npm install

# Com Bun
bun install

# Iniciar servidor
bun run dev

# Seed de dados iniciais (Luanda, Hoji Ya Henda e admin)
# Admin criado: admin@email.com / admin123
bun run seed
```

### Com Docker

```bash
docker compose up --build
```

## Documentação

Após iniciar o servidor, aceder a:

- Swagger UI: http://localhost:3000/api-docs
- JSON spec: http://localhost:3000/api-docs.json

## Endpoints

### Autenticação (públicos)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/v1/auth/register | Registar utilizador |
| POST | /api/v1/auth/login | Autenticar e obter token |

### Utilizadores
| Método | Rota | Autenticação | Descrição |
|--------|------|-------------|-----------|
| GET | /api/v1/usuarios | Bearer | Listar utilizadores |
| GET | /api/v1/usuarios/:id | Bearer | Consultar utilizador |
| POST | /api/v1/usuarios | Bearer + Admin | Criar utilizador |
| PUT | /api/v1/usuarios/:id | Bearer + Admin | Atualizar utilizador |
| DELETE | /api/v1/usuarios/:id | Bearer + Admin | Remover utilizador |

### Províncias
| Método | Rota | Autenticação | Descrição |
|--------|------|-------------|-----------|
| GET | /api/v1/provincias | Público | Listar províncias |
| GET | /api/v1/provincias/:id | Público | Consultar província |
| POST | /api/v1/provincias | Bearer + Admin | Criar província |
| PUT | /api/v1/provincias/:id | Bearer + Admin | Atualizar província |
| DELETE | /api/v1/provincias/:id | Bearer + Admin | Remover província |

### Municípios
| Método | Rota | Autenticação | Descrição |
|--------|------|-------------|-----------|
| GET | /api/v1/municipios | Público | Listar municípios |
| GET | /api/v1/municipios/:id | Público | Consultar município |
| POST | /api/v1/municipios | Bearer + Admin | Criar município |
| PUT | /api/v1/municipios/:id | Bearer + Admin | Atualizar município |
| DELETE | /api/v1/municipios/:id | Bearer + Admin | Remover município |

## Regras de Negócio

- Email único na base de dados
- Município único por província (mesmo nome não pode existir na mesma província)
- Município deve pertencer à província selecionada pelo utilizador
- Não é possível criar utilizador com município inexistente
- Não é possível remover província que possua municípios vinculados
- Remoção de utilizador é soft delete (registo permanece com deletedAt)
