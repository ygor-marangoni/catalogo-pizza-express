import { ErrorCode } from "../entities/enums";

export function parseResourceId(value: string): number {
	const id = Number(value);
	if (!Number.isInteger(id) || id <= 0)
		throw Object.assign(new Error("Identificador inválido"), { code: ErrorCode.INVALID_ID, statusCode: 400 });
	return id;
}
