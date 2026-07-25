# Pizza Express - Backend

API REST em Node.js + Express para gerenciar o cardápio e painel administrativo da Pizza Express.

## 📋 Estrutura do Projeto

```
src/
├── config/          # Configurações (DB, ambiente)
├── controllers/     # Controladores HTTP
├── middlewares/     # Middlewares customizados
├── models/          # Modelos de dados
├── routes/          # Definição de rotas
├── services/        # Lógica de negócio
├── utils/           # Funções utilitárias
├── errors/          # Erros customizados
└── logs/            # Arquivos de log
```

## 🚀 Instalação

1. **Clonar o repositório**

```bash
git clone <url-do-repositorio>
cd backend
```

2. **Instalar dependências**

```bash
npm install
```

3. **Configurar variáveis de ambiente**

```bash
cp .env.example .env
# Editar .env com suas configurações
```

4. **Executar migrações do banco**

```bash
npm run migrate
```

5. **Executar seeds**

```bash
npm run seed
```

## 📦 Dependências

- **Express 5.2.1** - Framework web
- **dotenv** - Gerenciamento de variáveis de ambiente
- **bcrypt** - Hash de senhas
- **jsonwebtoken** - Tokens JWT
- **pg** - Driver PostgreSQL
- **knex** - Query builder (para migrações)
- **cloudinary** - Gerenciamento de imagens

## 🔧 Scripts

```bash
# Iniciar servidor em desenvolvimento
npm run dev

# Iniciar servidor em produção
npm start

# Executar migrações
npm run migrate

# Executar seeds
npm run seed

# Rodar testes
npm test
```

## 🔐 Autenticação

- JWT (JSON Web Tokens)
- Refresh token em cookie `httpOnly`
- Senhas com hash bcrypt

## 📝 API Endpoints

### Autenticação

- `POST /api/v1/auth/admin/login` - Login
- `POST /api/v1/auth/admin/refresh` - Renovar sessão
- `POST /api/v1/auth/admin/logout` - Logout

### Produtos

- `GET /api/v1/products` - Listar produtos
- `GET /api/v1/products/:id` - Buscar produto
- `POST /api/v1/products` - Criar produto
- `PUT /api/v1/products/:id` - Atualizar produto
- `DELETE /api/v1/products/:id` - Deletar produto

### Categorias

- `GET /api/v1/categories` - Listar categorias
- `GET /api/v1/categories/:id` - Buscar categoria
- `POST /api/v1/categories` - Criar categoria
- `PUT /api/v1/categories/:id` - Atualizar categoria
- `DELETE /api/v1/categories/:id` - Deletar categoria

### Loja

- `GET /api/v1/store` - Informações da loja
- `PUT /api/v1/store` - Atualizar informações
- `GET /api/v1/store/status` - Status da loja
- `PUT /api/v1/store/status` - Atualizar status

## 📄 Resposta Padrão

### Sucesso

```json
{
	"success": true,
	"data": {},
	"error": null
}
```

### Erro

```json
{
	"success": false,
	"data": null,
	"error": {
		"code": "ERROR_CODE",
		"message": "Descrição do erro",
		"field": null
	}
}
```

## 🔄 Exclusão Lógica

Todos os dados utilizam exclusão lógica. Não são removidos do banco, apenas marcados como deletados.

## 💰 Valores Monetários

Todos os valores são armazenados em **centavos** para evitar problemas com ponto flutuante.

## 📚 Documentação

A documentação da API é gerada automaticamente com Swagger/OpenAPI.
Acesse: `http://localhost:3000/api-docs`

## 🐛 Troubleshooting

### Conexão com banco de dados

- Verificar se PostgreSQL está rodando
- Validar variáveis de ambiente em `.env`
- Confirmar permissões do usuário do banco

### JWT Secret não configurado

- Definir `JWT_SECRET` no `.env`
- Usar valor seguro em produção

## 👨‍💻 Autor

Pizza Express Team

## 📄 Licença

ISC
