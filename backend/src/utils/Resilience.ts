// Controla o número de operações simultâneas e mantém uma fila local.
export class Semaphore {
	private active = 0;
	private readonly waiting: Array<() => void> = [];

	constructor(private readonly limit: number) {}

	async run<T>(task: () => Promise<T>): Promise<T> {
		await this.acquire();
		try {
			return await task();
		} finally {
			this.release();
		}
	}

	private acquire(): Promise<void> {
		if (this.active < this.limit) {
			this.active += 1;
			return Promise.resolve();
		}
		return new Promise((resolve) =>
			this.waiting.push(() => {
				this.active += 1;
				resolve();
			}),
		);
	}
	private release(): void {
		const next = this.waiting.shift();
		if (next) next();
		else this.active -= 1;
	}
}

export async function withTimeout<T>(
	task: Promise<T>,
	timeoutMs: number,
	message = "Operação excedeu o tempo limite",
): Promise<T> {
	let timer: ReturnType<typeof setTimeout>;
	const timeout = new Promise<never>((_, reject) => {
		timer = setTimeout(
			() =>
				reject(
					Object.assign(new Error(message), {
						code: "TIMEOUT",
						statusCode: 504,
					}),
				),
			timeoutMs,
		);
	});
	try {
		return await Promise.race([task, timeout]);
	} finally {
		clearTimeout(timer!);
	}
}

// Repete falhas transitórias usando backoff exponencial.
export async function withRetry<T>(task: () => Promise<T>, attempts = 3, initialDelayMs = 100): Promise<T> {
	let lastError: unknown;
	for (let attempt = 0; attempt < attempts; attempt += 1) {
		try {
			return await task();
		} catch (error) {
			lastError = error;
			if (attempt === attempts - 1) break;
			await new Promise((resolve) => setTimeout(resolve, initialDelayMs * 2 ** attempt));
		}
	}
	throw lastError;
}

// Bloqueia chamadas após falhas consecutivas de uma integração.
export class CircuitBreaker {
	private failures = 0;
	private openedAt = 0;

	constructor(
		private readonly failureThreshold = 5,
		private readonly resetTimeoutMs = 30000,
	) {}

	async execute<T>(task: () => Promise<T>): Promise<T> {
		if (this.isOpen())
			throw Object.assign(new Error("Serviço temporariamente indisponível"), {
				code: "CIRCUIT_OPEN",
				statusCode: 503,
			});
		try {
			const result = await task();
			this.failures = 0;
			return result;
		} catch (error) {
			this.failures += 1;
			if (this.failures >= this.failureThreshold) this.openedAt = Date.now();
			throw error;
		}
	}

	private isOpen(): boolean {
		return this.openedAt > 0 && Date.now() - this.openedAt < this.resetTimeoutMs;
	}
}
