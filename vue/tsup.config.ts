import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Options } from "tsup";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST = path.join(ROOT, "src", "generated", "manifest.json");

interface ManifestIcon {
	library: string;
	name: string;
}

const iconEntries = (): Record<string, string> => {
	if (!fs.existsSync(MANIFEST)) {
		throw new Error(
			"tsup: icon components are missing. Run `pnpm run gen` first.",
		);
	}
	const manifest = JSON.parse(
		fs.readFileSync(MANIFEST, "utf8"),
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
	format: ["esm"],
};

export default defineConfig([
	{
		...shared,
		name: "esm",
		entry: { ...BARRELS, ...iconEntries() },
		splitting: true,
		treeshake: true,
		clean: true,
	},
	{
		...shared,
		name: "dts",
		entry: BARRELS,
		dts: { only: true },
	},
]);
