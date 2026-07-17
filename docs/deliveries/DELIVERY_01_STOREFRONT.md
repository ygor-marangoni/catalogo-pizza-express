# Entrega 1 — Storefront

## Escopo

Home Pizza Express, categoria, busca, produto configurável em modal, carrinho local, responsividade, acessibilidade, SEO básico, documentação e testes.

## Critérios

- Catálogo local via repositório.
- Assets e fontes oficiais locais.
- Valores em centavos.
- Variações e adicionais validados.
- Carrinho v1 persistente e migrável.
- Sem integração, autenticação, pedido ou pagamento real.
- Lint, testes principais e build aprovados.

## Resultado técnico

- Home, categorias, busca, modal de produto, variações, adicionais e carrinho concluídos.
- Identidade Pizza Express aplicada com logo, banner e fontes oficiais.
- Header fixo com acabamento branco na logo sobreposta, botões refinados e espaçamento compensado no conteúdo.
- Header mobile com menu hambúrguer, logo central e acesso ao carrinho por ícone de sacola.
- Ícones oficiais otimizados `assets/icons/shopping-bag.webp` e `assets/icons/user.webp` aplicados ao header e à conta mobile.
- Menu mobile acessível com busca, categorias e acesso informativo à conta futura.
- Menu mobile refinado com navegação em caixa normal, destaque discreto para Início, ícones em chips e bloco inferior separado para entrega e conta.
- Endereço do menu tratado como informação secundária, sem aparência de ação ou link.
- Sombras removidas de botões, cards, modais e drawers; somente o contêiner fixo do header mantém sombra.
- Hero oficial reutilizado no topo das páginas de categoria, incluindo Salgadas.
- Hero informa acima do título o horário do dia e o estado `Aberto`/`Fechado`, calculados no fuso de São Paulo; o endereço oficial foi movido para o menu mobile.
- Headline do hero sem elementos inseridos entre as palavras, com scrim reforçado e status de funcionamento destacado em badge para maior contraste.
- Refinamento posterior restaurou os selos oficiais de pizza e Brasil no headline, clareou o banner e renomeou a seção principal de produtos para `DESTAQUES`.
- O bloco de entrega, conta e endereço permanece ancorado no rodapé do menu mobile, enquanto a navegação pode rolar em telas mais baixas.
- O item atual do menu destaca somente texto e chip do ícone, sem preencher o fundo da linha.
- Categorias móveis exibem parte do próximo card e usam overlay consistente para comunicar a rolagem e preservar legibilidade.
- Modal sincronizado com `?produto=[slug]`, histórico do navegador e restauração por recarga.
- Carrinho persistente em `localStorage`, com formato v1 e migração defensiva.
- Barra flutuante responsiva resume quantidade e subtotal e abre a sacola existente, sem enviar pedido ou integrar WhatsApp.
- Indicador de desenvolvimento do Next.js desativado para não colidir com a barra fixa da sacola; ele já não integra a interface de produção.
- Estados vazio, indisponível, erro, loading e not-found implementados.
- Metadata, Open Graph, sitemap e robots implementados.
- Acessibilidade de teclado, foco, Escape, scroll lock e reduced motion coberta.
- Hidratação determinística do carrinho e tolerância restrita a atributos injetados no `<html>` por extensões.
- Breakpoints 320, 375, 430, 768, 1024, 1280 e 1440 px verificados automaticamente sem overflow horizontal.

## Verificação final em 2026-07-17

| Verificação | Resultado |
|---|---|
| ESLint | Aprovado, zero warnings |
| Vitest/Testing Library | 5 arquivos, 18 testes aprovados |
| Playwright | 21 aprovados, 5 skips intencionais de cenários exclusivos por perfil |
| Build Next.js | Aprovado, 8 rotas geradas |
| npm audit | Zero vulnerabilidades no relatório final |

## Auditoria de estabilização e desempenho

- Assets usados em produção convertidos para WebP, mantendo os PNGs originais como arquivos-mestre.
- Payload de mídia compilada reduzido de aproximadamente 20,61 MB para 1,18 MB (94,3%).
- Modal de produto, carrinho e menu mobile carregados sob demanda para reduzir JavaScript inicial.
- Dados enviados ao header limitados aos campos efetivamente consumidos; sugestões limitadas a produtos disponíveis.
- Bloqueio de scroll dos overlays corrigido sem zerar a posição da página e com devolução de foco sem scroll involuntário.
- Persistência do carrinho reforçada para falhas do `localStorage`, itens inválidos, quantidades fora do limite e migração da chave legada.
- Validação de adicionais rejeita opções inexistentes ou indisponíveis antes de calcular/adicionar o item.
- Metadata, sitemap e robots usam `SITE_URL`, com fallback local apenas para desenvolvimento.
- PostCSS transitivo atualizado por override compatível para 8.5.19; Next.js e React foram mantidos nas versões definidas.
- Medição sintética de Core Web Vitals não foi registrada porque o profiler Chrome DevTools não estava disponível nesta sessão; nenhum valor foi estimado ou inventado.

## Alterações

- Fundação Next.js 16.2.10, React 19.2.7, JavaScript e App Router.
- Design system em CSS global/Modules com Figtree, Test Söhne Breit e Lucide.
- Fixtures da Pizza Express para loja, cinco categorias e onze produtos.
- Contrato `CatalogRepository` e implementação `LocalCatalogRepository`.
- Domínio de catálogo, produto e carrinho com JSDoc.
- Logo, banner, selo de pizza, bandeira e imagem de pizza oficiais presentes em `assets/`.
- Cards de produto e modal reutilizável sem navegação visual para uma página independente.
- Testes unitários, componentes, fluxos críticos, overlays e responsividade.

Nenhum arquivo anterior em `assets/` foi alterado ou removido.

## Não implementado por pertencer a entregas futuras

Firebase, autenticação, Firestore, Cloudinary, CMS, pedidos reais, clientes, estoque, dashboard, Chart.js, pagamento, fiscal e MarketUP.

## Limitações e pendências

- Produtos permanecem fixtures locais controladas; não existe fonte remota nesta entrega.
- Frete, cupom, identificação e checkout são informativos e não executam ações reais.
- A aprovação funcional/visual do usuário permanece pendente.
- A inspeção pelo navegador incorporado não esteve disponível na sessão; a validação foi realizada pelo Chromium do Playwright em desktop e mobile.

## Checklist de aceite

- [x] Home implementada.
- [x] Categorias e listagens responsivas funcionais.
- [x] Busca com debounce, sugestões e URL funcional.
- [x] Modal de produto, variações, adicionais e validações funcionais.
- [x] URL do modal funciona com voltar, avançar e recarregar.
- [x] Logo, banner e fontes oficiais aplicados.
- [x] Carrinho, edição, remoção, limpeza e persistência funcionais.
- [x] Layout responsivo sem Tailwind ou TypeScript.
- [x] Sem Firebase, CMS, pedidos ou pagamentos reais.
- [x] Lint, testes e build aprovados.
- [x] Documentação atualizada.
- [ ] Aprovação explícita do usuário.

## Estado

Aguardando aprovação. As Entregas 2, 3 e 4 permanecem bloqueadas.

Mensagem de commit sugerida: `fix(storefront): refina identidade e experiência da Pizza Express`.
