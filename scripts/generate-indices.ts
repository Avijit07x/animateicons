import fs from "fs";
import path from "path";

const ROOT = process.cwd();

function toPascalCase(str: string) {
	return str
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join("");
}

function generateIndex(libraryName: string, jsonFile: string) {
	const jsonPath = path.join(ROOT, jsonFile);
	const outputPath = path.join(ROOT, "icons", libraryName, "index.ts");

	if (!fs.existsSync(jsonPath)) {
		console.error(`❌ Could not find JSON input at ${jsonPath}`);
		return;
	}

	const icons = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

	let out = "";

	for (const icon of icons) {
		let componentName = `${toPascalCase(icon.name)}Icon`;
		out += `import { ${componentName} } from "./${icon.name}-icon";\n`;
	}

	out += `\nconst ICON_LIST: IconListItem[] = [\n`;

	for (const icon of icons) {
		let componentName = `${toPascalCase(icon.name)}Icon`;

		out += `  {\n`;
		out += `    name: "${icon.name}",\n`;
		out += `    icon: ${componentName},\n`;
		if (icon.addedAt) out += `    addedAt: "${icon.addedAt}",\n`;

		if (icon.category && icon.category.length > 0) {
			out += `    category: ${JSON.stringify(icon.category)},\n`;
		}

		if (icon.keywords && icon.keywords.length > 0) {
			out += `    keywords: ${JSON.stringify(icon.keywords).replace(/","/g, '", "')},\n`;
		} else {
			out += `    keywords: [],\n`;
		}

		out += `  },\n`;
	}

	out += `];\n\n`;
	out += `const ICON_COUNT = ICON_LIST.length;\n`;
	out += `export { ICON_COUNT, ICON_LIST };\n`;

	fs.writeFileSync(outputPath, out);
	console.log(
		`✅ Generated ${libraryName}/index.ts with ${icons.length} icons.`,
	);
}

console.log("🔄 Generating index files...");
generateIndex("lucide", "data/lucide-icons.json");
generateIndex("huge", "data/huge-icons.json");
