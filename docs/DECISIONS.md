# Registro de decisões

## ADR-001 — CSS Modules em vez de Tailwind

- Data: 2026-07-16
- Contexto: identidade visual própria e tecnologia definida.
- Alternativas: Tailwind, CSS-in-JS, CSS global.
- Escolha: CSS Modules com tokens globais.
- Motivo: escopo local, previsibilidade e ausência de runtime.
- Consequências: mais arquivos CSS e controle explícito.
- Revisão: possível se os requisitos mudarem, não durante a Entrega 1.

## ADR-002 — Firebase como banco inicial futuro

- Data: 2026-07-16
- Contexto: CMS e catálogo remoto da Entrega 2.
- Alternativas: banco SQL, Supabase, API própria.
- Escolha: Firestore atrás de repositório.
- Motivo: tecnologia definida pelo produto.
- Consequências: regras, emuladores e Admin SDK serão obrigatórios na Entrega 2.
- Revisão: possível antes de iniciar a Entrega 2.

## ADR-003 — Dados locais na Entrega 1

- Data: 2026-07-16
- Contexto: storefront precisa evoluir sem acoplar interface à persistência.
- Alternativas: JSON direto, API mock, Firestore antecipado.
- Escolha: fixtures JavaScript via LocalCatalogRepository.
- Motivo: permite domínio rico e troca futura de fonte.
- Consequências: dados são demonstrativos e não editáveis.
- Revisão: substituição planejada na Entrega 2.

## ADR-004 — Chart.js no dashboard

- Data: 2026-07-16
- Contexto: indicadores operacionais futuros.
- Alternativas: outras bibliotecas de gráficos.
- Escolha: Chart.js com react-chartjs-2.
- Motivo: tecnologia definida.
- Consequências: instalação adiada até a Entrega 3.
- Revisão: somente por decisão explícita antes da Entrega 3.

## ADR-005 — Validar MarketUP antes da Entrega 4

- Data: 2026-07-16
- Contexto: não há comprovação atual de integração oficial adequada.
- Alternativas: API oficial, fluxo assistido, outro provedor fiscal.
- Escolha: investigação formal antes de código.
- Motivo: evitar APIs privadas, scraping e risco fiscal.
- Consequências: nenhum adaptador MarketUP existe agora.
- Revisão: após documentação e acesso oficial.

## ADR-006 — Carrinho local versionado

- Data: 2026-07-16
- Contexto: persistência sem conta ou backend.
- Alternativas: memória da sessão, cookies, IndexedDB.
- Escolha: localStorage com versão e migração.
- Motivo: simplicidade e continuidade entre recargas.
- Consequências: conteúdo não é fonte confiável para preço futuro.
- Revisão: na introdução do checkout da Entrega 3.

## ADR-007 — Figtree para interface e Test Söhne Breit para títulos

- Data: 2026-07-16
- Contexto: o refinamento visual definiu Figtree para toda a interface textual e Test Söhne Breit somente para títulos principais.
- Alternativas: Stolzl local, somente Test Söhne Breit, Figtree com display local.
- Escolha: Figtree por `next/font/google` nos pesos 400 a 700 e Test Söhne Breit local nos pesos oficiais 400 e 500.
- Motivo: aderência à direção tipográfica aprovada pelo usuário.
- Consequências: parágrafos, botões, campos, navegação e `h3` usam Figtree; títulos principais usam Test Söhne Breit.
- Revisão: possível mediante novo refinamento visual aprovado.

## ADR-008 — Hidratação do carrinho por store externa

- Data: 2026-07-16
- Contexto: o carrinho local precisa ser restaurado sem produzir snapshots diferentes entre SSR e a primeira renderização cliente.
- Alternativas: estado inicial condicionado por `window`, atualização síncrona em efeito, store externa.
- Escolha: `useSyncExternalStore` com snapshot vazio estável no servidor e leitura do `localStorage` após a hidratação.
- Motivo: eliminar ramificações servidor/cliente durante a renderização e preservar a persistência.
- Consequências: o estado do carrinho fica centralizado por `storeId`; atributos inseridos por extensões no `<html>` são isoladamente tolerados com `suppressHydrationWarning`.
- Revisão: ao introduzir conta e carrinho server-side em entrega futura.

## ADR-009 — Produto em modal sincronizado com query string

- Data: 2026-07-16
- Contexto: a personalização deve preservar a página e a posição do cardápio sem perder navegação por URL.
- Alternativas: página independente, rota interceptada, modal controlado por query.
- Escolha: componente reutilizável aberto por `?produto=[slug]` e integrado ao histórico do navegador.
- Motivo: solução simples, contínua e compatível com recarga, voltar e avançar.
- Consequências: o caminho visual de produto deixa de existir; o caminho legado somente redireciona.
- Revisão: possível se requisitos futuros justificarem rotas interceptadas.

## ADR-010 — Assets de produção em WebP com originais preservados

- Data: 2026-07-17
- Contexto: os PNGs oficiais usados pelo storefront somavam mais de 20 MB no bundle de mídia.
- Alternativas: manter PNG, reduzir qualidade dos originais, usar WebP derivado.
- Escolha: gerar derivados WebP dimensionados para o uso real e preservar os arquivos originais como mestres.
- Motivo: reduzir transferência e decodificação sem perder os assets oficiais nem alterar a identidade visual.
- Consequências: os imports de produção usam WebP; os PNGs continuam disponíveis para futuras derivações.
- Revisão: possível adotar AVIF seletivamente após medição visual e de compatibilidade.

## ADR-011 — Override transitivo e temporário do PostCSS

- Data: 2026-07-17
- Contexto: Next.js 16.2.10 é a versão estável mais recente, mas fixa uma versão do PostCSS afetada por um alerta moderado.
- Alternativas: aceitar o alerta, executar downgrade forçado, aplicar override compatível.
- Escolha: manter Next.js 16.2.10 e resolver seu PostCSS transitivo para 8.5.19.
- Motivo: remover a vulnerabilidade sem downgrade ou mudança de arquitetura.
- Consequências: build, lint, testes unitários e E2E devem validar o override; ele deve ser removido quando o Next.js atualizar sua dependência.
- Revisão: obrigatória na próxima atualização estável do Next.js.
