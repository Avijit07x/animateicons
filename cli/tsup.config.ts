import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "tsup";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * animateicons (CLI) build.
 *
 * Two outputs:
 *  - dist/cli.js              the bin (cac commands; bundles core/cac/picocolors/fuse.js)
 *  - dist/commands/browse.js  the Ink TUI for `browse`, loaded lazily at runtime
 *
 * ink + react + ink-text-input are declared dependencies, so tsup keeps them
 * external (bundling Ink breaks on its react-devtools-core / yoga-layout
 * internals). The `browse` module is a separate entry, and the dynamic
 * `import("./commands/browse.js")` from cli.ts is forced external by the plugin
 * below so Ink/React are only evaluated when the user actually runs `browse` -
 * `add`/`search`/`list` pay zero TUI cost.
 */
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
	noExternal: ["@animateicons/core", "cac", "picocolors", "fuse.js"],
	// Defensive: never try to bundle Ink's optional/native internals.
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
