import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Options } from "tsup";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BARRELS = {
	index: "src/index.ts",
	lucide: "src/lucide.ts",
	huge: "src/huge.ts",
} as const;

const iconEntries = (): Record<string, string> => {
	const entries: Record<string, string> = {};
	for (const barrel of [BARRELS.lucide, BARRELS.huge]) {
		const source = fs.readFileSync(path.resolve(__dirname, barrel), "utf8");
		for (const [, rel] of source.matchAll(
			/from "\.\.\/\.\.\/(icons\/[a-z]+\/[a-z0-9-]+)"/g,
		)) {
			entries[rel] = `../${rel}.tsx`;
		}
	}
	if (Object.keys(entries).length === 0) {
		throw new Error(
			"tsup: no icon entries matched the barrels - ESM would ship as one unshakeable bundle",
		);
	}
	return entries;
};

const shared: Options = {
	minify: true,
	sourcemap: false,
	external: ["react", "react-dom"],
	esbuildOptions(options) {
		options.alias = {
			...(options.alias ?? {}),
			"@/lib/utils": path.resolve(__dirname, "src/lib/cn.ts"),
			"@/types/icon": path.resolve(__dirname, "src/lib/icon-handle.ts"),
		};
	},
};

export default defineConfig([
	{
		...shared,
		name: "esm",
		entry: { ...BARRELS, ...iconEntries() },
		format: ["esm"],
		splitting: true,
		clean: true,
		dts: false,
	},
	{
		...shared,
		name: "cjs",
		entry: BARRELS,
		format: ["cjs"],
		treeshake: true,
		dts: false,
	},
	{
		...shared,
		name: "dts",
		entry: BARRELS,
		format: ["esm", "cjs"],
		dts: { only: true },
	},
]);
