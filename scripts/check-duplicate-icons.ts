import { readFileSync } from "node:fs";
import { join } from "node:path";

type IconEntry = {
	name: string;
	source: "huge" | "lucide";
	file: string;
	line: number;
};

const ROOT = process.cwd();

function findIconLines(
	filePath: string,
	source: "huge" | "lucide",
	prefix: string,
): IconEntry[] {
	const content = readFileSync(filePath, "utf-8");
	const lines = content.split("\n");

	const results: IconEntry[] = [];

	for (let i = 0; i < lines.length; i++) {
		const match = lines[i].match(/name:\s*["']([^"']+)["']/);
		if (!match) continue;

		results.push({
			name: `${prefix}-${match[1]}`,
			source,
			file: filePath,
			line: i + 1,
		});
	}

	return results;
}

function buildIconEntries(): IconEntry[] {
	const hugeFile = join(ROOT, "icons", "huge", "index.ts");
	const lucideFile = join(ROOT, "icons", "lucide", "index.ts");

	return [
		...findIconLines(hugeFile, "huge", "hu"),
		...findIconLines(lucideFile, "lucide", "lu"),
	];
}

function findDuplicates(entries: IconEntry[]) {
	const map = new Map<string, IconEntry[]>();

	for (const entry of entries) {
		const list = map.get(entry.name) ?? [];
		list.push(entry);
		map.set(entry.name, list);
	}

	for (const [name, list] of map) {
		if (list.length < 2) map.delete(name);
	}

	return map;
}

function main() {
	console.log("🔍 Checking ICON_LIST for duplicate names...\n");

	const entries = buildIconEntries();
	const duplicates = findDuplicates(entries);

	if (duplicates.size === 0) {
		console.log("✅ No duplicate icon names found.");
		console.log("ICON_LIST validation passed.\n");
		return;
	}

	console.log("❌ Duplicate icon names detected:\n");

	for (const [name, list] of duplicates) {
		console.log(`🔁 Name: "${name}"`);
		for (const e of list) {
			console.log(`   • ${e.source} → ${e.file}:${e.line}`);
		}
		console.log("");
	}

	console.log(
		"Please ensure each icon name is unique within and across libraries.\n",
	);

	process.exit(1);
}

main();
