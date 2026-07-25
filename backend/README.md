# Pizza Express — Backend

API REST em Node.js, Express e TypeScript para o catálogo e o painel administrativo da Pizza Express.

## Estrutura do projeto

```text
src/
├── config/          # Configurações de banco e ambiente
├── controllers/     # Controladores HTTP
├── docs/            # Especificação OpenAPI/Swagger
├── entities/        # Entidades do domínio
├── enums/           # Enums compartilhados da aplicação
├── errors/          # Erros customizados
├── middlewares/     # Autenticação, validação e tratamento de erros
├── routes/          # Definição das rotas
├── services/        # Lógica de negócio
├── types/           # Tipos e contratos do domínio
└── utils/           # Funções utilitárias
```

## Instalação

```bash
npm install
```

Copie `.env.example` para `.env` e configure as variáveis necessárias, principalmente `PORT`, `CORS_ORIGIN`, `JWT_SECRET` e as configurações do Elasticsearch quando a busca de produtos for utilizada.

## Scripts

```bash
npm run dev      # Executa em desenvolvimento com ts-node
npm run build    # Compila TypeScript para dist/
npm start        # Executa a versão compilada
npm test         # Ainda não implementado
```

Não existem scripts de migração ou seed configurados neste backend atualmente.

## Enums

Os enums ficam em `src/enums` e são exportados por `src/enums/index.ts`:

- `StoreStatus`: `OPEN`, `CLOSED` e `PAUSED`.
- `ErrorCode`: códigos padronizados de autenticação, validação, busca e recursos não encontrados.

Os códigos de erro são utilizados pelos controllers, services, rotas e middlewares.

## Autenticação

A autenticação usa JWT e senhas protegidas com bcrypt. As rotas protegidas devem enviar:

```http
Authorization: Bearer <token>
```

## Endpoints principais

### Autenticação

- `POST /api/v1/auth/admin/login`
- `POST /api/v1/auth/admin/refresh`
- `POST /api/v1/auth/admin/logout`

### Categorias

- `GET /api/v1/categories`
- `GET /api/v1/categories/:id`
- `POST /api/v1/categories`
- `PUT /api/v1/categories/:id`
- `DELETE /api/v1/categories/:id`

### Produtos

- `GET /api/v1/products/search?q=calabresa`
- `GET /api/v1/products`
- `GET /api/v1/products/:id`
- `POST /api/v1/products`
- `PUT /api/v1/products/:id`
- `DELETE /api/v1/products/:id`

### Loja

- `GET /api/v1/store`
- `PUT /api/v1/store`
- `GET /api/v1/store/status`
- `PUT /api/v1/store/status`

O status atual preserva o campo booleano `is_open` e também expõe `status` como `OPEN` ou `CLOSED`. O valor `PAUSED` já está definido no enum, mas ainda não é aceito pelo endpoint atual, que recebe `is_open: boolean`.

## Resposta padrão

Sucesso:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

Erro:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descrição do erro",
    "field": null
  }
}
```

## Documentação da API

Com o servidor em execução:

- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/api-docs/openapi.json`
- Health check: `http://localhost:3000/health`

## Docker

Para executar o backend e o Elasticsearch:

```bash
docker compose up --build
```

Para encerrar os serviços:

```bash
docker compose down
```
