import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "tsup";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * animateicons (CLI) build.
 *
 * Ships as a single, dependency-free executable: the shared `core` package
 * (aliased to its TypeScript source) and the small runtime deps are bundled
 * in, so `npx animateicons` starts fast with nothing else to install.
 */
export default defineConfig({
	entry: { cli: "src/cli.ts" },
	format: ["esm"],
	target: "node18",
	platform: "node",
	splitting: false,
	clean: true,
	sourcemap: false,
	dts: false,
	minify: false,
	banner: { js: "#!/usr/bin/env node" },
	noExternal: ["@animateicons/core", "cac", "picocolors", "fuse.js"],
	esbuildOptions(options) {
		options.alias = {
			...(options.alias ?? {}),
			"@animateicons/core": path.resolve(__dirname, "../core/src/index.ts"),
		};
	},
});
