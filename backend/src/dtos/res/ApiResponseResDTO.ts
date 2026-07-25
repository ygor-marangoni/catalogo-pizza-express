export interface ApiResponseResDTO<T> {
	success: boolean;
	data: T | null;
	error: {
		code: string;
		message: string;
		field: string | null;
	} | null;
}
