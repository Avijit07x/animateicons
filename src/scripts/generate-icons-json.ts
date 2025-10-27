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

function main() {
	ensureDir(PUBLIC_ICONS_DIR);

	const iconList = loadIconList();

	iconList.forEach((item) => {
		let filePath = "";
		const compName = item.icon?.name || "";

		const guess1 = path.join(ICONS_DIR, `${compName}.tsx`);
		const guess2 = path.join(ICONS_DIR, `${toPascalFromKebab(item.name)}.tsx`);

		if (fs.existsSync(guess1)) filePath = guess1;
		else if (fs.existsSync(guess2)) filePath = guess2;

		let content = "";
		if (filePath) {
			content = fs.readFileSync(filePath, "utf8");
		} else {
			console.warn(`File not found for ${item.name}`);
		}

		const iconJson = {
			name: item.name,
			type: "registry:ui",
			registryDependencies: [],
			dependencies: ["motion"],
			devDependencies: [],
			tailwind: {} as Record<string, unknown>,
			cssVars: {
				light: {} as Record<string, unknown>,
				dark: {} as Record<string, unknown>,
			},
			keywords: item.keywords ?? [],
			files: [
				{
					path: path.basename(filePath || ""),
					content,
					type: "registry:ui",
				},
			],
		};

		const outFilePath = path.join(PUBLIC_ICONS_DIR, `${item.name}.json`);
		fs.writeFileSync(outFilePath, JSON.stringify(iconJson, null, 2), "utf8");
	});
}

main();
