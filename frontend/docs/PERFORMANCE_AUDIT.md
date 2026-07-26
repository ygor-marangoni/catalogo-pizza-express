# Auditoria de desempenho

Data da medição: 26/07/2026  
Ambiente: Windows local, frontend Next.js 16, backend Docker/Express, PostgreSQL local.

## Diagnóstico

Os maiores custos encontrados não estavam nas consultas do PostgreSQL. A consulta de produtos executou em aproximadamente 1,3 ms no banco. Os gargalos estavam na composição do catálogo:

1. o layout e a home solicitavam o mesmo catálogo mais de uma vez na mesma renderização;
2. cada carregamento montava categorias, produtos, tamanhos, bordas e adicionais novamente;
3. o layout enviava todos os produtos e todas as combinações para um componente client-side, mesmo sem modal aberto;
4. o lote de configurações gerava 57,6 KB de JSON sem compressão;
5. o modo `next dev` acumulava custo de compilação, source maps e Hot Reload, mascarando o desempenho da build de produção.

## Alterações aplicadas

- chamadas públicas paralelizadas e deduplicadas por renderização com `React.cache`;
- catálogo carregado em um único fluxo de adaptação;
- layout envia apenas `{ id, slug }` como índice para o controlador do modal;
- produto e configuração detalhada são carregados somente ao abrir o modal;
- imagens continuam usando `next/image` e arquivos WebP;
- respostas Express comprimidas com `compression`;
- índices por `product_id` nas novas tabelas de configuração;
- busca de uma configuração filtra no banco apenas o produto solicitado;
- storefront e painel continuam sem cache persistente, preservando consistência após alterações administrativas.

## Resultados locais

| Medição | Resultado |
|---|---:|
| Health da API | 64–91 ms |
| Lista de 62 produtos | 139 ms / 17,0 KB |
| Configurações sem compressão | 87 ms / 57,6 KB |
| Configurações comprimidas | 29 ms / 1,45 KB transferidos |
| Home em build de produção, TTFB | 38–39 ms |
| Home em build de produção, total HTTP | 146–178 ms |
| Painel em build de produção, total HTTP | 121 ms |
| HTML/RSC inicial da home | 129 KB |

O payload inicial observado antes do carregamento sob demanda estava próximo de 227 KB. A nova composição ficou em aproximadamente 129 KB, redução de cerca de 43%.

## Como interpretar o desenvolvimento

`npm run dev` prioriza recompilação e diagnóstico. Na primeira visita, Turbopack compila a rota; Hot Reload, source maps e o overlay também consomem CPU e memória. Esses tempos não representam a aplicação publicada.

Para medir a experiência real local:

```bash
npm run build
npm run start
```

## Limites da auditoria

As métricas HTTP, banco, build e payload foram coletadas. Core Web Vitals instrumentados no Chrome (LCP, INP e CLS) não foram registrados porque a sessão atual não disponibilizou o conector Chrome DevTools exigido para tracing. Uma auditoria de navegador em hardware e rede de produção ainda é recomendada antes da publicação.

## Próximas otimizações, se necessárias em produção

- servir assets estáticos por CDN com cache imutável;
- observar p95/p99 da API e taxa de erro;
- capturar LCP, INP e CLS reais;
- habilitar logs estruturados de duração por endpoint;
- avaliar paginação pública caso o catálogo cresça para centenas de produtos.
