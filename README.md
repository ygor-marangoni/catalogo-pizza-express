# Catálogo Pizza Express

<div align="center">

<img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16">
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js e Express">
<img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
<img src="https://img.shields.io/badge/Cloudflare-Deploy-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare">

<br><br>

Catálogo digital e painel administrativo da Pizza Express, desenvolvido com Next.js, React, Node.js e Express.

</div>

---

## Visão geral

O Catálogo Pizza Express permite consultar categorias, produtos, detalhes, adicionais e promoções, além de montar o carrinho de compras.

O frontend utiliza Next.js, React, CSS Modules e integração com uma API REST versionada em `/api/v1`.

O backend será responsável pelo catálogo público, painel administrativo, autenticação do administrador, persistência em PostgreSQL e gerenciamento de imagens no Cloudinary.

<div align="center">

<!-- Adicionar aqui a imagem de visão geral / arquitetura do projeto -->

</div>

<table>
<tr>
<td width="33%" valign="top">

### Frontend

* Next.js
* React
* JavaScript
* CSS Modules
* Vitest
* Playwright

</td>
<td width="33%" valign="top">

### Backend

* Node.js
* Express
* PostgreSQL
* JWT
* bcrypt
* Swagger / OpenAPI
* Cloudinary

</td>
<td width="33%" valign="top">

### Infraestrutura

* API versionada
* Refresh token em cookie `httpOnly`
* CORS
* Rate limit no login
* Tratamento centralizado de erros
* Logs administrativos

</td>
</tr>
</table>

---

## Funcionalidades

<table>
<tr>
<td width="33%" valign="top">

### Catálogo público

* Dados públicos da loja
* Status da loja
* Consulta de categorias ativas
* Listagem e busca de produtos
* Filtros por categoria, destaque e promoção

</td>
<td width="33%" valign="top">

### Painel administrativo

* Login administrativo
* CRUD de categorias
* CRUD de produtos
* Cadastro de tamanhos
* Cadastro de bordas e adicionais
* Upload de imagens
* Controle de disponibilidade e visibilidade

</td>
<td width="33%" valign="top">

### Loja e catálogo

* Configurações da loja
* Horários de funcionamento
* Taxa de entrega
* Pedido mínimo
* Tempo estimado
* Abertura, fechamento e pausa da loja

</td>
</tr>
</table>

---

## Autenticação

A autenticação administrativa utiliza JWT, refresh token em cookie `httpOnly` e senhas protegidas com bcrypt.

O fluxo contempla login, renovação de sessão, logout e consulta do administrador autenticado.

<div align="center">

<!-- Adicionar aqui um diagrama do fluxo de autenticação -->

</div>

---

## Arquitetura

O projeto é dividido entre o frontend público e o backend da API REST. O frontend é organizado por componentes, funcionalidades, contextos, hooks, fixtures e repositórios. O backend seguirá uma organização por rotas, controllers, services, repositories, validações e middlewares.

<div align="center">

<!-- Adicionar aqui um diagrama da arquitetura em camadas -->

</div>

<table>
<tr>
<td width="50%" valign="top">

### Padrões utilizados

* Component-Based Architecture
* Repository Pattern
* Context API
* Feature Modules
* Custom Hooks
* API versionada
* Service Layer

</td>
<td width="50%" valign="top">

### Componentes de suporte

* Carrinho de compras
* Modal de personalização
* Busca de produtos
* Layout responsivo
* JWT e refresh token
* Validação de dados
* Tratamento centralizado de erros

</td>
</tr>
</table>

---

## Regras de negócio

Entre as principais regras implementadas estão:

* Produtos podem possuir variantes, bordas e adicionais configuráveis
* Valores financeiros são armazenados em centavos
* Slugs de categorias e produtos devem ser únicos
* Preços não podem ser negativos
* O preço promocional deve ser menor que o preço normal
* Categorias e produtos inativos não aparecem no catálogo público
* Produtos indisponíveis podem aparecer, mas não podem ser adicionados
* A loja pode estar aberta, fechada ou pausada
* Categorias com produtos ativos não podem ser excluídas sem aviso
* O carrinho deve manter as quantidades atualizadas
* Os dados do carrinho são persistidos localmente

<div align="center">

<!-- Adicionar aqui um diagrama do fluxo de configuração do produto -->

</div>

---

## Banco de dados

O backend utilizará PostgreSQL como banco de dados relacional. O frontend mantém fixtures locais apenas durante a transição para a API.

O domínio principal é formado pelas entidades `Admin`, `Store`, `Category`, `Product`, `ProductImage`, `ProductVariant`, `ProductOptionGroup`, `ProductOption`, `RefreshToken` e `AdminAuditLog`.

<div align="center">
  <!-- Adicionar aqui a imagem da modelagem do banco de dados -->
</div>

As principais estruturas persistidas são:

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

---

## Documentação da API

A API REST será disponibilizada pelo backend em Node.js e Express, com documentação Swagger/OpenAPI.

<div align="center">
<table>
<tr>
<td align="center" width="50%">

<strong>API</strong>

<br>

<!-- Adicionar aqui a imagem da documentação da API -->

</td>
<td align="center" width="50%">

<strong>Integração</strong>

<br>

<!-- Adicionar aqui a imagem da integração com a API -->

</td>
</tr>
</table>
</div>

| Interface        | Endereço                         |
| :--------------- | :------------------------------- |
| **Frontend local** | `http://localhost:3000`         |
| **API**             | `/api/v1`                       |
| **Backend**         | `Em desenvolvimento`             |

Endpoints principais:

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
PATCH  /api/v1/admin/categories/:id
DELETE /api/v1/admin/categories/:id
GET    /api/v1/admin/products
POST   /api/v1/admin/products
PATCH  /api/v1/admin/products/:id
DELETE /api/v1/admin/products/:id
POST   /api/v1/admin/uploads/images
GET    /api/v1/admin/store
PATCH  /api/v1/admin/store
```

---

## Como executar

### Execução local

Frontend:

```bash
cd frontend
npm install
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Acesse a aplicação:

```text
http://localhost:3000
```

Backend:

```bash
cd backend
npm install
```

Configure as variáveis de ambiente a partir do arquivo `.env.example`, incluindo a conexão com PostgreSQL, as credenciais JWT e as credenciais do Cloudinary.

Execute a API:

```bash
npm run dev
```

O backend utilizará um seed com um administrador inicial e deverá disponibilizar a API em `/api/v1`.

---

## Estrutura resumida

```text
catalogo-pizza-express/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   └── repositories/
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── assets/
    ├── docs/
    ├── public/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── contexts/
    │   ├── features/
    │   ├── fixtures/
    │   ├── hooks/
    │   ├── lib/
    │   └── repositories/
    └── tests/
```

---

## Relato de bugs

Encontrou algum comportamento inesperado?

[Abra uma issue](https://github.com/ygor-marangoni/catalogo-pizza-express/issues/new) descrevendo o problema, os passos para reprodução e o resultado esperado.
