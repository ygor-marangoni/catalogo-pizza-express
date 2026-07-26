# Integração com a API

## Ambiente local

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- API: `http://localhost:3001/api/v1`
- Swagger: `http://localhost:3001/api-docs`
- Health: `http://localhost:3001/health`

Use `NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1`. O catálogo público usa exclusivamente os dados retornados pela API; fixtures permanecem isoladas nos testes.

O cliente central interpreta `{ success, data, error }`, paginação e falhas de rede. O access token administrativo fica apenas em memória; o refresh permanece em cookie `httpOnly`. Há somente um refresh e um retry após 401. Produtos usam `multipart/form-data`.

`ApiCatalogRepository` converte snake_case, gera slugs e acrescenta o ID em colisões. Imagens ausentes usam `assets/images/produto-exemplo.webp`. Branding, redes sociais e banners permanecem locais.

## Configuração comercial

Tamanhos, bordas e adicionais possuem cadastros globais, mas a disponibilidade é configurada individualmente em cada produto:

- cada tamanho vinculado possui um preço final em centavos;
- exatamente um tamanho vinculado deve ser o padrão;
- bordas e adicionais usam o preço global por padrão;
- `price_override` permite uma exceção apenas naquele produto, sem alterar o cadastro global;
- produtos simples podem permanecer sem tamanhos, bordas ou adicionais.

O painel salva esses vínculos em `PUT /products/:id/configuration`. O storefront carrega a configuração efetiva e o carrinho registra um snapshot do tamanho, das opções e do preço escolhido.

## Desempenho

O catálogo agrupa categorias, produtos e configurações em chamadas paralelas e deduplicadas por renderização. A listagem inicial envia ao navegador somente um índice leve dos produtos; os detalhes de tamanhos, bordas e adicionais são buscados sob demanda quando o modal do produto é aberto.

As respostas JSON do backend usam compressão HTTP. O modo API continua sem cache persistente para que alterações administrativas apareçam após atualizar a página.

A busca usa Elasticsearch e, somente em erro 503, recarrega `/products` para filtrar no frontend.
