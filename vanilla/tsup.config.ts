import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Options } from "tsup";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const GENERATED = path.join(ROOT, "src", "generated");

interface ManifestIcon {
	library: string;
	name: string;
}

const iconEntries = (): Record<string, string> => {
	const manifestPath = path.join(GENERATED, "manifest.json");
	if (!fs.existsSync(manifestPath)) {
		throw new Error("tsup: icon data is missing. Run `pnpm run gen` first.");
	}
	const manifest = JSON.parse(
		fs.readFileSync(manifestPath, "utf8"),
	) as ManifestIcon[];
	return Object.fromEntries(
		manifest.map(({ library, name }) => [
			`${library}/${name}`,
			`src/generated/${library}/${name}.ts`,
		]),
	);
};

const BARRELS = {
	index: "src/index.ts",
	lucide: "src/generated/lucide.ts",
	huge: "src/generated/huge.ts",
};

const shared: Options = {
	minify: true,
	sourcemap: false,
	target: "es2022",
	platform: "browser",
};

export default defineConfig([
	{
		...shared,
		name: "esm",
		entry: { ...BARRELS, ...iconEntries() },
		format: ["esm"],
		splitting: true,
		treeshake: true,
		clean: true,
	},
	{
		...shared,
		name: "dts",
		entry: BARRELS,
		format: ["esm"],
		dts: { only: true },
	},
	{
		...shared,
		name: "cdn",
		entry: {
			"cdn/lucide": "src/cdn/lucide.ts",
			"cdn/huge": "src/cdn/huge.ts",
		},
		format: ["iife"],
		globalName: "AnimateIcons",
		outExtension: () => ({ js: ".js" }),
	},
]);
