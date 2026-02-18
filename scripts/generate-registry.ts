import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const ICONS = [
	{
		lib: "huge",
		prefix: "hu",
		dir: path.join(ROOT, "icons", "huge"),
		filePattern: /-icon\.tsx$/,
		toBaseName: (filename: string) => filename.replace(/-icon\.tsx$/, ""),
		toPath: (lib: string, file: string) => `icons/${lib}/${file}`,
	},
	{
		lib: "lucide",
		prefix: "lu",
		dir: path.join(ROOT, "icons", "lucide"),
		filePattern: /-icon\.tsx$/,
		toBaseName: (filename: string) => filename.replace(/-icon\.tsx$/, ""),
		toPath: (lib: string, file: string) => `icons/${lib}/${file}`,
	},
	{
		lib: "fontawesome",
		prefix: "fa",
		dir: path.join(ROOT, "icons", "fontawesome"),
		filePattern: /-icon\.tsx$/,
		toBaseName: (filename: string) => filename.replace(/-icon\.tsx$/, ""),
		toPath: (lib: string, file: string) => `icons/${lib}/${file}`,
	},
];

const COMMON_DEPENDENCIES = ["motion"];

const PUBLIC_R_DIR = path.join(ROOT, "public", "r");

function ensureDir(dir: string) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

function main() {
	console.log("🔍 Generating registry.json...\n");

	const items: RegistryItem[] = [];
	let totalFiles = 0;

	try {
		ICONS.forEach(({ lib, prefix, dir, filePattern, toBaseName, toPath }) => {
			if (!fs.existsSync(dir)) {
				console.log(`⚠️  Skipping ${lib} (directory not found)`);
				return;
			}

			console.log(`📦 Processing library: ${lib}`);

			const files = fs
				.readdirSync(dir)
				.filter((file) => filePattern.test(file));

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
							path: toPath(lib, file),
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
