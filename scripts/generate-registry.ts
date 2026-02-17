import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const ICONS = [
	{
		lib: "huge",
		prefix: "hu",
		dir: path.join(ROOT, "icons", "huge"),
	},
	{
		lib: "lucide",
		prefix: "lu",
		dir: path.join(ROOT, "icons", "lucide"),
	},
];

const COMMON_DEPENDENCIES = ["motion"];

const PUBLIC_R_DIR = path.join(ROOT, "public", "r");

function ensureDir(dir: string) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

function toBaseName(filename: string): string {
	return filename.replace(/-icon\.tsx$/, "");
}

function main() {
	console.log("🔍 Generating registry.json...\n");

	const items: RegistryItem[] = [];
	let totalFiles = 0;

	try {
		ICONS.forEach(({ lib, prefix, dir }) => {
			if (!fs.existsSync(dir)) {
				console.log(`⚠️  Skipping ${lib} (directory not found)`);
				return;
			}

			console.log(`📦 Processing library: ${lib}`);

			const files = fs
				.readdirSync(dir)
				.filter((file) => file.endsWith("-icon.tsx"));

			if (files.length === 0) {
				console.log(`   No icon files found\n`);
				return;
			}

			files.forEach((file) => {
				const baseName = toBaseName(file);
				const name = `${prefix}-${baseName}`;

				items.push({
					name,
					type: "registry:ui",
					registryDependencies: [],
					dependencies: COMMON_DEPENDENCIES,
					devDependencies: [],
					files: [
						{
							path: `icons/${lib}/${file}`,
							type: "registry:ui",
							target: `components/icons/${baseName}.tsx`,
						},
					],
				});
			});

			totalFiles += files.length;
			console.log(`   ${files.length} icons added\n`);
		});

		const registry: Registry = {
			$schema: "https://ui.shadcn.com/schema/registry.json",
			name: "animateicons",
			homepage: "https://animateicons.in",
			items,
		};

		const output = JSON.stringify(registry, null, 2);

		ensureDir(PUBLIC_R_DIR);

		fs.writeFileSync(path.join(ROOT, "registry.json"), output, "utf8");
		fs.writeFileSync(path.join(PUBLIC_R_DIR, "registry.json"), output, "utf8");

		console.log("✅ Registry generated successfully.");
		console.log(`Total icons: ${totalFiles}`);
		console.log(
			`Files written:\n   • registry.json\n   • public/r/registry.json\n`,
		);
	} catch (error) {
		console.error("\n❌ Failed to generate registry.");
		console.error(error instanceof Error ? error.message : error);
		console.error("\nFix the issue and run the script again.\n");
		process.exit(1);
	}
}

main();
