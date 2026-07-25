# Segurança

## Entrega 1

- Não há credenciais, autenticação, banco remoto ou dados pessoais.
- O carrinho permanece exclusivamente no navegador e contém apenas escolhas de catálogo.
- Nenhum dado do carrinho é tratado como preço confiável para pedidos futuros.
- SVGs e textos são controlados localmente.
- Links futuros não executam ações silenciosas.

## Requisitos futuros

Operações sensíveis deverão ocorrer no servidor, com sessão segura, validação de autorização, recálculo de preços, regras do Firestore, idempotência, logs sem segredos e chaves privadas nunca expostas por `NEXT_PUBLIC_`.
