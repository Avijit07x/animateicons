import fs from "node:fs";
import path from "node:path";

type IconListItem = {
	name: string;
	icon: { name?: string };
	keywords: string[];
};

const ROOT = process.cwd();
const ICONS_DIR = path.join(ROOT, "src", "Icons");
const ICONS_INDEX = path.join(ICONS_DIR, "index.ts");
const PUBLIC_ICONS_DIR = path.join(ROOT, "public", "icons");

const ensureDir = (dir: string) => {
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

function toPascalFromKebab(kebab: string): string {
	return (
		kebab
			.split("-")
			.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
			.join("") + "Icon"
	);
}

function loadIconList(): IconListItem[] {
	const mod = require(ICONS_INDEX);
	if (!mod || !mod.ICON_LIST) {
		throw new Error("ICON_LIST not exported from src/Icons/index.ts");
	}
	return mod.ICON_LIST as IconListItem[];
}

function makeSafeFilename(name: string) {
	return name.replace(/[^a-z0-9._-]/gi, "-");
}

function stubContentFor(name: string) {
	const pascal = toPascalFromKebab(name);
	return `export const ${pascal} = () => null;\nexport default ${pascal};\n`;
}

function main() {
	ensureDir(PUBLIC_ICONS_DIR);

	const iconList = loadIconList();

	const allowedNames = new Set<string>();
	iconList.forEach((item) => {
		if (item.icon?.name) allowedNames.add(item.icon.name);
		allowedNames.add(toPascalFromKebab(item.name));
	});

	const dirEntries = fs.existsSync(ICONS_DIR) ? fs.readdirSync(ICONS_DIR) : [];
	const tsxFiles = dirEntries.filter((f) => f.endsWith(".tsx"));

	const unmatched: string[] = [];
	tsxFiles.forEach((file) => {
		const base = path.basename(file, ".tsx");
		if (!allowedNames.has(base)) unmatched.push(base);
	});

	if (unmatched.length > 0) {
		console.error(
			"The following .tsx files do not have matching entries in ICON_LIST:",
		);
		unmatched.forEach((name) => console.error(name));
		throw new Error("Unmatched .tsx files found. See console for list.");
	}

	iconList.forEach((item) => {
		let filePath = "";
		const compName = item.icon?.name || "";

		const guess1 = path.join(ICONS_DIR, `${compName}.tsx`);
		const guess2 = path.join(ICONS_DIR, `${toPascalFromKebab(item.name)}.tsx`);

		if (fs.existsSync(guess1)) filePath = guess1;
		else if (fs.existsSync(guess2)) filePath = guess2;

		let content = "";
		let sourceBasename = "";

		if (filePath) {
			try {
				content = fs.readFileSync(filePath, "utf8");
				sourceBasename = path.basename(filePath);
			} catch {
				content = stubContentFor(item.name);
				sourceBasename = `${makeSafeFilename(item.name)}.tsx`;
			}
		} else {
			content = stubContentFor(item.name);
			sourceBasename = `${makeSafeFilename(item.name)}.tsx`;
		}

		const iconJson = {
			name: item.name,
			type: "registry:component",
			addGlobalCss: false,
			registryDependencies: [],
			dependencies: ["motion"],
			devDependencies: [],
			keywords: item.keywords ?? [],
			files: [
				{
					path: sourceBasename,
					content,
					type: "registry:component",
				},
			],
		};

		const outFilePath = path.join(PUBLIC_ICONS_DIR, `${item.name}.json`);
		fs.writeFileSync(outFilePath, JSON.stringify(iconJson, null, 2), "utf8");
	});
}

// main();
