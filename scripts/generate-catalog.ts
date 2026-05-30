import fs from "node:fs";
import path from "node:path";

/**
 * Generates `public/r/catalog.json` — a single, searchable index of every
 * published icon, used by `@animateicons/cli` and `@animateicons/mcp`.
 *
 * Why a separate artifact: the shadcn registry (`registry.json` /
 * `public/r/*.json`) only carries names + file targets, with no keywords or
 * categories to search over. The rich metadata lives in
 * `data/{lucide,huge}-icons.json`. This script JOINS the two so clients can
 * fuzzy-search locally after a single fetch instead of pulling 281 files.
 *
 * Source of truth for *what is published* is `registry.json` (every item has
 * a corresponding `public/r/<name>.json`); metadata is looked up from the
 * data files. An item with no metadata entry is a build error — it means the
 * registry and data files have drifted.
 *
 * The output is intentionally deterministic (no timestamps) so `gen:icons`
 * stays idempotent and produces no spurious git diffs.
 */

const ROOT = process.cwd();
const SITE_URL = "https://animateicons.in";

const PREFIX_TO_LIBRARY: Record<string, IconLibrary> = {
	lu: "lucide",
	hu: "huge",
};

type DataIcon = {
	name: string;
	addedAt?: string;
	category?: string[];
	keywords?: string[];
};

type CatalogIcon = {
	name: string;
	library: IconLibrary;
	prefix: IconLibraryPrefix;
	registryName: string;
	addedAt: string | null;
	category: string[];
	keywords: string[];
	url: string;
};

// Mirror of the normalizer in generate-icons-json.ts so catalog keys line up
// exactly with the generated `public/r/<prefix>-<name>.json` file names.
function normalizeKebabName(name: string): string {
	return name
		.replace(/[A-Z]{2,}/g, (m) => m.toLowerCase().split("").join("-"))
		.replace(/\d+/g, (m) => m.split("").join("-"))
		.replace(/--+/g, "-")
		.toLowerCase();
}

function loadDataIcons(file: string): DataIcon[] {
	const p = path.join(ROOT, "data", file);
	return JSON.parse(fs.readFileSync(p, "utf8")) as DataIcon[];
}

function buildMetadataIndex(icons: DataIcon[]): Map<string, DataIcon> {
	const map = new Map<string, DataIcon>();
	for (const icon of icons) {
		map.set(normalizeKebabName(icon.name), icon);
	}
	return map;
}

function main() {
	console.log("🔍 Generating catalog.json...\n");

	const registry: Registry = JSON.parse(
		fs.readFileSync(path.join(ROOT, "registry.json"), "utf8"),
	);

	const metadata: Record<IconLibrary, Map<string, DataIcon>> = {
		lucide: buildMetadataIndex(loadDataIcons("lucide-icons.json")),
		huge: buildMetadataIndex(loadDataIcons("huge-icons.json")),
	};

	const icons: CatalogIcon[] = [];
	const missing: string[] = [];

	for (const item of registry.items) {
		const [prefix, ...rest] = item.name.split("-");
		const library = PREFIX_TO_LIBRARY[prefix];
		const baseName = rest.join("-");

		if (!library) {
			missing.push(`${item.name} (unknown prefix "${prefix}")`);
			continue;
		}

		const meta = metadata[library].get(baseName);
		if (!meta) {
			missing.push(`${item.name} (no metadata in data/${library}-icons.json)`);
			continue;
		}

		icons.push({
			name: baseName,
			library,
			prefix: prefix as IconLibraryPrefix,
			registryName: item.name,
			addedAt: meta.addedAt ?? null,
			category: meta.category ?? [],
			keywords: meta.keywords ?? [],
			url: `${SITE_URL}/r/${item.name}.json`,
		});
	}

	if (missing.length > 0) {
		console.error("❌ Catalog generation failed — registry/data drift:");
		missing.forEach((m) => console.error(`   • ${m}`));
		console.error("\nRun `pnpm gen:icons` after syncing data files.\n");
		process.exit(1);
	}

	// Deterministic ordering, independent of readdir order.
	icons.sort((a, b) => a.registryName.localeCompare(b.registryName));

	const catalog = {
		$schema: `${SITE_URL}/r/catalog.schema.json`,
		version: 1,
		registryBase: `${SITE_URL}/r`,
		total: icons.length,
		libraries: {
			lucide: icons.filter((i) => i.library === "lucide").length,
			huge: icons.filter((i) => i.library === "huge").length,
		},
		icons,
	};

	const outPath = path.join(ROOT, "public", "r", "catalog.json");
	fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2), "utf8");

	console.log("✅ Catalog generated successfully.");
	console.log(
		`Total icons: ${catalog.total} (lucide: ${catalog.libraries.lucide}, huge: ${catalog.libraries.huge})`,
	);
	console.log(`Written: public/r/catalog.json\n`);
}

main();
