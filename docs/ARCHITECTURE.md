# Arquitetura

Aplicação única Next.js com App Router. Server Components são o padrão; Client Components ficam restritos a busca interativa, seletores, overlays e carrinho.

## Camadas da Entrega 1

- `app`: rotas, metadata e composição de páginas.
- `components`: interface por responsabilidade.
- `features`: regras de catálogo e carrinho.
- `repositories`: contrato da fonte de catálogo e implementação local.
- `fixtures`: dados controlados, sem arrays dentro de componentes.
- `lib`: formatadores e utilitários puros.

Fluxo de leitura: rota → `CatalogRepository` → `LocalCatalogRepository` → fixtures. A interface nunca conhece a origem física dos dados.

Fluxo do carrinho: configurador → funções puras de domínio → `CartContext` → armazenamento local versionado.

## Evolução planejada

A Entrega 2 adicionará `FirestoreCatalogRepository` sob o mesmo contrato. Integrações futuras ficarão em adaptadores e serviços server-side. Não há microserviços ou implementação remota nesta fase.
