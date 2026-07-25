const swaggerJsdoc = require("swagger-jsdoc");

const options = {
	definition: {
		openapi: "3.0.3",
		info: {
			title: "Pizza Express API",
			version: "1.0.0",
			description:
				"API REST para consulta do cardápio e gerenciamento do painel administrativo da Pizza Express.\n\n[Acessar JSON puro do OpenAPI](/api-docs/openapi.json)",
			contact: { name: "Pizza Express Team" },
		},
		servers: [
			{
				url: "http://localhost:{port}",
				description: "Servidor local",
				variables: { port: { default: "3000" } },
			},
		],
		tags: [
			{ name: "Health", description: "Verificação do estado da API" },
			{ name: "Autenticação", description: "Sessão do administrador" },
			{ name: "Produtos", description: "Gerenciamento de produtos" },
			{ name: "Categorias", description: "Gerenciamento de categorias" },
			{ name: "Loja", description: "Informações e status da loja" },
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
					description: "Token JWT enviado no header Authorization.",
				},
			},
			schemas: {
				RespostaApi: {
					type: "object",
					properties: {
						success: { type: "boolean", example: true },
						data: { nullable: true },
						error: { nullable: true },
					},
				},
				ErroApi: {
					type: "object",
					properties: {
						success: { type: "boolean", example: false },
						data: { type: "object", nullable: true, example: null },
						error: { $ref: "#/components/schemas/Erro" },
					},
				},
				Erro: {
					type: "object",
					properties: {
						code: { type: "string", example: "VALIDATION_ERROR" },
						message: { type: "string", example: "Dados inválidos" },
						field: {
							type: "string",
							nullable: true,
							example: "name",
						},
					},
				},
				Categoria: {
					type: "object",
					properties: {
						id: { type: "integer", example: 1 },
						name: {
							type: "string",
							example: "Pizzas tradicionais",
						},
						description: { type: "string", nullable: true },
						active: { type: "boolean", example: true },
					},
				},
				EntradaCategoria: {
					type: "object",
					required: ["name"],
					properties: {
						name: {
							type: "string",
							minLength: 1,
							example: "Pizzas tradicionais",
						},
						description: {
							type: "string",
							example: "Pizzas clássicas da casa",
						},
					},
				},
				Produto: {
					type: "object",
					properties: {
						id: { type: "integer", example: 1 },
						name: { type: "string", example: "Calabresa" },
						description: {
							type: "string",
							example: "Calabresa, cebola e queijo",
						},
						category_id: { type: "integer", example: 1 },
						base_price: {
							type: "number",
							format: "int32",
							description: "Valor em centavos.",
							example: 3990,
						},
						active: { type: "boolean", example: true },
					},
				},
				EntradaProduto: {
					type: "object",
					required: ["name", "category_id", "base_price"],
					properties: {
						name: {
							type: "string",
							minLength: 1,
							example: "Calabresa",
						},
						description: {
							type: "string",
							example: "Calabresa, cebola e queijo",
						},
						category_id: { type: "integer", example: 1 },
						base_price: {
							type: "number",
							minimum: 0,
							description: "Valor em centavos.",
							example: 3990,
						},
					},
				},
				Loja: {
					type: "object",
					properties: {
						name: { type: "string", example: "Pizza Express" },
						phone: { type: "string", example: "(11) 99999-9999" },
						address: {
							type: "string",
							example: "Rua das Pizzas, 100",
						},
						is_open: { type: "boolean", example: true },
					},
				},
				EntradaStatusLoja: {
					type: "object",
					required: ["is_open"],
					properties: { is_open: { type: "boolean", example: true } },
				},
				EntradaLogin: {
					type: "object",
					required: ["email", "password"],
					properties: {
						email: {
							type: "string",
							format: "email",
							example: "admin@pizzaexpress.com",
						},
						password: {
							type: "string",
							format: "password",
							example: "senha-segura",
						},
					},
				},
				Administrador: {
					type: "object",
					properties: {
						id: { type: "integer", example: 1 },
						name: { type: "string", example: "Administrador" },
						email: {
							type: "string",
							format: "email",
							example: "admin@pizzaexpress.com",
						},
					},
				},
			},
			parameters: {
				Id: {
					name: "id",
					in: "path",
					required: true,
					description: "Identificador do recurso",
					schema: { type: "integer", minimum: 1 },
					example: 1,
				},
			},
			responses: {
				BadRequest: {
					description: "Dados inválidos",
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/ErroApi" },
						},
					},
				},
				Unauthorized: {
					description: "Token ausente ou inválido",
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/ErroApi" },
						},
					},
				},
				NotFound: {
					description: "Recurso não encontrado",
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/ErroApi" },
						},
					},
				},
			},
		},
		paths: {
			"/api/v1/auth/user/register": {
				post: {
					tags: ["Autenticação"],
					summary: "Cadastra um usuário comum",
					responses: {
						201: { description: "Usuário cadastrado" },
						400: { $ref: "#/components/responses/BadRequest" },
					},
				},
			},
			"/api/v1/auth/login": {
				post: {
					tags: ["Autenticação"],
					summary: "Autentica um usuário comum",
					responses: {
						200: { description: "Usuário autenticado" },
						401: { $ref: "#/components/responses/Unauthorized" },
					},
				},
			},
			"/api/v1/users/me": {
				get: {
					tags: ["Usuários"],
					summary: "Consulta o próprio perfil",
					security: [{ bearerAuth: [] }],
					responses: {
						200: { description: "Perfil do usuário" },
						403: { description: "Perfil inválido" },
					},
				},
				put: {
					tags: ["Usuários"],
					summary: "Atualiza o próprio perfil",
					security: [{ bearerAuth: [] }],
					responses: {
						200: { description: "Perfil atualizado" },
						403: { description: "Perfil inválido" },
					},
				},
			},
			"/api/v1/users/me/favorites": {
				get: {
					tags: ["Usuários"],
					summary: "Lista os próprios favoritos",
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: "Favoritos do usuário" } },
				},
				post: {
					tags: ["Usuários"],
					summary: "Adiciona um favorito",
					security: [{ bearerAuth: [] }],
					responses: { 201: { description: "Favorito criado" } },
				},
			},
			"/api/v1/users/me/orders": {
				get: {
					tags: ["Usuários"],
					summary: "Lista os próprios pedidos",
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: "Pedidos do usuário" } },
				},
				post: {
					tags: ["Usuários"],
					summary: "Cria um pedido para o usuário autenticado",
					security: [{ bearerAuth: [] }],
					responses: { 201: { description: "Pedido criado" } },
				},
			},
			"/api/v1/admin/orders": {
				get: {
					tags: ["Usuários"],
					summary: "Lista todos os pedidos para o administrador",
					security: [{ bearerAuth: [] }],
					responses: {
						200: { description: "Pedidos listados" },
						403: { description: "Acesso restrito ao administrador" },
					},
				},
			},
			"/api/v1/admin/orders/{id}/status": {
				patch: {
					tags: ["Usuários"],
					summary: "Atualiza o status de um pedido",
					security: [{ bearerAuth: [] }],
					responses: {
						200: { description: "Status atualizado" },
						403: { description: "Acesso restrito ao administrador" },
					},
				},
			},
			"/": {
				get: {
					tags: ["Health"],
					summary: "Informações da API",
					responses: { 200: { description: "API disponível" } },
				},
			},
			"/health": {
				get: {
					tags: ["Health"],
					summary: "Verifica a saúde da API",
					responses: { 200: { description: "API saudável" } },
				},
			},
			"/api/v1/auth/admin/login": {
				post: {
					tags: ["Autenticação"],
					summary: "Autentica um administrador",
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/EntradaLogin",
								},
							},
						},
					},
					responses: {
						200: {
							description: "Administrador autenticado",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/RespostaApi",
									},
								},
							},
						},
						400: { $ref: "#/components/responses/BadRequest" },
						401: { $ref: "#/components/responses/Unauthorized" },
					},
				},
			},
			"/api/v1/auth/admin/refresh": {
				post: {
					tags: ["Autenticação"],
					summary: "Renova a sessão do administrador",
					security: [{ bearerAuth: [] }],
					responses: {
						200: { description: "Sessão renovada" },
						401: { $ref: "#/components/responses/Unauthorized" },
					},
				},
			},
			"/api/v1/products/search": {
				get: {
					tags: ["Produtos"],
					summary: "Busca produtos no Elasticsearch",
					parameters: [
						{
							name: "q",
							in: "query",
							required: false,
							description: "Texto buscado no nome e na descrição",
							schema: { type: "string" },
							example: "calabresa",
						},
						{
							name: "category_id",
							in: "query",
							required: false,
							description: "Filtra pelo identificador da categoria",
							schema: { type: "integer", minimum: 1 },
							example: 1,
						},
						{
							name: "available",
							in: "query",
							required: false,
							description: "Filtra produtos disponíveis",
							schema: { type: "boolean" },
							example: true,
						},
					],
					responses: {
						200: {
							description: "Produtos encontrados",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/RespostaApi",
									},
								},
							},
						},
						503: {
							description: "Serviço de busca indisponível",
							content: {
								"application/json": {
									schema: {
										$ref: "#/components/schemas/ErroApi",
									},
								},
							},
						},
					},
				},
			},
			"/api/v1/products": {
				get: {
					tags: ["Produtos"],
					summary: "Lista produtos",
					parameters: [
						{
							name: "category_id",
							in: "query",
							schema: { type: "integer" },
						},
						{
							name: "active",
							in: "query",
							schema: { type: "boolean" },
						},
					],
					responses: { 200: { description: "Lista de produtos" } },
				},
				post: {
					tags: ["Produtos"],
					summary: "Cria um produto",
					security: [{ bearerAuth: [] }],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/EntradaProduto",
								},
							},
						},
					},
					responses: {
						201: { description: "Produto criado" },
						400: { $ref: "#/components/responses/BadRequest" },
						401: { $ref: "#/components/responses/Unauthorized" },
					},
				},
			},
			"/api/v1/products/{id}": {
				parameters: [{ $ref: "#/components/parameters/Id" }],
				get: {
					tags: ["Produtos"],
					summary: "Busca produto por ID",
					responses: {
						200: { description: "Produto encontrado" },
						404: { $ref: "#/components/responses/NotFound" },
					},
				},
				put: {
					tags: ["Produtos"],
					summary: "Atualiza um produto",
					security: [{ bearerAuth: [] }],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/EntradaProduto",
								},
							},
						},
					},
					responses: {
						200: { description: "Produto atualizado" },
						401: { $ref: "#/components/responses/Unauthorized" },
						404: { $ref: "#/components/responses/NotFound" },
					},
				},
				delete: {
					tags: ["Produtos"],
					summary: "Remove logicamente um produto",
					security: [{ bearerAuth: [] }],
					responses: {
						200: { description: "Produto removido" },
						401: { $ref: "#/components/responses/Unauthorized" },
						404: { $ref: "#/components/responses/NotFound" },
					},
				},
			},
			"/api/v1/categories": {
				get: {
					tags: ["Categorias"],
					summary: "Lista categorias",
					responses: { 200: { description: "Lista de categorias" } },
				},
				post: {
					tags: ["Categorias"],
					summary: "Cria uma categoria",
					security: [{ bearerAuth: [] }],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/EntradaCategoria",
								},
							},
						},
					},
					responses: {
						201: { description: "Categoria criada" },
						400: { $ref: "#/components/responses/BadRequest" },
						401: { $ref: "#/components/responses/Unauthorized" },
					},
				},
			},
			"/api/v1/categories/{id}": {
				parameters: [{ $ref: "#/components/parameters/Id" }],
				get: {
					tags: ["Categorias"],
					summary: "Busca categoria por ID",
					responses: {
						200: { description: "Categoria encontrada" },
						404: { $ref: "#/components/responses/NotFound" },
					},
				},
				put: {
					tags: ["Categorias"],
					summary: "Atualiza uma categoria",
					security: [{ bearerAuth: [] }],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/EntradaCategoria",
								},
							},
						},
					},
					responses: {
						200: { description: "Categoria atualizada" },
						401: { $ref: "#/components/responses/Unauthorized" },
						404: { $ref: "#/components/responses/NotFound" },
					},
				},
				delete: {
					tags: ["Categorias"],
					summary: "Remove logicamente uma categoria",
					security: [{ bearerAuth: [] }],
					responses: {
						200: { description: "Categoria removida" },
						401: { $ref: "#/components/responses/Unauthorized" },
						404: { $ref: "#/components/responses/NotFound" },
					},
				},
			},
			"/api/v1/store": {
				get: {
					tags: ["Loja"],
					summary: "Consulta informações da loja",
					responses: { 200: { description: "Informações da loja" } },
				},
				put: {
					tags: ["Loja"],
					summary: "Atualiza informações da loja",
					security: [{ bearerAuth: [] }],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: { $ref: "#/components/schemas/Loja" },
							},
						},
					},
					responses: {
						200: { description: "Loja atualizada" },
						401: { $ref: "#/components/responses/Unauthorized" },
					},
				},
			},
			"/api/v1/store/status": {
				get: {
					tags: ["Loja"],
					summary: "Consulta se a loja está aberta",
					responses: { 200: { description: "Status da loja" } },
				},
				put: {
					tags: ["Loja"],
					summary: "Atualiza o status da loja",
					security: [{ bearerAuth: [] }],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/EntradaStatusLoja",
								},
							},
						},
					},
					responses: {
						200: { description: "Status atualizado" },
						400: { $ref: "#/components/responses/BadRequest" },
						401: { $ref: "#/components/responses/Unauthorized" },
					},
				},
			},
		},
	},
};

const swaggerDocument = swaggerJsdoc({
	definition: options.definition,
	apis: [],
});
delete swaggerDocument.paths?.["/api/v1/auth/admin/login"];
delete swaggerDocument.paths?.["/api/v1/auth/admin/refresh"];
module.exports = swaggerDocument;
