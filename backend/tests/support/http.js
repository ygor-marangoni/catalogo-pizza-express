const http = require("node:http");

async function startServer() {
	process.env.USE_DATABASE = "false";
	process.env.CLOUDINARY_CLOUD_NAME = "";
	process.env.CLOUDINARY_API_KEY = "";
	process.env.CLOUDINARY_API_SECRET = "";
	const app = require("../../dist/server");
	const server = http.createServer(app);
	await new Promise((resolve) => server.listen(0, resolve));
	return { server, baseUrl: `http://127.0.0.1:${server.address().port}` };
}

async function stopServer(server) {
	await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
}

async function request(baseUrl, path, options = {}) {
	const response = await fetch(`${baseUrl}${path}`, options);
	let body = null;
	try {
		body = await response.json();
	} catch {}
	return { response, body };
}

function jsonOptions(method, body, token) {
	return {
		method,
		headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
		...(body === undefined ? {} : { body: JSON.stringify(body) }),
	};
}

function multipartOptions(method, fields, token, file) {
	const form = new FormData();
	for (const [key, value] of Object.entries(fields)) form.append(key, String(value));
	if (file) form.append("image", new Blob([file.content], { type: file.type }), file.name);
	return {
		method,
		headers: token ? { authorization: `Bearer ${token}` } : {},
		body: form,
	};
}

module.exports = { startServer, stopServer, request, jsonOptions, multipartOptions };
