# Rotas e telas

## Entrega 1

| Rota | Tela | Origem dos dados |
|---|---|---|
| `/` | Home, categorias e seções editoriais | LocalCatalogRepository |
| `/categoria/[slug]` | Categoria, filtros e ordenação | LocalCatalogRepository |
| `/busca?q=` | Resultados e termo refletido na URL | LocalCatalogRepository |
| `?produto=[slug]` | Modal de personalização, sem recarregar ou perder o scroll | LocalCatalogRepository |
| `/carrinho` | Carrinho completo | localStorage versionado |

O caminho legado `/produto/[slug]` apenas redireciona para `/?produto=[slug]`; não existe tela visual independente de produto. A query participa do histórico, portanto voltar fecha o modal, avançar reabre e uma recarga restaura o produto.

`sitemap.xml`, `robots.txt`, `not-found`, loading e erro global também são fornecidos. Rotas administrativas e APIs permanecem ausentes.
