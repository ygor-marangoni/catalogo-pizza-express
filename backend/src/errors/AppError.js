class AppError extends Error {
	constructor(message, code, statusCode = 500, field = null) {
		super(message);
		this.code = code;
		this.statusCode = statusCode;
		this.field = field;
		this.name = "AppError";
	}
}

module.exports = AppError;