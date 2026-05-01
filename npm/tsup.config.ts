import { fileURLToPath } from "node:url";
import path from "node:path";
import { defineConfig } from "tsup";

/**
 * @animateicons/react build config.
 *
 * - Entries: a top-level `index` (types only — see below) plus `lucide`
 *   and `huge` deep imports. Per-icon tree-shaking comes for free with
 *   ESM + sideEffects: false.
 * - "use client" banner: every output chunk needs the directive so Next
 *   App Router consumers don't need to add their own wrapper.
 * - Aliases: each icon source file imports `@/lib/utils` and
 *   `@/types/icon` from the AnimateIcons monorepo. Esbuild rewrites
 *   them to the package-local versions during bundling.
 * - react / react-dom stay external (peer deps). motion is intentionally
 *   bundled into dist so consumers install a single package and never
 *   hit a dual-package hazard from their own motion version.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	entry: {
		index: "src/index.ts",
		lucide: "src/lucide.ts",
		huge: "src/huge.ts",
	},
	format: ["esm", "cjs"],
	dts: true,
	// Sourcemaps add ~3.6 MB unpacked install size for the consumer.
	// Skip them — debugging into the package is rare for icon code.
	sourcemap: false,
	clean: true,
	treeshake: true,
	// Minify the runtime JS. Roughly 30% smaller before brotli.
	// .d.ts files are not minified (would break editor experience).
	minify: true,
	external: ["react", "react-dom"],
	// banner: { js } is unreliable here because tsup splits the `cn`
	// helper into a separate chunk file and esbuild loses the directive
	// on the entry. We re-inject deterministically via onSuccess.
	onSuccess: "node scripts/inject-use-client.mjs",
	esbuildOptions(options) {
		options.alias = {
			...(options.alias ?? {}),
			"@/lib/utils": path.resolve(__dirname, "src/lib/cn.ts"),
			"@/types/icon": path.resolve(__dirname, "src/lib/icon-handle.ts"),
		};
	},
});
