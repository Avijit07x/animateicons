import { defineConfig } from "vitest/config";

// Self-contained so the package doesn't inherit the repo-root vitest config
// (which scopes tests to `tests/**`).
export default defineConfig({
	test: {
		environment: "node",
		include: ["__tests__/**/*.test.ts"],
	},
});
