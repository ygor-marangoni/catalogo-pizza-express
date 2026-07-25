# Recursos de backend a desenvolver

Este documento resume os principais recursos de backend que o projeto precisa para evoluir do storefront para uma operação completa.

## 1. Autenticação e gestão de usuários

- Login para administradores e equipe
- Perfis de acesso: admin, operador e atendente
- Recuperação de senha

### Endpoints sugeridos

- POST /api/auth/login  
  Descrição: autentica um usuário e retorna token de acesso.  
  Campos esperados: email, password

- POST /api/auth/logout  
  Descrição: encerra a sessão do usuário autenticado.  
  Campos esperados: token de autenticação

- GET /api/auth/me  
  Descrição: retorna os dados do usuário logado.  
  Campos esperados: token de autenticação

## 2. Catálogo administrativo

- CRUD de produtos
- CRUD de categorias
- Preços, ingredientes, disponibilidade e imagens
- Organização por loja e por segmento

### Endpoints sugeridos

- GET /api/products  
  Descrição: lista os produtos disponíveis.  
  Campos esperados: page, limit, categoryId, availableOnly

- GET /api/products/:id  
  Descrição: retorna os detalhes de um produto.  
  Campos esperados: id do produto

- POST /api/products  
  Descrição: cria um novo produto.  
  Campos esperados: name, description, price, categoryId, ingredients, imageUrl, available

- PUT /api/products/:id  
  Descrição: atualiza um produto existente.  
  Campos esperados: id do produto + campos do produto

- DELETE /api/products/:id  
  Descrição: remove um produto.  
  Campos esperados: id do produto

- GET /api/categories  
  Descrição: lista as categorias do catálogo.  
  Campos esperados: nenhum

- POST /api/categories  
  Descrição: cria uma nova categoria.  
  Campos esperados: name, description

## 3. Pedidos

- Criação de pedido a partir do carrinho
- Consulta de pedidos por cliente e por status
- Atualização de status: recebido, em preparo, entregue, cancelado

### Endpoints sugeridos

- POST /api/orders  
  Descrição: cria um novo pedido.  
  Campos esperados: customerName, customerPhone, address, items, totalPrice, paymentMethod

- GET /api/orders  
  Descrição: lista pedidos com filtros.  
  Campos esperados: status, dateFrom, dateTo, customerId

- GET /api/orders/:id  
  Descrição: detalha um pedido específico.  
  Campos esperados: id do pedido

- PATCH /api/orders/:id/status  
  Descrição: altera o status do pedido.  
  Campos esperados: id do pedido, status

## 4. Checkout e pagamento

- Integração com gateway de pagamento
- Validação de dados do cliente
- Geração de comprovante e confirmação do pedido

### Endpoints sugeridos

- POST /api/payments/checkout  
  Descrição: inicia o processo de pagamento.  
  Campos esperados: orderId, paymentMethod, customerData

- POST /api/payments/webhook  
  Descrição: recebe eventos do gateway de pagamento.  
  Campos esperados: event, paymentId, status

- GET /api/payments/:id/status  
  Descrição: consulta o status de um pagamento.  
  Campos esperados: id do pagamento

## 5. Estoque e disponibilidade

- Controle de itens disponíveis
- Atualização automática após pedido
- Alertas de produto indisponível

### Endpoints sugeridos

- GET /api/inventory  
  Descrição: lista o estoque atual.  
  Campos esperados: productId, storeId

- PATCH /api/inventory/:id  
  Descrição: atualiza a disponibilidade ou quantidade de um item.  
  Campos esperados: id do item, quantity, available

## 6. Arquivos e mídia

- Upload de imagens de produtos
- Organização de arquivos por categoria ou produto
- Exposição segura das imagens via backend

### Endpoints sugeridos

- POST /api/uploads/images  
  Descrição: envia uma imagem para o backend.  
  Campos esperados: file, productId, type

- GET /api/uploads/:fileId  
  Descrição: retorna os dados de um arquivo enviado.  
  Campos esperados: id do arquivo

## 7. Relatórios básicos

- Total de vendas
- Pedidos por período
- Produtos mais vendidos
- Status dos pedidos

### Endpoints sugeridos

- GET /api/reports/sales  
  Descrição: retorna resumo de vendas por período.  
  Campos esperados: dateFrom, dateTo

- GET /api/reports/popular-products  
  Descrição: lista os produtos mais vendidos.  
  Campos esperados: dateFrom, dateTo, limit

- GET /api/reports/orders  
  Descrição: retorna pedidos com filtros de análise.  
  Campos esperados: status, dateFrom, dateTo

## 8. API e integração

- Endpoints REST para o frontend
- Validação de dados e tratamento de erros
- Logs simples de operações

## Prioridade recomendada

- Fase 1: autenticação, catálogo, pedidos e estoque
- Fase 2: pagamento e relatórios
- Fase 3: integrações avançadas e automações
