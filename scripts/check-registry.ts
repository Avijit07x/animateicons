import { readFileSync } from "node:fs";
import { join } from "node:path";

type RegistryItem = {
	name: string;
};

type Registry = {
	items: RegistryItem[];
};

type Catalog = {
	icons: { registryName: string }[];
};

const ROOT = process.cwd();

function readRegistry(path: string): Registry {
	return JSON.parse(readFileSync(path, "utf-8"));
}

function readCatalog(path: string): Catalog {
	return JSON.parse(readFileSync(path, "utf-8"));
}

function findDuplicates(names: string[]): string[] {
	return names.filter((n, i) => names.indexOf(n) !== i);
}

function main() {
	console.log("🔍 Checking registry.json consistency...\n");

	const rootPath = join(ROOT, "registry.json");
	const publicPath = join(ROOT, "public", "r", "registry.json");

	const rootRegistry = readRegistry(rootPath);
	const publicRegistry = readRegistry(publicPath);

	const rootNames = rootRegistry.items.map((i) => i.name);
	const publicNames = publicRegistry.items.map((i) => i.name);

	let hasError = false;

	const rootDuplicates = findDuplicates(rootNames);
	if (rootDuplicates.length > 0) {
		hasError = true;
		console.log("❌ Duplicate names in registry.json:");
		[...new Set(rootDuplicates)].forEach((n) => console.log(`   • ${n}`));
		console.log("");
	}

	const publicDuplicates = findDuplicates(publicNames);
	if (publicDuplicates.length > 0) {
		hasError = true;
		console.log("❌ Duplicate names in public/r/registry.json:");
		[...new Set(publicDuplicates)].forEach((n) => console.log(`   • ${n}`));
		console.log("");
	}

	if (rootNames.join("|") !== publicNames.join("|")) {
		hasError = true;
		console.log("❌ Registry mismatch detected.");
		console.log(
			"   registry.json and public/r/registry.json are not identical.\n",
		);
	}

	// Catalog parity: every registry item must have exactly one catalog entry
	// and vice versa, so the CLI/MCP never resolve a name the registry lacks.
	const catalogPath = join(ROOT, "public", "r", "catalog.json");
	const catalog = readCatalog(catalogPath);
	const catalogNames = catalog.icons.map((i) => i.registryName);

	const rootSet = new Set(rootNames);
	const catalogSet = new Set(catalogNames);

	const missingFromCatalog = rootNames.filter((n) => !catalogSet.has(n));
	const extraInCatalog = catalogNames.filter((n) => !rootSet.has(n));

	if (missingFromCatalog.length > 0 || extraInCatalog.length > 0) {
		hasError = true;
		console.log("❌ catalog.json is out of sync with registry.json.");
		missingFromCatalog.forEach((n) =>
			console.log(`   • missing from catalog: ${n}`),
		);
		extraInCatalog.forEach((n) => console.log(`   • not in registry: ${n}`));
		console.log("   Run `pnpm gen:icons` to regenerate.\n");
	}

	if (!hasError) {
		console.log("✅ Registry validation passed.");
		console.log("Both registry files are valid and in sync.\n");
		return;
	}

	console.log("Please fix the above issues before committing.\n");
	process.exit(1);
}

main();
