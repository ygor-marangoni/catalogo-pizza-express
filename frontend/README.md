# Pizza Express — Frontend

Frontend Next.js do cardápio público e painel administrativo, integrado à API REST do backend em `/api/v1`.

## Tecnologias e arquitetura

- Next.js 16 com App Router, React 19 e JavaScript;
- cliente HTTP centralizado em `src/services/api-client.js`;
- serviços por domínio em `src/services`;
- repository de catálogo baseado exclusivamente na API;
- estado local do carrinho e `AuthContext` para a sessão administrativa;
- Vitest, Testing Library e Playwright para validação.

O cliente entende o envelope `{ success, data, error }`, envia o access token em memória no header `Authorization` e usa o refresh token httpOnly por cookie. Uma única requisição de refresh é compartilhada quando várias chamadas recebem 401.

## Configuração

Copie `.env.example` para `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

Não coloque tokens ou segredos nas variáveis públicas do Next.js.

## Execução e verificações

```bash
npm install
npm run dev
npm run lint
npm test -- --run
npm run build
```

O frontend usa a API real configurada nessa variável. Por padrão, o Next roda em `http://localhost:3000` e o backend em `http://localhost:3001`; o CORS do backend precisa permitir a origem do frontend. O build pode precisar da API disponível porque as páginas fazem consultas dinâmicas.

## Páginas

- `/`: cardápio público, loja, categorias e produtos;
- `/busca`: pesquisa real de produtos;
- `/categoria/[slug]`: produtos de uma categoria;
- `/admin`: login e visão geral;
- `/login`: login centralizado para clientes e administradores, com redirecionamento por perfil;
- `/admin/products`: criação, edição, upload de imagem e exclusão lógica;
- `/admin/categories`: criação, edição e exclusão lógica;
- `/admin/settings`: dados da loja e abertura/fechamento.

## Estado e autenticação

O estado global é limitado à Context API: `CartContext` para o carrinho e contexts separados para cliente e administrador. O catálogo é carregado pelos services/repository diretamente da API; não há fixtures como fonte de dados em runtime. O access token fica somente em memória e o refresh token é um cookie `httpOnly` gerenciado pelo backend. Enquanto o backend não possui `POST /auth/logout`, o botão Sair limpa o estado local e redireciona, mas não pode revogar o cookie no servidor.

## Contratos e limitações reais

Os endpoints consumidos são os das rotas atuais `/api/v1/auth`, `/api/v1/users`, `/api/v1/store`, `/api/v1/categories`, `/api/v1/products`, `/api/v1/additionals`, `/api/v1/edges`, `/api/v1/sizes` e `/api/v1/admin/orders`. Produtos e categorias usam os IDs reais da API nas URLs; o backend não oferece endpoints por slug. O upload é somente de imagem de produto, no campo multipart `image`, com limite de 5 MiB no backend. Não há endpoint de upload de logo/banner.

Busca textual depende do Elasticsearch configurado no backend. Dados de pedidos, favoritos e catálogo só persistem quando o backend usa PostgreSQL (`USE_DATABASE=true`); o modo em memória é adequado apenas para testes/desenvolvimento.

## Verificações

```bash
npm run lint
npm test -- --run
npm run test:e2e
npm run build
```

O frontend não deve ser considerado integrado apenas por compilar: é necessário iniciar o backend, configurar PostgreSQL/seed e validar cookies, CORS e os fluxos de login, catálogo, pedido e administração.

## Contratos integrados

Autenticação, categorias, produtos, busca, loja/status, adicionais, bordas, tamanhos e rotas administrativas de catálogo usam os caminhos documentados na collection Postman e nas rotas reais do backend. O backend atual não implementa variantes, grupos de opções, banners/logo por upload, pausa ou endpoint de logout; essas funcionalidades não foram inventadas no frontend.

## Estrutura principal

`src/services` concentra HTTP e domínios; `src/repositories/catalog` adapta respostas para os componentes públicos; `src/contexts` mantém carrinho e autenticação; `src/app/admin` contém as telas protegidas; `src/components` mantém a identidade visual reutilizável.
