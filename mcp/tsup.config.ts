import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "tsup";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
