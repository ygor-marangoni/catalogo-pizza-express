module.exports = {
	test: {
		environment: "node",
		globals: true,
		include: ["tests/**/*.test.js"],
		hookTimeout: 30000,
		testTimeout: 30000,
		sequence: { concurrent: false },
	},
};
