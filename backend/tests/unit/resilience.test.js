const assert = require("node:assert/strict");
const { CircuitBreaker, Semaphore, withRetry, withTimeout } = require("../../dist/src/utils/Resilience");

test("withRetry repete falhas transitórias e retorna sucesso", async () => {
	let attempts = 0;
	const result = await withRetry(
		async () => {
			attempts += 1;
			if (attempts < 3) throw new Error("temporary");
			return "ok";
		},
		3,
		1,
	);
	assert.equal(result, "ok");
	assert.equal(attempts, 3);
});

test("withTimeout interrompe operações demoradas", async () => {
	await assert.rejects(() => withTimeout(new Promise((resolve) => setTimeout(resolve, 30)), 5), { code: "TIMEOUT" });
});

test("CircuitBreaker abre após o limite de falhas", async () => {
	const breaker = new CircuitBreaker(2, 1000);
	await assert.rejects(() =>
		breaker.execute(async () => {
			throw new Error("failure");
		}),
	);
	await assert.rejects(() =>
		breaker.execute(async () => {
			throw new Error("failure");
		}),
	);
	await assert.rejects(() => breaker.execute(async () => "blocked"), { code: "CIRCUIT_OPEN" });
});

test("Semaphore limita operações simultâneas", async () => {
	const semaphore = new Semaphore(1);
	let active = 0;
	let maximum = 0;
	const task = () =>
		semaphore.run(async () => {
			active += 1;
			maximum = Math.max(maximum, active);
			await new Promise((resolve) => setTimeout(resolve, 5));
			active -= 1;
		});
	await Promise.all([task(), task(), task()]);
	assert.equal(maximum, 1);
});
