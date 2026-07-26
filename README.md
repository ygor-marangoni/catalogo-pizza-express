# Pizza Express

Catalogo digital e painel administrativo da Pizza Express, com frontend
Next.js e API Express/TypeScript integrada a PostgreSQL e Elasticsearch.

## Execucao obrigatoria via Docker

Docker Desktop deve estar instalado e em execucao. Backend, frontend,
PostgreSQL, Elasticsearch, migrations e seed sao iniciados pelo Compose da
raiz.

```powershell
copy .env.example .env
# Edite JWT_SECRET no .env com um segredo longo e exclusivo.
docker compose -p pizza-express up -d --build
```

O servico temporario `backend-init` prepara o banco antes de liberar a API e
o frontend.

## URLs

| Servico | URL |
| --- | --- |
| Frontend | http://localhost:3000 |
| API | http://localhost:3001 |
| Swagger | http://localhost:3001/api-docs |
| PostgreSQL | localhost:5432 |
| Elasticsearch | http://localhost:9200 |

## Operacao

```powershell
# Logs
docker compose -p pizza-express logs -f

# Rebuild apos alteracoes de codigo
docker compose -p pizza-express up -d --build

# Parar sem remover dados
docker compose -p pizza-express stop

# Remover containers e volumes locais
docker compose -p pizza-express down --volumes --remove-orphans
```

Nao execute `npm run dev`, `npm start` ou servidores separados para esta
aplicacao. A execucao oficial e centralizada no Compose da raiz.

Credenciais de demonstracao locais:

- Admin: `admin@pizzaexpress.com` / `Admin@123`
- Cliente: `cliente@pizzaexpress.com` / `Cliente@123`

Altere essas credenciais e o `JWT_SECRET` antes de compartilhar o ambiente.

## Documentacao

- Backend: `backend/src`, migrations e rotas da API;
- Frontend: `frontend/src`, paginas e componentes Next.js;
- [OpenAPI](http://localhost:3001/api-docs)
- [Collection Postman](backend/docs/Pizza-Express.postman_collection.json)
