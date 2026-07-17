# Modelo de dados

Todos os preços são inteiros em centavos.

## Catálogo local

- Store: identidade, contato, endereço, horários, modalidades e tema.
- Category: identidade, slug, descrição, imagem, estado e ordem.
- Product: identidade, textos, categoria, tags, imagens, preços, disponibilidade, destaques, variações e grupos de adicionais.
- Variant: preço final opcional ou acréscimo em centavos.
- AddonGroup: limites mínimo/máximo e opções com acréscimo.

## Carrinho v1

```json
{
  "version": 1,
  "storeId": "pizza-express",
  "items": [],
  "updatedAt": "ISO_DATE"
}
```

Cada item guarda snapshot de nome, imagem e preço, escolhas normalizadas, quantidade, observação e chave de configuração. A migração descarta estruturas desconhecidas de forma segura.

O modelo futuro do Firestore está registrado apenas conceitualmente: `stores/{storeId}` e subcoleções de catálogo, pedidos, clientes e analytics.
