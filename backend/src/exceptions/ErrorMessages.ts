import { ErrorCode } from "../entities/enums";

export const errorMessages: Record<string, string> = {
	[ErrorCode.UNAUTHORIZED]: "É necessário autenticar-se para acessar este recurso",
	[ErrorCode.INVALID_TOKEN]: "O token de autenticação é inválido ou expirou",
	[ErrorCode.INTERNAL_ERROR]: "Ocorreu um erro interno no servidor",
	[ErrorCode.INVALID_INPUT]: "Os dados informados são inválidos",
	[ErrorCode.VALIDATION_ERROR]: "Existem campos inválidos na requisição",
	[ErrorCode.INVALID_ID]: "O identificador informado é inválido",
	[ErrorCode.PRODUCT_NOT_FOUND]: "Produto não encontrado",
	[ErrorCode.CATEGORY_NOT_FOUND]: "Categoria não encontrada",
	[ErrorCode.ADDITIONAL_NOT_FOUND]: "Adicional não encontrado",
	[ErrorCode.EDGE_NOT_FOUND]: "Borda não encontrada",
	[ErrorCode.SIZE_NOT_FOUND]: "Tamanho não encontrado",
	[ErrorCode.STORE_INFO_NOT_FOUND]: "Informações da loja não encontradas",
	[ErrorCode.ADMIN_NOT_FOUND]: "Administrador não encontrado",
	[ErrorCode.USER_NOT_FOUND]: "Cliente não encontrado",
	[ErrorCode.ORDER_NOT_FOUND]: "Pedido não encontrado",
	[ErrorCode.INVALID_ORDER_TRANSITION]: "Esta mudança de status não é permitida para o pedido",
	[ErrorCode.FAVORITE_NOT_FOUND]: "Favorito não encontrado",
	[ErrorCode.INVALID_CREDENTIALS]: "E-mail ou senha inválidos",
	[ErrorCode.EMAIL_ALREADY_EXISTS]: "Já existe uma conta cadastrada com este e-mail",
	[ErrorCode.FAVORITE_ALREADY_EXISTS]: "Este produto já está nos favoritos",
	[ErrorCode.DUPLICATE_RESOURCE]: "Já existe um registro com os mesmos dados únicos",
	[ErrorCode.PRODUCT_UNAVAILABLE]: "O produto selecionado não está disponível",
	[ErrorCode.FORBIDDEN]: "Você não tem permissão para realizar esta operação",
	[ErrorCode.PRODUCT_SEARCH_UNAVAILABLE]: "O serviço de busca está temporariamente indisponível",
	[ErrorCode.INVALID_IMAGE]: "A imagem informada é inválida",
	[ErrorCode.DATABASE_ERROR]: "Não foi possível concluir a operação no banco de dados",
	[ErrorCode.RESOURCE_NOT_FOUND]: "Registro não encontrado",
};

export function getErrorMessage(code: string, fallback?: string): string {
	return errorMessages[code] ?? fallback ?? errorMessages[ErrorCode.INTERNAL_ERROR];
}
