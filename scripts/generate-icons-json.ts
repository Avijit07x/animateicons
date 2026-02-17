import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ICONS_ROOT = path.join(ROOT, "icons");

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
	console.log("🔍 Building public icon registry...\n");

	ensureDir(PUBLIC_ICONS_DIR);

	let totalGenerated = 0;

	try {
		LIBRARIES.forEach((lib) => {
			console.log(`📦 Processing library: ${lib.name}`);

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
				console.error(`❌ Unregistered icon files in ${lib.name}:`);
				unmatched.forEach((n) => console.error(`   • ${n}.tsx`));
				throw new Error(`Found unregistered ${lib.name} icons`);
			}

			iconList.forEach((item) => {
				const normalizedName = normalizeKebabName(item.name);
				const sourceBasename = `${normalizedName}-icon.tsx`;
				const filePath = path.join(lib.dir, sourceBasename);

				if (!fs.existsSync(filePath)) {
					throw new Error(`Missing icon file for "${item.name}" → ${filePath}`);
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

				fs.writeFileSync(
					outFilePath,
					JSON.stringify(iconJson, null, 2),
					"utf8",
				);

				totalGenerated++;
			});

			console.log(`✅ ${lib.name}: ${iconList.length} icons processed\n`);
		});

		console.log("🎉 Registry build completed successfully.");
		console.log(`Total files generated: ${totalGenerated}\n`);
	} catch (error) {
		console.error("\n❌ Registry build failed.");
		console.error(error instanceof Error ? error.message : error);
		console.error("\nPlease fix the issues and run the script again.\n");
		process.exit(1);
	}
}

main();
