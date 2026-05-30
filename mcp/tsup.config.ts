import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "tsup";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @animateicons/mcp build.
 *
 * The shared `core` package is aliased to its TypeScript source and bundled
 * in; the MCP SDK, zod, and fuse.js stay external (declared dependencies).
 */
export default defineConfig({
	entry: { index: "src/index.ts" },
	format: ["esm"],
	target: "node18",
	platform: "node",
	splitting: false,
	clean: true,
	sourcemap: false,
	dts: false,
	minify: false,
	banner: { js: "#!/usr/bin/env node" },
	esbuildOptions(options) {
		options.alias = {
			...(options.alias ?? {}),
			"@animateicons/core": path.resolve(__dirname, "../core/src/index.ts"),
		};
	},
});
