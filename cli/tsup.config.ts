import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "tsup";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	entry: {
		cli: "src/cli.ts",
		"commands/browse": "src/commands/browse.tsx",
	},
	format: ["esm"],
	target: "node20",
	platform: "node",
	splitting: false,
	clean: true,
	sourcemap: false,
	dts: false,
	minify: false,
	banner: { js: "#!/usr/bin/env node" },
	noExternal: ["@animateicons/core", "cac", "picocolors"],
	external: ["react-devtools-core", "yoga-layout"],
	esbuildPlugins: [
		{
			name: "keep-browse-dynamic-import-external",
			setup(build) {
				build.onResolve({ filter: /^\.\/commands\/browse\.js$/ }, () => ({
					path: "./commands/browse.js",
					external: true,
				}));
			},
		},
	],
	esbuildOptions(options) {
		options.alias = {
			...(options.alias ?? {}),
			"@animateicons/core": path.resolve(__dirname, "../core/src/index.ts"),
		};
	},
});
