import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const dir = path.dirname(fileURLToPath(import.meta.url));

// Resolve the (unbuilt) shared core from source so tests need no build step.
export default defineConfig({
	resolve: {
		alias: {
			"@animateicons/core": path.resolve(dir, "../core/src/index.ts"),
		},
	},
	test: {
		environment: "node",
		include: ["__tests__/**/*.test.ts"],
	},
});
