# Pizza Express — Frontend

Frontend Next.js do catálogo público e do painel administrativo. Os dados de runtime vêm da API REST em `http://localhost:3001/api/v1`.

## Tecnologias e estrutura

- Next.js 16 com App Router;
- React 19 e JavaScript;
- CSS Modules;
- Context API para carrinho;
- services e repositories para comunicação e mapeamento da API;
- Vitest, Testing Library e Playwright.

Principais diretórios: `src/app` (rotas), `src/components` (UI), `src/services` (HTTP/domínios), `src/repositories` (adaptação da API), `src/contexts` (estado), `src/features` (regras) e `tests`.

Fixtures em `src/fixtures` são usadas exclusivamente por testes unitários. O catálogo público não usa fixtures como fonte de dados.

## Configuração

Copie `.env.example` para `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

Não coloque tokens ou segredos em variáveis `NEXT_PUBLIC_*`.

## Execução

```bash
npm install
npm run dev -- --webpack
```

O frontend fica em `http://localhost:3000`. A API, PostgreSQL e Elasticsearch devem estar disponíveis para o catálogo e o painel.

## Páginas

Públicas:

- `/` — catálogo e destaques;
- `/busca` e `/busca?q=termo` — busca;
- `/categoria/[slug]` — categoria;
- `/produto/[slug]` — compatibilidade com URL legada;
- `/?produto=[slug]` — modal de personalização;
- `/carrinho` — carrinho.

Administrativas:

- `/admin/login` — autenticação;
- `/admin` — dashboard;
- `/admin/produtos`, `/admin/produtos/novo`, `/admin/produtos/[id]`;
- `/admin/categorias`;
- `/admin/tamanhos`;
- `/admin/bordas`;
- `/admin/adicionais`;
- `/admin/loja`.

## Integração e estado

O cliente HTTP interpreta o envelope `{ success, data, error }`, envia o access token em memória e usa refresh token por cookie `httpOnly`. O `CartContext` mantém o carrinho localmente. O painel usa autenticação administrativa com role `ADMIN`.

Produtos são carregados por ID e as configurações de tamanhos, bordas e adicionais vêm dos endpoints reais de configuração. Adicionais não são vendidos como produtos independentes.

## Comandos

```bash
npm run lint
npm test -- --run
npm run test:e2e
npm run build
```

O E2E exige o backend ativo, seed carregado, CORS permitindo `http://localhost:3000` e o servidor Next disponível.

## Limitações

- Busca indexada depende do Elasticsearch no backend;
- upload de imagens depende do Cloudinary;
- pedidos e favoritos persistidos dependem de PostgreSQL;
- não há upload de logo/banner;
- o backend atual não expõe endpoints por slug: as URLs usam IDs reais quando necessário;
- imagens de marca e banners são assets estáticos de apresentação, não dados de catálogo.
