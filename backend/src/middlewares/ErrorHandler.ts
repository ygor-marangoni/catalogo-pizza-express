import { ErrorCode } from "../entities/enums";
import { getErrorMessage } from "../exceptions/ErrorMessages";

const codes = new Set(Object.values(ErrorCode));
const statusByCode: Record<string, number> = {
	[ErrorCode.UNAUTHORIZED]: 401,
	[ErrorCode.INVALID_TOKEN]: 401,
	[ErrorCode.INVALID_CREDENTIALS]: 401,
	[ErrorCode.FORBIDDEN]: 403,
	[ErrorCode.INVALID_INPUT]: 400,
	[ErrorCode.INVALID_IMAGE]: 400,
	[ErrorCode.VALIDATION_ERROR]: 400,
	[ErrorCode.INVALID_ID]: 400,
	[ErrorCode.PRODUCT_NOT_FOUND]: 404,
	[ErrorCode.CATEGORY_NOT_FOUND]: 404,
	[ErrorCode.ADDITIONAL_NOT_FOUND]: 404,
	[ErrorCode.EDGE_NOT_FOUND]: 404,
	[ErrorCode.SIZE_NOT_FOUND]: 404,
	[ErrorCode.STORE_INFO_NOT_FOUND]: 404,
	[ErrorCode.ADMIN_NOT_FOUND]: 404,
	[ErrorCode.USER_NOT_FOUND]: 404,
	[ErrorCode.ORDER_NOT_FOUND]: 404,
	[ErrorCode.FAVORITE_NOT_FOUND]: 404,
	[ErrorCode.RESOURCE_NOT_FOUND]: 404,
	[ErrorCode.EMAIL_ALREADY_EXISTS]: 409,
	[ErrorCode.FAVORITE_ALREADY_EXISTS]: 409,
	[ErrorCode.DUPLICATE_RESOURCE]: 409,
	[ErrorCode.PRODUCT_UNAVAILABLE]: 409,
	[ErrorCode.PRODUCT_SEARCH_UNAVAILABLE]: 503,
	[ErrorCode.DATABASE_ERROR]: 500,
};

function isTechnicalMessage(message: string): boolean {
	return /typeorm|postgres|database|sql|query|constraint|duplicate key|connection refused|cannot set property|null value encountered|not supported/i.test(message);
}

function resolveCode(error: any): string {
	const errorMessage = String(error?.message || "");
	if (codes.has(error?.code)) return error.code;
	if (codes.has(error?.message)) return error.message;
	for (const code of codes) if (errorMessage.includes(code)) return code;
	if (error?.code === "23505") return ErrorCode.DUPLICATE_RESOURCE;
	if (error?.code === "LIMIT_FILE_SIZE" || error?.name === "MulterError") return ErrorCode.INVALID_IMAGE;
	if (error?.code?.startsWith?.("23")) return ErrorCode.DATABASE_ERROR;
	if (error?.name === "ZodError") return ErrorCode.VALIDATION_ERROR;
	if (/registro duplicado|duplicate key/i.test(errorMessage)) return ErrorCode.DUPLICATE_RESOURCE;
	if (/registro .*encontrado|resource_not_found/i.test(errorMessage)) return ErrorCode.RESOURCE_NOT_FOUND;
	return ErrorCode.INTERNAL_ERROR;
}

class ErrorHandler {
	static handle(error: any, req, res, next) {
		const code = resolveCode(error);
		const statusCode = error?.statusCode || statusByCode[code] || 500;
		const message = !isTechnicalMessage(error?.message || "") && code === ErrorCode.INTERNAL_ERROR
			? getErrorMessage(code)
			: getErrorMessage(code, error?.message);

		console.error(`[${new Date().toISOString()}] ${code}: ${message}`);
		return res.status(statusCode).json({
			success: false,
			data: null,
			error: { code, message, field: error?.field || null },
		});
	}
}

module.exports = ErrorHandler;
