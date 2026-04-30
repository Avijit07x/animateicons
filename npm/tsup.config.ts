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
 * - peerDeps (react, motion) stay external — no double-bundling.
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
	sourcemap: true,
	clean: true,
	treeshake: true,
	external: ["react", "react-dom", "motion", "motion/react"],
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
