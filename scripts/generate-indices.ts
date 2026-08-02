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

// Emits a metadata-only + lazy-loader module (`meta.ts`) per library. This is
// what CLIENT code imports (sidebar counts, search, command palette, gallery
// grid) so the client bundle no longer pulls all animated components. The
// eager `index.ts` above stays for SERVER sites (OG images, detail/SEO pages,
// sitemap) that render an icon component during the build.
function generateMeta(libraryName: string, jsonFile: string) {
	const jsonPath = path.join(ROOT, jsonFile);
	const outputPath = path.join(ROOT, "icons", libraryName, "meta.ts");

	if (!fs.existsSync(jsonPath)) {
		console.error(`❌ Could not find JSON input at ${jsonPath}`);
		return;
	}

	const icons = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

	let out = `import { lazy } from "react";\nimport type { ComponentType } from "react";\n\n`;

	out += `const ICON_META: IconMeta[] = [\n`;
	for (const icon of icons) {
		out += `  {\n`;
		out += `    name: "${icon.name}",\n`;
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

	out += `const ICON_COUNT = ICON_META.length;\n\n`;

	// Per-icon lazy loaders - each `() => import(...)` is its own code-split
	// chunk, so nothing loads until a tile is actually rendered.
	out += `const iconLoaders: Record<string, () => Promise<ComponentType<any>>> = {\n`;
	for (const icon of icons) {
		const componentName = `${toPascalCase(icon.name)}Icon`;
		out += `  "${icon.name}": () => import("./${icon.name}-icon").then((m) => m.${componentName}),\n`;
	}
	out += `};\n\n`;

	out += `const cache = new Map<string, ComponentType<any>>();\n\n`;
	out += `// Returns a cached React.lazy component for an icon name. Must be rendered\n`;
	out += `// inside a <Suspense> boundary. Refs (the animation handle) attach once the\n`;
	out += `// chunk resolves.\n`;
	out += `function getIcon(name: string): ComponentType<any> {\n`;
	out += `  let comp = cache.get(name);\n`;
	out += `  if (!comp) {\n`;
	out += `    const loader = iconLoaders[name];\n`;
	out += `    comp = lazy(() => loader().then((C) => ({ default: C })));\n`;
	out += `    cache.set(name, comp);\n`;
	out += `  }\n`;
	out += `  return comp;\n`;
	out += `}\n\n`;

	out += `export { ICON_COUNT, ICON_META, iconLoaders, getIcon };\n`;

	fs.writeFileSync(outputPath, out);
	console.log(
		`✅ Generated ${libraryName}/meta.ts with ${icons.length} icons.`,
	);
}

console.log("🔄 Generating index files...");
generateIndex("lucide", "data/lucide-icons.json");
generateIndex("huge", "data/huge-icons.json");
generateMeta("lucide", "data/lucide-icons.json");
generateMeta("huge", "data/huge-icons.json");
