# Pizza Express — Backend

API REST Express/TypeScript do catalogo e do painel administrativo.

## Execucao

O modo recomendado para desenvolvimento integrado e o Docker Compose:

```bash
docker compose up -d --build
docker compose exec backend npm run migrate
docker compose exec backend npm run seed
```

- API: `http://localhost:3001`
- prefixo: `http://localhost:3001/api/v1`
- Swagger UI: `http://localhost:3001/api-docs`
- OpenAPI JSON: `http://localhost:3001/api-docs/openapi.json`
- health: `http://localhost:3001/health`

O container escuta na porta 3000 e o Compose publica a porta 3001. Em execucao
manual, copie `.env.example` para `.env`, configure PostgreSQL e Elasticsearch,
e rode `npm install`, `npm run migrate`, `npm run seed` e `npm run dev`.

## Contrato

As rotas atuais estao listadas em [pizza-express-backend-requisitos.md](./pizza-express-backend-requisitos.md), no OpenAPI e na colecao
[docs/Pizza-Express.postman_collection.json](./docs/Pizza-Express.postman_collection.json).

Principais grupos: autenticacao, produtos, configuracoes de produtos,
categorias, tamanhos, bordas, adicionais, loja, cupons, perfil/favoritos do
cliente e pedidos.

Operacoes de escrita administrativas exigem JWT com papel `ADMIN`. Os precos
sao expressos em centavos. Adicionais e bordas sao opcoes vinculadas a um
produto e nao itens independentes do carrinho.

## Variaveis

As variaveis essenciais sao `PORT`, `CORS_ORIGIN`, `USE_DATABASE`,
`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`,
`JWT_EXPIRATION`, `COOKIE_SECURE`, `ELASTICSEARCH_URL` e as variaveis
`CLOUDINARY_*`. Use `USE_DATABASE=true` para dados persistentes.

## Testes

```bash
npm run build
npm run test:unit
npm run test:integration
npm run test:contract
```

Credenciais de demonstração: `admin@pizzaexpress.com` / `Admin@123`.
Troque-as em ambientes compartilhados.
