# Requisitos atuais do backend — Pizza Express

Este documento descreve o contrato implementado. A referência operacional é o
OpenAPI publicado em `/api-docs` e o código em `src/routes`.

## Objetivo

Disponibilizar o catálogo real da Pizza Express e as operações administrativas
para produtos, categorias, tamanhos, bordas, adicionais, loja, cupons e pedidos.
O frontend não usa dados fictícios em produção; os fixtures restantes são
isolados para testes automatizados.

## Execução

- API local: `http://localhost:3001` quando executada pelo Docker;
- prefixo das rotas de negócio: `/api/v1`;
- documentação: `/api-docs`;
- saúde: `/health`;
- persistência: PostgreSQL com `USE_DATABASE=true`;
- busca textual: Elasticsearch para `GET /api/v1/products/search`.

## Rotas públicas

`GET /api/v1/products`, `GET /api/v1/products/:id`,
`GET /api/v1/products/search`, `GET /api/v1/products/configurations`,
`GET /api/v1/products/:id/configuration`, `GET /api/v1/categories`,
`GET /api/v1/categories/:id`, `GET /api/v1/additionals`,
`GET /api/v1/additionals/:id`, `GET /api/v1/edges`,
`GET /api/v1/edges/:id`, `GET /api/v1/sizes`, `GET /api/v1/sizes/:id`,
`GET /api/v1/store`, `GET /api/v1/store/status`,
`GET /api/v1/coupons/public`, `POST /api/v1/coupons/validate`.

## Autenticação e cliente

- `POST /api/v1/auth/login` autentica administrador ou cliente;
- `POST /api/v1/auth/user/register` cadastra cliente;
- `POST /api/v1/auth/refresh`, `POST /api/v1/auth/logout` e
  `GET /api/v1/auth/me` controlam a sessão;
- `GET|PUT /api/v1/users/me` gerencia o perfil;
- `GET|POST /api/v1/users/me/favorites` e
  `DELETE /api/v1/users/me/favorites/:id` gerenciam favoritos;
- `GET|POST /api/v1/users/me/orders` e
  `GET /api/v1/users/me/orders/:id` gerenciam pedidos do cliente.

## Administração

As operações de escrita do catálogo exigem token JWT com papel `ADMIN`:

- `POST|PUT|DELETE /api/v1/categories[/:id]`;
- `POST|PUT|DELETE /api/v1/products[/:id]`;
- `POST|PUT|DELETE /api/v1/additionals[/:id]`;
- `POST|PUT|DELETE /api/v1/edges[/:id]`;
- `POST|PUT|DELETE /api/v1/sizes[/:id]`;
- `PUT /api/v1/products/:id/configuration`;
- `PUT /api/v1/store` e `PUT /api/v1/store/status`;
- `GET|POST /api/v1/coupons`, `PUT|DELETE /api/v1/coupons/:id`;
- `GET /api/v1/admin/orders` e
  `PATCH /api/v1/admin/orders/:id/status`.

## Regras de negócio

- preços são enviados em centavos;
- adicionais e bordas são opções de configuração vinculadas a um produto,
  não itens independentes do carrinho;
- a configuração de produto define tamanhos, bordas e adicionais disponíveis;
- a busca textual deve consultar nome e descrição e retornar produtos normais;
- produtos marcados como apenas adicionais não aparecem como produtos compráveis
  no cardápio público;
- respostas seguem o envelope `success`, `data` e `error` quando aplicável;
- credenciais de demonstração estão documentadas no README e devem ser trocadas
  em qualquer ambiente compartilhado.

## Verificação

```bash
npm run build
npm run test:unit
npm run test:integration
npm run test:contract
```

Para a coleção Postman, use `docs/Pizza-Express.postman_collection.json` e
configure `baseUrl` para `http://localhost:3001/api/v1`.
