import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ICONS_ROOT = path.join(ROOT, "src", "icons");

const LIBRARIES = [
	{
		name: "huge",
		prefix: "hu",
		dir: path.join(ICONS_ROOT, "huge"),
		index: path.join(ICONS_ROOT, "huge", "index.ts"),
	},
	{
		name: "lucide",
		prefix: "lu",
		dir: path.join(ICONS_ROOT, "lucide"),
		index: path.join(ICONS_ROOT, "lucide", "index.ts"),
	},
] as const;

const PUBLIC_ICONS_DIR = path.join(ROOT, "public", "r");

const ensureDir = (dir: string) => {
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

function normalizeKebabName(name: string): string {
	return name
		.replace(/[A-Z]{2,}/g, (m) => m.toLowerCase().split("").join("-"))
		.replace(/\d+/g, (m) => m.split("").join("-"))
		.replace(/--+/g, "-")
		.toLowerCase();
}

function loadIconList(indexPath: string): IconListItem[] {
	const mod = require(indexPath);
	if (!mod || !mod.ICON_LIST) {
		throw new Error(`ICON_LIST not exported from ${indexPath}`);
	}
	return mod.ICON_LIST as IconListItem[];
}

function main() {
	ensureDir(PUBLIC_ICONS_DIR);

	LIBRARIES.forEach((lib) => {
		const iconList = loadIconList(lib.index);

		const tsxFiles = fs.existsSync(lib.dir)
			? fs.readdirSync(lib.dir).filter((f) => f.endsWith("-icon.tsx"))
			: [];

		const allowedFiles = new Set<string>();
		iconList.forEach((item) => {
			const normalized = normalizeKebabName(item.name);
			allowedFiles.add(`${normalized}-icon`);
		});

		const unmatched: string[] = [];
		tsxFiles.forEach((file) => {
			const base = path.basename(file, ".tsx");
			if (!allowedFiles.has(base)) unmatched.push(base);
		});

		if (unmatched.length > 0) {
			console.error(`Unmatched .tsx files in ${lib.name}:`);
			unmatched.forEach((n) => console.error(n));
			throw new Error(`Unmatched ${lib.name} icons`);
		}

		iconList.forEach((item) => {
			const normalizedName = normalizeKebabName(item.name);
			const sourceBasename = `${normalizedName}-icon.tsx`;
			const filePath = path.join(lib.dir, sourceBasename);

			if (!fs.existsSync(filePath)) {
				throw new Error(`Missing icon file: ${filePath}`);
			}

			const content = fs.readFileSync(filePath, "utf8");

			const iconJson = {
				$schema: "https://ui.shadcn.com/schema/registry-item.json",
				name: normalizedName,
				type: "registry:ui",
				addGlobalCss: false,
				registryDependencies: [],
				dependencies: ["motion"],
				devDependencies: [],
				files: [
					{
						path: sourceBasename,
						content,
						type: "registry:ui",
					},
				],
			};

			const outFilePath = path.join(
				PUBLIC_ICONS_DIR,
				`${lib.prefix}-${normalizedName}.json`,
			);

			fs.writeFileSync(outFilePath, JSON.stringify(iconJson, null, 2), "utf8");
		});
	});
}

main();
