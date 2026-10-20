import fs from "fs";
import path from "path";
import { sortIconsByFamily } from "./icon-order";

type ManifestIcon = {
	name: string;
	addedAt?: string;
	updatedAt?: string;
	category?: string[];
	keywords?: string[];
};

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

	const icons = sortIconsByFamily<ManifestIcon>(
		JSON.parse(fs.readFileSync(jsonPath, "utf8")),
	);

	let out = "";

	for (const icon of icons) {
		const componentName = `${toPascalCase(icon.name)}Icon`;
		out += `import { ${componentName} } from "./${icon.name}-icon";\n`;
	}

	out += `\nconst ICON_LIST: IconListItem[] = [\n`;

	for (const icon of icons) {
		const componentName = `${toPascalCase(icon.name)}Icon`;

		out += `  {\n`;
		out += `    name: "${icon.name}",\n`;
		out += `    icon: ${componentName},\n`;
		if (icon.addedAt) out += `    addedAt: "${icon.addedAt}",\n`;
		if (icon.updatedAt) out += `    updatedAt: "${icon.updatedAt}",\n`;

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

function generateMeta(libraryName: string, jsonFile: string) {
	const jsonPath = path.join(ROOT, jsonFile);
	const libraryDir = path.join(ROOT, "icons", libraryName);

	if (!fs.existsSync(jsonPath)) {
		console.error(`❌ Could not find JSON input at ${jsonPath}`);
		return;
	}

	const icons = sortIconsByFamily<ManifestIcon>(
		JSON.parse(fs.readFileSync(jsonPath, "utf8")),
	);

	let meta = `const ICON_META: IconMeta[] = [\n`;
	for (const icon of icons) {
		meta += `  {\n`;
		meta += `    name: "${icon.name}",\n`;
		if (icon.addedAt) meta += `    addedAt: "${icon.addedAt}",\n`;
		if (icon.updatedAt) meta += `    updatedAt: "${icon.updatedAt}",\n`;
		if (icon.category && icon.category.length > 0) {
			meta += `    category: ${JSON.stringify(icon.category)},\n`;
		}
		if (icon.keywords && icon.keywords.length > 0) {
			meta += `    keywords: ${JSON.stringify(icon.keywords).replace(/","/g, '", "')},\n`;
		} else {
			meta += `    keywords: [],\n`;
		}
		meta += `  },\n`;
	}
	meta += `];\n\nexport { ICON_META };\n`;
	fs.writeFileSync(path.join(libraryDir, "meta.ts"), meta);

	let loaders = `import { lazy } from "react";\nimport type { ComponentType } from "react";\n\n`;
	loaders += `const iconLoaders: Record<string, () => Promise<ComponentType<any>>> = {\n`;
	for (const icon of icons) {
		const componentName = `${toPascalCase(icon.name)}Icon`;
		loaders += `  "${icon.name}": () => import("./${icon.name}-icon").then((m) => m.${componentName}),\n`;
	}
	loaders += `};\n\n`;
	loaders += `const cache = new Map<string, ComponentType<any>>();\n\n`;
	loaders += `function getIcon(name: string): ComponentType<any> {\n`;
	loaders += `  let comp = cache.get(name);\n`;
	loaders += `  if (!comp) {\n`;
	loaders += `    const loader = iconLoaders[name];\n`;
	loaders += `    comp = lazy(() => loader().then((C) => ({ default: C })));\n`;
	loaders += `    cache.set(name, comp);\n`;
	loaders += `  }\n`;
	loaders += `  return comp;\n`;
	loaders += `}\n\n`;
	loaders += `export { getIcon };\n`;
	fs.writeFileSync(path.join(libraryDir, "loaders.ts"), loaders);

	const categoryCounts = new Map<string, number>();
	for (const icon of icons) {
		for (const cat of icon.category ?? []) {
			categoryCounts.set(cat, (categoryCounts.get(cat) ?? 0) + 1);
		}
	}
	const categories = [...categoryCounts]
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count);
	const addedAt = icons.flatMap((icon) => icon.addedAt ?? []);

	let summary = `export const ICON_CATEGORIES = ${JSON.stringify(categories)};\n\n`;
	summary += `export const ICON_ADDED_AT = ${JSON.stringify(addedAt)};\n`;
	fs.writeFileSync(path.join(libraryDir, "summary.ts"), summary);

	console.log(
		`✅ Generated ${libraryName}/meta.ts, loaders.ts and summary.ts with ${icons.length} icons.`,
	);
}

console.log("🔄 Generating index files...");
generateIndex("lucide", "data/lucide-icons.json");
generateIndex("huge", "data/huge-icons.json");
generateMeta("lucide", "data/lucide-icons.json");
generateMeta("huge", "data/huge-icons.json");
