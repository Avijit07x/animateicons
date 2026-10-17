import { build } from "esbuild";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import type { IconLibrary } from "../../vanilla/src/types";
import type { extractIcons, IconSource } from "./extract";

export const ROOT = path.resolve(__dirname, "..", "..");

export const ICON_LIBRARIES: IconLibrary[] = ["lucide", "huge"];

const BUNDLE = path.join(
	ROOT,
	"node_modules",
	".cache",
	"animateicons",
	"icon-data.cjs",
);

const toPascalCase = (name: string) =>
	name
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");

interface IconEntry {
	library: IconLibrary;
	name: string;
	exportName: string;
}

interface ExtractorBundle {
	extractIcons: typeof extractIcons;
	modules: Record<string, Record<string, unknown>>;
}

async function listIcons(): Promise<IconEntry[]> {
	const entries: IconEntry[] = [];
	for (const library of ICON_LIBRARIES) {
		const manifest = JSON.parse(
			await fs.readFile(
				path.join(ROOT, "data", `${library}-icons.json`),
				"utf8",
			),
		) as { name: string }[];
		for (const { name } of manifest) {
			entries.push({ library, name, exportName: toPascalCase(name) });
		}
	}
	return entries.sort(
		(a, b) =>
			a.library.localeCompare(b.library) || a.name.localeCompare(b.name),
	);
}

const bundleEntry = (icons: IconEntry[]) =>
	[
		`export { extractIcons } from "./scripts/icon-data/extract";`,
		...icons.map(
			({ library, name }, index) =>
				`import * as icon${index} from "./icons/${library}/${name}-icon";`,
		),
		`export const modules = {`,
		...icons.map(
			({ library, name }, index) => `\t"${library}/${name}": icon${index},`,
		),
		`};`,
	].join("\n");

export async function loadIconExtractor() {
	const icons = await listIcons();
	await build({
		stdin: { contents: bundleEntry(icons), resolveDir: ROOT, loader: "ts" },
		bundle: true,
		platform: "node",
		format: "cjs",
		jsx: "automatic",
		outfile: BUNDLE,
		tsconfig: path.join(ROOT, "tsconfig.json"),
		alias: {
			"motion/react": path.join(ROOT, "scripts", "icon-data", "recorder.tsx"),
		},
		external: ["react", "react/*", "react-dom", "react-dom/*"],
		logLevel: "error",
	});

	const require = createRequire(__filename);
	delete require.cache[BUNDLE];
	const bundle = require(BUNDLE) as ExtractorBundle;

	const sources: IconSource[] = icons.map((icon) => {
		const key = `${icon.library}/${icon.name}`;
		const component = bundle.modules[key]?.[`${icon.exportName}Icon`];
		if (typeof component !== "object" && typeof component !== "function") {
			throw new Error(`${key}: ${icon.exportName}Icon is not exported`);
		}
		return { ...icon, component: component as IconSource["component"] };
	});

	return { sources, extractIcons: bundle.extractIcons };
}
