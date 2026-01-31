import { readFileSync } from "node:fs";
import { join } from "node:path";

type RegistryItem = {
	name: string;
};

type Registry = {
	items: RegistryItem[];
};

const ROOT = process.cwd();

function readRegistry(path: string): Registry {
	return JSON.parse(readFileSync(path, "utf-8"));
}

function findDuplicates(names: string[]): string[] {
	return names.filter((n, i) => names.indexOf(n) !== i);
}

function main() {
	console.log("Checking registry.json consistency...\n");

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
		console.log("Duplicate names in root registry.json:");
		[...new Set(rootDuplicates)].forEach((n) => console.log(`  - ${n}`));
		console.log("");
	}

	const publicDuplicates = findDuplicates(publicNames);
	if (publicDuplicates.length > 0) {
		hasError = true;
		console.log("Duplicate names in public/r/registry.json:");
		[...new Set(publicDuplicates)].forEach((n) => console.log(`  - ${n}`));
		console.log("");
	}

	if (rootNames.join("|") !== publicNames.join("|")) {
		hasError = true;
		console.log("Root and public registry.json are not identical\n");
	}

	if (!hasError) {
		console.log("Registry files are valid and in sync\n");
		return;
	}

	process.exit(1);
}

main();
