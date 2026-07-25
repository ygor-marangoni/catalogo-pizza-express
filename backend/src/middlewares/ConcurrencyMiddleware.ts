let activeRequests = 0;
const waitingRequests: Array<() => void> = [];

// Limita requisições simultâneas em toda a instância da API.
export function concurrencyLimit(limit = 100, maxWaiting = 200) {
	return (req, res, next) => {
		if (activeRequests >= limit && waitingRequests.length >= maxWaiting)
			return res.status(503).json({
				success: false,
				data: null,
				error: {
					code: "CONCURRENCY_LIMIT",
					message: "Muitas requisições simultâneas",
					field: null,
				},
			});
		let released = false;
		const release = () => {
			if (released) return;
			released = true;
			if (activeRequests > 0) activeRequests -= 1;
			const nextRequest = waitingRequests.shift();
			if (nextRequest) nextRequest();
		};
		const run = () => {
			activeRequests += 1;
			res.once("finish", release);
			res.once("close", release);
			next();
		};
		if (activeRequests < limit) run();
		else waitingRequests.push(run);
	};
}
