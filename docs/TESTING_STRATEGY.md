# Estratégia de testes

- Vitest: moeda, preços, adicionais, totais, validações e migração/persistência.
- React Testing Library: componentes interativos e comportamento acessível.
- Playwright: home → categoria → busca → produto configurado → carrinho → edição → persistência → remoção.
- ESLint: qualidade estática.
- `next build`: integração, rotas, metadata e renderização de produção.

Comandos: `npm run lint`, `npm run test`, `npm run test:e2e` e `npm run build`.

## Última execução

Em 2026-07-17: lint aprovado; 18 testes Vitest/Testing Library aprovados; 21 cenários Playwright aprovados com 5 skips intencionais de cenários exclusivos por perfil; build aprovado; `npm audit` sem vulnerabilidades. A suíte E2E também captura `console.error`, exceções de página, valida os breakpoints de aceite e simula atributos inseridos no `<html>` por extensões.
