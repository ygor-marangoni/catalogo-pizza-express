const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

function loadCollection() {
	const file = path.join(__dirname, "..", "..", "docs", "Pizza-Express.postman_collection.json");
	return JSON.parse(fs.readFileSync(file, "utf8"));
}

function collectRequests(items, requests = []) {
	for (const item of items || []) {
		if (item.request) requests.push(item);
		if (item.item) collectRequests(item.item, requests);
	}
	return requests;
}

function requestPath(item) {
	const url = item.request.url;
	if (typeof url === "string") return url;
	return url?.path ? `/${url.path.join("/")}` : "";
}

test("collection do Postman possui estrutura e endpoints essenciais", () => {
	const collection = loadCollection();
	assert.equal(collection.info.name, "Pizza Express API");
	assert.match(collection.info.schema, /collection\/v2\.1\.0/);

	const requests = collectRequests(collection.item);
	assert.ok(requests.length > 0);
	assert.ok(requests.every((item) => item.request.method && item.request.url));
	const serialized = JSON.stringify(collection).toLowerCase();
	assert.equal(serialized.includes("logout"), true);
	assert.match(serialized, /auth\/me/);

	const paths = requests.map(requestPath).join("\n");
	for (const endpoint of ["/auth/login", "/auth/refresh", "/categories", "/products", "/store"]) {
		assert.match(paths, new RegExp(endpoint.replace("/", "\\/")));
	}
});
