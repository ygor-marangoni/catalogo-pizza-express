# Backend + Painel Administrativo — Pizza Express

## 1. Objetivo

Criar uma API REST em **Node.js + Express** para substituir os dados mockados do cardápio e permitir que a Pizza Express gerencie:

- Categorias;
- Produtos;
- Tamanhos;
- Bordas;
- Adicionais;
- Imagens;
- Preços;
- Disponibilidade;
- Destaques e promoções;
- Informações e status da loja.

O backend atenderá:

1. Front-end público do cardápio;
2. Painel administrativo;
3. Autenticação do administrador.

---

## 2. Fora do escopo nesta etapa

Não implementar agora:

- Pedidos;
- Clientes;
- Login do cliente;
- Pagamentos;
- Dashboard financeiro;
- Relatórios;
- Cupons reais;
- Motoboys;
- WhatsApp;
- Impressoras;
- Nota fiscal;
- MarketUP.

---

## 3. Tecnologias e requisitos gerais

- Node.js;
- Express;
- PostgreSQL;
- API versionada em `/api/v1`;
- Autenticação administrativa com JWT;
- Refresh token em cookie `httpOnly`;
- Senhas com hash usando bcrypt;
- Validação dos dados recebidos;
- Valores financeiros armazenados em centavos;
- Exclusão lógica;
- Paginação no painel;
- CORS configurado;
- Rate limit no login;
- Tratamento centralizado de erros;
- Documentação Swagger/OpenAPI;
- `.env.example`;
- Seed com um administrador inicial;
- Logs básicos das ações administrativas;
- Cloudinary para imagens.

### Resposta padrão de sucesso

```json
{
	"success": true,
	"data": {},
	"error": null
}
```

### Resposta padrão de erro

```json
{
	"success": false,
	"data": null,
	"error": {
		"code": "PRODUCT_NOT_FOUND",
		"message": "Produto não encontrado.",
		"field": null
	}
}
```

---

## 4. Endpoints

### 4.1 Autenticação administrativa

| Método | Endpoint                     | Função                             |
| ------ | ---------------------------- | ---------------------------------- |
| POST   | `/api/v1/auth/admin/login`   | Fazer login                        |
| POST   | `/api/v1/auth/admin/refresh` | Renovar sessão                     |
| POST   | `/api/v1/auth/admin/logout`  | Encerrar sessão                    |
| GET    | `/api/v1/auth/admin/me`      | Retornar administrador autenticado |

### Login

```http
POST /api/v1/auth/admin/login
```

```json
{
	"email": "admin@pizzaexpress.com.br",
	"password": "senha"
}
```

---

### 4.2 Endpoints públicos da loja

| Método | Endpoint               | Função                  |
| ------ | ---------------------- | ----------------------- |
| GET    | `/api/v1/store`        | Dados públicos da loja  |
| GET    | `/api/v1/store/status` | Status atual da loja    |
| GET    | `/api/v1/catalog/home` | Dados agregados da home |

Estados da loja:

```text
OPEN
CLOSED
PAUSED
```

Exemplo de retorno:

```json
{
	"success": true,
	"data": {
		"id": "pizza-express",
		"name": "Pizza Express",
		"logoUrl": "https://...",
		"bannerDesktopUrl": "https://...",
		"bannerMobileUrl": "https://...",
		"phone": "3438425153",
		"whatsapp": "553438425153",
		"status": "OPEN",
		"deliveryEnabled": true,
		"pickupEnabled": true,
		"deliveryFeeInCents": 500,
		"minimumOrderInCents": 2500,
		"estimatedDeliveryMinutes": {
			"minimum": 30,
			"maximum": 50
		}
	},
	"error": null
}
```

---

### 4.3 Categorias públicas

| Método | Endpoint                   | Função                     |
| ------ | -------------------------- | -------------------------- |
| GET    | `/api/v1/categories`       | Listar categorias ativas   |
| GET    | `/api/v1/categories/:slug` | Buscar categoria pelo slug |

Exemplo:

```http
GET /api/v1/categories/salgadas
```

---

### 4.4 Produtos públicos

| Método | Endpoint                 | Função                      |
| ------ | ------------------------ | --------------------------- |
| GET    | `/api/v1/products`       | Listar e pesquisar produtos |
| GET    | `/api/v1/products/:slug` | Buscar produto pelo slug    |

Filtros esperados:

```text
?category=salgadas
?search=bacon
?featured=true
?promotion=true
?available=true
?page=1
?limit=20
```

Exemplo:

```http
GET /api/v1/products?category=salgadas&available=true&page=1&limit=20
```

---

### 4.5 Administração de categorias

Todos exigem autenticação.

| Método | Endpoint                              | Função              |
| ------ | ------------------------------------- | ------------------- |
| GET    | `/api/v1/admin/categories`            | Listar todas        |
| POST   | `/api/v1/admin/categories`            | Criar               |
| GET    | `/api/v1/admin/categories/:id`        | Buscar por ID       |
| PATCH  | `/api/v1/admin/categories/:id`        | Atualizar           |
| PATCH  | `/api/v1/admin/categories/:id/status` | Ativar ou desativar |
| PATCH  | `/api/v1/admin/categories/reorder`    | Reordenar           |
| DELETE | `/api/v1/admin/categories/:id`        | Exclusão lógica     |

Exemplo de criação:

```json
{
	"name": "Salgadas",
	"slug": "salgadas",
	"description": "Pizzas salgadas para todos os gostos.",
	"imageUrl": "https://...",
	"active": true,
	"sortOrder": 1
}
```

---

### 4.6 Administração de produtos

| Método | Endpoint                                  | Função                       |
| ------ | ----------------------------------------- | ---------------------------- |
| GET    | `/api/v1/admin/products`                  | Listar produtos              |
| POST   | `/api/v1/admin/products`                  | Criar produto                |
| GET    | `/api/v1/admin/products/:id`              | Buscar por ID                |
| PATCH  | `/api/v1/admin/products/:id`              | Atualizar                    |
| PATCH  | `/api/v1/admin/products/:id/status`       | Ativar ou desativar          |
| PATCH  | `/api/v1/admin/products/:id/availability` | Alterar disponibilidade      |
| PATCH  | `/api/v1/admin/products/:id/visibility`   | Alterar destaque ou promoção |
| POST   | `/api/v1/admin/products/:id/duplicate`    | Duplicar                     |
| DELETE | `/api/v1/admin/products/:id`              | Exclusão lógica              |

Filtros administrativos:

```text
?search=
?categoryId=
?active=true
?available=true
?featured=true
?promotion=true
?page=1
?limit=20
```

---

### 4.7 Upload de imagens

| Método | Endpoint                       | Função                      |
| ------ | ------------------------------ | --------------------------- |
| POST   | `/api/v1/admin/uploads/images` | Enviar imagem ao Cloudinary |
| DELETE | `/api/v1/admin/uploads/images` | Remover imagem              |

Upload:

```http
POST /api/v1/admin/uploads/images
Content-Type: multipart/form-data
```

Campos:

```text
file
folder
alt
```

Retorno:

```json
{
	"success": true,
	"data": {
		"publicId": "pizza-express/products/arquivo",
		"url": "https://...",
		"secureUrl": "https://...",
		"width": 1080,
		"height": 1080,
		"format": "webp"
	},
	"error": null
}
```

Aceitar somente:

- JPEG;
- PNG;
- WebP.

---

### 4.8 Configurações da loja

| Método | Endpoint                     | Função                  |
| ------ | ---------------------------- | ----------------------- |
| GET    | `/api/v1/admin/store`        | Obter configurações     |
| PATCH  | `/api/v1/admin/store`        | Atualizar configurações |
| PATCH  | `/api/v1/admin/store/status` | Abrir, fechar ou pausar |

Campos editáveis:

- Nome;
- Logo;
- Banner desktop;
- Banner mobile;
- Telefone;
- WhatsApp;
- Endereço;
- Horários;
- Taxa de entrega;
- Pedido mínimo;
- Tempo estimado;
- Entrega ativa;
- Retirada ativa.

Exemplo de pausa:

```json
{
	"status": "PAUSED",
	"pauseReason": "Alta demanda",
	"estimatedReopeningAt": "2026-07-24T21:30:00-03:00"
}
```

---

## 5. Modelo de produto

```json
{
	"name": "Bacon Express",
	"slug": "bacon-express",
	"shortDescription": "Pizza com bacon, cebola e azeitonas.",
	"description": "Descrição completa.",
	"categoryId": "category-id",
	"basePriceInCents": 4990,
	"compareAtPriceInCents": null,
	"featured": true,
	"promotion": false,
	"available": true,
	"active": true,
	"preparationTimeMinutes": 35,
	"sortOrder": 1,
	"tags": ["bacon", "cebola", "azeitona"],
	"images": [],
	"variants": [],
	"optionGroups": []
}
```

---

## 6. Variantes

As variantes representam principalmente os tamanhos.

```json
{
	"id": "large",
	"name": "Grande",
	"description": "8 fatias",
	"priceInCents": 4990,
	"slices": 8,
	"available": true,
	"sortOrder": 1
}
```

Exemplo:

```json
{
	"variants": [
		{
			"id": "medium",
			"name": "Média",
			"description": "6 fatias",
			"priceInCents": 4290,
			"slices": 6,
			"available": true,
			"sortOrder": 1
		},
		{
			"id": "large",
			"name": "Grande",
			"description": "8 fatias",
			"priceInCents": 4990,
			"slices": 8,
			"available": true,
			"sortOrder": 2
		}
	]
}
```

---

## 7. Grupos de opções

Os grupos representam bordas, adicionais e outras escolhas.

Tipos:

```text
SINGLE
MULTIPLE
```

Exemplo de borda:

```json
{
	"id": "border",
	"name": "Escolha a borda",
	"type": "SINGLE",
	"required": true,
	"minimumSelections": 1,
	"maximumSelections": 1,
	"sortOrder": 1,
	"options": [
		{
			"id": "traditional",
			"name": "Tradicional",
			"additionalPriceInCents": 0,
			"available": true,
			"sortOrder": 1
		},
		{
			"id": "cheddar",
			"name": "Recheada com cheddar",
			"additionalPriceInCents": 900,
			"available": true,
			"sortOrder": 2
		}
	]
}
```

Para economizar tempo, variantes e grupos podem ser criados ou atualizados junto com o produto.

---

## 8. Banco de dados

Entidades mínimas:

```text
admins
stores
categories
products
product_images
product_variants
product_option_groups
product_options
refresh_tokens
admin_audit_logs
```

Campos padrões, quando aplicável:

```text
id
created_at
updated_at
deleted_at
```

Registrar em `admin_audit_logs`:

- Produto criado;
- Produto atualizado;
- Produto excluído;
- Disponibilidade alterada;
- Categoria criada ou alterada;
- Loja aberta, fechada ou pausada.

---

## 9. Validações obrigatórias

- Nome obrigatório;
- Slug único;
- Categoria válida;
- Preços inteiros em centavos;
- Preços não negativos;
- Preço promocional menor que o preço normal;
- `minimumSelections` menor ou igual a `maximumSelections`;
- Grupo obrigatório com mínimo maior que zero;
- Produto com pelo menos uma imagem;
- Produto com variantes deve ter ao menos uma variante disponível;
- Categoria inativa não aparece no cardápio;
- Produto inativo não aparece no cardápio;
- Produto indisponível pode aparecer, mas não pode ser adicionado;
- Não permitir excluir categoria com produtos ativos sem aviso;
- Opções indisponíveis não podem ser selecionadas.

---

## 10. Painel administrativo mínimo

### Login

- E-mail;
- Senha;
- Mensagens de erro.

### Página inicial

- Status da loja;
- Quantidade de produtos;
- Quantidade de categorias;
- Produtos indisponíveis;
- Ações rápidas.

Não precisa ter gráficos.

### Produtos

- Listagem;
- Pesquisa;
- Filtro por categoria;
- Filtro por disponibilidade;
- Criar;
- Editar;
- Duplicar;
- Ativar;
- Desativar;
- Marcar indisponível;
- Excluir.

### Formulário de produto

- Nome;
- Descrição;
- Categoria;
- Imagens;
- Preço;
- Preço promocional;
- Tamanhos;
- Bordas;
- Adicionais;
- Destaque;
- Promoção;
- Disponibilidade;
- Tempo de preparo;
- Tags.

### Categorias

- Criar;
- Editar;
- Ativar;
- Desativar;
- Reordenar;
- Excluir.

### Configurações

- Dados da loja;
- Horários;
- Frete;
- Pedido mínimo;
- Tempo estimado;
- Logo;
- Banners;
- Loja aberta, fechada ou pausada.

---

## 11. Critérios de aceite

O backend estará pronto quando:

- O front deixar de usar mocks;
- A home carregar dados reais;
- As categorias vierem da API;
- A página de categoria carregar produtos reais;
- A pesquisa usar dados reais;
- O modal receber variantes e adicionais da API;
- O administrador conseguir fazer login;
- O administrador conseguir criar e editar categorias;
- O administrador conseguir cadastrar pizzas;
- O administrador conseguir cadastrar tamanhos;
- O administrador conseguir cadastrar bordas e adicionais;
- O administrador conseguir alterar preços;
- O administrador conseguir marcar produtos indisponíveis;
- O administrador conseguir atualizar logo e banners;
- O administrador conseguir abrir, fechar e pausar a loja;
- As imagens forem salvas no Cloudinary;
- Os dados continuarem disponíveis após reiniciar o servidor;
- A API possuir validação e documentação.

---

## 12. Resumo dos endpoints

```text
POST   /api/v1/auth/admin/login
POST   /api/v1/auth/admin/refresh
POST   /api/v1/auth/admin/logout
GET    /api/v1/auth/admin/me

GET    /api/v1/store
GET    /api/v1/store/status
GET    /api/v1/catalog/home

GET    /api/v1/categories
GET    /api/v1/categories/:slug

GET    /api/v1/products
GET    /api/v1/products/:slug

GET    /api/v1/admin/categories
POST   /api/v1/admin/categories
GET    /api/v1/admin/categories/:id
PATCH  /api/v1/admin/categories/:id
PATCH  /api/v1/admin/categories/:id/status
PATCH  /api/v1/admin/categories/reorder
DELETE /api/v1/admin/categories/:id

GET    /api/v1/admin/products
POST   /api/v1/admin/products
GET    /api/v1/admin/products/:id
PATCH  /api/v1/admin/products/:id
PATCH  /api/v1/admin/products/:id/status
PATCH  /api/v1/admin/products/:id/availability
PATCH  /api/v1/admin/products/:id/visibility
POST   /api/v1/admin/products/:id/duplicate
DELETE /api/v1/admin/products/:id

POST   /api/v1/admin/uploads/images
DELETE /api/v1/admin/uploads/images

GET    /api/v1/admin/store
PATCH  /api/v1/admin/store
PATCH  /api/v1/admin/store/status
```
