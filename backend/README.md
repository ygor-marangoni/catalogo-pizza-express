# Pizza Express — Backend

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-PostgreSQL-FE0803?style=for-the-badge&logo=typeorm&logoColor=white)
![Elasticsearch](https://img.shields.io/badge/Elasticsearch-Search-005571?style=for-the-badge&logo=elasticsearch&logoColor=white)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-6BA539?style=for-the-badge&logo=swagger&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

API REST para o catálogo e o painel administrativo da Pizza Express. O backend possui autenticação JWT com os perfis `ADMIN` e `CUSTOMER`, gerenciamento de produtos, categorias, loja, pedidos e favoritos.

## Tecnologias

- Node.js, Express e TypeScript
- PostgreSQL e TypeORM
- JWT e bcrypt
- Swagger/OpenAPI
- Elasticsearch e Cloudinary
- Docker

## Execução

### Pré-requisitos

- Node.js
- npm
- PostgreSQL
- Docker

Instale as dependências:

```bash
npm install
```

Copie `.env.example` para `.env` e ajuste as variáveis necessárias. Para desenvolvimento sem PostgreSQL, mantenha:

```env
USE_DATABASE=false
```

Inicie em desenvolvimento:

```bash
npm run dev
```

Para executar a versão compilada:

```bash
npm run build
npm run start
```

Com PostgreSQL configurado, execute as migrações e o seed:

```bash
npm run migrate
npm run seed
```

O seed cria 56 produtos, 8 categorias, 4 tamanhos, adicionais, bordas, clientes, favoritos e pedidos para simulação.

Credenciais mockadas:

```text
Administrador: admin@pizzaexpress.com / Admin@123
Cliente: cliente@pizzaexpress.com / Cliente@123
```

Ou utilize Docker Compose:

```bash
docker compose up --build
```

## Documentação

- Swagger UI: [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)
- OpenAPI JSON: [http://localhost:3000/api-docs/openapi.json](http://localhost:3000/api-docs/openapi.json)
- Health check: [http://localhost:3000/health](http://localhost:3000/health)
- Collection do Postman: [`docs/Pizza-Express.postman_collection.json`](docs/Pizza-Express.postman_collection.json)

## Scripts

```bash
npm run dev      # Executa em desenvolvimento
npm run build    # Compila o projeto
npm run start    # Executa a versão compilada
npm run migrate  # Executa as migrações do banco
npm run seed     # Executa os dados iniciais
npm test         # Executa todos os testes
npm run test:unit        # Executa os testes unitários
npm run test:integration # Executa os testes de integração com fetch
npm run test:contract    # Valida a collection do Postman
```

## Estrutura

```text
src/
├── config/          # Configurações de ambiente, banco e OpenAPI
├── controllers/     # Controladores HTTP
├── dtos/            # DTOs de requisição e resposta
├── entities/        # Entidades TypeORM e enums
├── middlewares/     # Autenticação, validação e resiliência
├── models/          # Modelos da aplicação
├── repositories/    # Repositórios em memória e TypeORM
├── routes/          # Rotas da API
├── services/        # Regras de negócio
├── utils/           # Utilitários e recursos de resiliência
└── validations/     # Schemas Zod
```
