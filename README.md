# Pizza Express

Catálogo digital e painel administrativo da Pizza Express. O monorepositório contém um frontend Next.js e uma API Express/TypeScript integrada a PostgreSQL, Elasticsearch e Cloudinary.

## Arquitetura

- `frontend/`: Next.js 16, React 19, App Router, CSS Modules, carrinho e painel administrativo.
- `backend/`: Express 5, TypeScript, TypeORM, autenticação JWT, validação Zod e Swagger/OpenAPI.
- PostgreSQL: persistência de usuários, catálogo, loja, pedidos e favoritos.
- Elasticsearch: busca textual de produtos.
- Cloudinary: upload de imagens de produtos e categorias quando as credenciais estão configuradas.

## Requisitos

- Node.js 20 ou superior;
- npm;
- Docker Desktop para o ambiente completo;
- PostgreSQL, Elasticsearch e Cloudinary quando executados fora do Docker.

## Portas locais

| Serviço | URL |
| --- | --- |
| Frontend | `http://localhost:3000` |
| API | `http://localhost:3001` |
| Swagger | `http://localhost:3001/api-docs` |
| PostgreSQL | `localhost:5432` |
| Elasticsearch | `http://localhost:9200` |

## Execução com Docker

```bash
cd backend
docker compose up -d --build
docker compose exec backend npm run migrate
docker compose exec backend npm run seed
```

Para recriar os dados locais do zero, removendo os volumes:

```bash
docker compose down --volumes --remove-orphans
docker compose build --no-cache
docker compose up -d
docker compose exec backend npm run migrate
docker compose exec backend npm run seed
```

O backend escuta `3000` dentro do container e é publicado em `3001` no host. O frontend deve ser iniciado em outro terminal:

```bash
cd frontend
npm install
npm run dev -- --webpack
```

## Execução manual do backend

```bash
cd backend
npm install
copy .env.example .env
npm run build
npm run migrate
npm run seed
npm start
```

Para desenvolvimento, use `npm run dev`. Configure `USE_DATABASE=true` quando PostgreSQL estiver disponível; `USE_DATABASE=false` é destinado a testes e desenvolvimento sem persistência. A busca textual exige Elasticsearch. Uploads exigem as variáveis do Cloudinary.

## Variáveis de ambiente

Consulte `backend/.env.example` e `frontend/.env.example`. A variável pública do frontend é:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

O backend usa `PORT=3000` internamente, `CORS_ORIGIN=http://localhost:3000`, PostgreSQL em `DB_*`, Elasticsearch em `ELASTICSEARCH_URL` e credenciais do Cloudinary em `CLOUDINARY_*`.

## Funcionalidades implementadas

- catálogo público, categorias, busca e personalização de produtos;
- adicionais, bordas e tamanhos vinculados à configuração do produto;
- carrinho e checkout via WhatsApp;
- autenticação administrativa e controle por role;
- CRUD administrativo de produtos, categorias, tamanhos, bordas, adicionais e loja;
- pedidos de clientes e acompanhamento administrativo;
- favoritos e perfil do cliente pela API;
- documentação Swagger e collection Postman.

Adicionais são opções de configuração e não produtos independentes no catálogo público. Fixtures do frontend são mantidas somente para testes; o runtime público consulta a API.

## API

Prefixo: `/api/v1`.

- Autenticação: `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me`, `/auth/user/register`;
- catálogo: `/categories`, `/products`, `/products/search`, `/products/configurations`, `/additionals`, `/edges`, `/sizes`;
- loja: `/store`, `/store/status`;
- cliente: `/users/me`, `/users/me/favorites`, `/users/me/orders`;
- administração de pedidos: `/admin/orders`, `/admin/orders/:id/status`.

Os métodos, corpos, parâmetros e envelopes atuais estão em `backend/src/config/openApiConfig.ts` e `backend/docs/Pizza-Express.postman_collection.json`.

## Credenciais de demonstração

Criadas pelo seed local:

```text
Administrador: admin@pizzaexpress.com / Admin@123
Cliente: cliente@pizzaexpress.com / Cliente@123
```

Não use essas credenciais em produção.

## Testes e builds

Frontend:

```bash
cd frontend
npm run lint
npm test -- --run
npm run test:e2e
npm run build
```

Backend:

```bash
cd backend
npm run build
npm run test:unit
npm run test:integration
npm run test:contract
```

O backend não possui script de lint dedicado. Testes de integração precisam de PostgreSQL/configuração compatível; E2E precisa do frontend e backend em execução.

## Limitações conhecidas

- Elasticsearch é obrigatório para a busca indexada;
- upload depende de Cloudinary configurado;
- o checkout persistido depende de PostgreSQL;
- o frontend não inventa fallback de dados quando a API falha;
- migrations já aplicadas não devem ser removidas nem reordenadas.

## Documentação complementar

- [README do backend](backend/README.md)
- [README do frontend](frontend/README.md)
- [Collection Postman](backend/docs/Pizza-Express.postman_collection.json)
- [Swagger](http://localhost:3001/api-docs)
