# Pizza Express

Catalogo digital e painel administrativo da Pizza Express, com frontend
Next.js e API Express/TypeScript integrada a PostgreSQL e Elasticsearch.

## Execucao completa com Docker

Na raiz do projeto:

```bash
docker compose -p pizza-express up -d --build
```

O Compose inicia frontend, backend, PostgreSQL e Elasticsearch. O serviço
temporario `backend-init` executa migrations e seed antes da API iniciar.

Para acompanhar os logs:

```bash
docker compose -p pizza-express logs -f
```

Para remover containers e dados locais:

```bash
docker compose -p pizza-express down --volumes --remove-orphans
```

## Portas

| Servico | URL |
| --- | --- |
| Frontend | `http://localhost:3000` |
| API | `http://localhost:3001` |
| Swagger | `http://localhost:3001/api-docs` |
| PostgreSQL | `localhost:5432` |
| Elasticsearch | `http://localhost:9200` |

## Arquitetura

- `frontend/`: Next.js, catalogo publico, busca, carrinho e painel admin;
- `backend/`: Express, TypeScript, JWT, TypeORM, OpenAPI e regras de negocio;
- PostgreSQL: usuarios, catalogo, loja, favoritos e pedidos;
- Elasticsearch: busca textual por nome e descricao.

O navegador usa `http://localhost:3001/api/v1`; o frontend usa
`http://backend:3000/api/v1` internamente durante a renderizacao no container.

## Execucao manual

Consulte os READMEs de [backend](backend/README.md) e [frontend](frontend/README.md).
Copie os arquivos `.env.example` para os respectivos ambientes antes de
executar fora do Compose.

## Documentacao e testes

- [OpenAPI](http://localhost:3001/api-docs)
- [Collection Postman](backend/docs/Pizza-Express.postman_collection.json)
- [Requisitos atuais da API](backend/pizza-express-backend-requisitos.md)

```bash
cd frontend && npm run lint && npm test -- --run && npm run build
cd ../backend && npm run build && npm run test:unit && npm run test:integration && npm run test:contract
```

Adicionais e bordas são opções vinculadas à configuração de um produto, não
itens independentes do carrinho. Credenciais de seed são apenas para ambiente
local e devem ser alteradas em qualquer ambiente compartilhado.
