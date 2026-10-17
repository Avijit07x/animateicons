import {
	fetchCatalog,
	fetchDocs,
	fetchRegistryItem,
	findDoc,
	renderIconContent,
	resolveIcon,
	searchIcons,
	writeIcon,
	type CatalogIcon,
	type DocPage,
	type IconLibrary,
} from "@animateicons/core";

export interface ToolContext {
	registryBase?: string;
	cwd?: string;
}

function pascalCase(name: string): string {
	return name
		.split("-")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join("");
}

export const FRAMEWORKS = ["react", "vanilla", "vue", "angular"] as const;
export type Framework = (typeof FRAMEWORKS)[number];

export interface FrameworkUsage {
	exportName: string;
	install: string;
	usage: string;
	customElement?: string;
	cdn?: string;
}

export function frameworkUsage(
	framework: Exclude<Framework, "react">,
	name: string,
	library: IconLibrary,
): FrameworkUsage {
	const dataName = pascalCase(name);
	const pkg = `@animateicons/${framework}`;
	const install = `npm i ${pkg}`;
	const importIcon = (exportName: string) =>
		`import { ${exportName} } from "${pkg}/${library}";`;

	if (framework === "vue") {
		const exportName = `${dataName}Icon`;
		return {
			exportName,
			install,
			usage: [
				'<script setup lang="ts">',
				importIcon(exportName),
				"</script>",
				"",
				"<template>",
				`  <${exportName} :size="24" />`,
				"</template>",
			].join("\n"),
		};
	}

	if (framework === "angular") {
		const field = dataName.charAt(0).toLowerCase() + dataName.slice(1);
		return {
			exportName: dataName,
			install,
			usage: [
				'import { Component } from "@angular/core";',
				`import { AnimateIcons } from "${pkg}";`,
				importIcon(dataName),
				"",
				"@Component({",
				'  selector: "app-example",',
				"  imports: [AnimateIcons],",
				`  template: \`<animate-icons [icon]="${field}" [size]="24" />\`,`,
				"})",
				"export class Example {",
				`  ${field} = ${dataName};`,
				"}",
			].join("\n"),
		};
	}

	const element = `<animate-icons name="${name}"></animate-icons>`;
	return {
		exportName: dataName,
		install,
		usage: [
			`import { createIcon } from "${pkg}";`,
			importIcon(dataName),
			"",
			`const icon = createIcon(${dataName}, { size: 24 });`,
			"document.body.append(icon);",
		].join("\n"),
		customElement: [
			'<script type="module">',
			`  import { defineIcons } from "${pkg}";`,
			`  ${importIcon(dataName)}`,
			`  defineIcons({ ${dataName} });`,
			"</script>",
			element,
		].join("\n"),
		cdn: [
			`<script src="https://cdn.jsdelivr.net/npm/${pkg}/dist/cdn/${library}.js"></script>`,
			element,
		].join("\n"),
	};
}

function publicIcon(icon: CatalogIcon) {
	return {
		name: icon.name,
		registryName: icon.registryName,
		library: icon.library,
		category: icon.category,
		keywords: icon.keywords,
		url: icon.url,
	};
}

export async function searchIconsTool(
	ctx: ToolContext,
	args: { query: string; library?: IconLibrary; limit?: number },
) {
	const catalog = await fetchCatalog({ registryBase: ctx.registryBase });
	const results = searchIcons(catalog, args.query, {
		library: args.library,
		limit: args.limit ?? 20,
	});
	return { count: results.length, results: results.map(publicIcon) };
}

export async function listLibrariesTool(ctx: ToolContext) {
	const catalog = await fetchCatalog({ registryBase: ctx.registryBase });
	return { total: catalog.total, libraries: catalog.libraries };
}

export interface GetIconResult {
	found: boolean;
	message?: string;
	name?: string;
	registryName?: string;
	library?: IconLibrary;
	fileName?: string;
	componentName?: string;
	importSnippet?: string;
	source?: string;
	framework?: Exclude<Framework, "react">;
	exportName?: string;
	install?: string;
	usage?: string;
	customElement?: string;
	cdn?: string;
}

export async function getIconTool(
	ctx: ToolContext,
	args: { name: string; framework?: Framework },
): Promise<GetIconResult> {
	const catalog = await fetchCatalog({ registryBase: ctx.registryBase });
	const res = resolveIcon(catalog, args.name);

	if (!res.match) {
		const candidates = [...res.ambiguous, ...res.suggestions].map(
			(i) => i.registryName,
		);
		return {
			found: false,
			message: res.ambiguous.length
				? `"${args.name}" is ambiguous. Use one of: ${candidates.join(", ")}.`
				: candidates.length
					? `"${args.name}" not found. Did you mean: ${candidates.join(", ")}?`
					: `"${args.name}" not found.`,
		};
	}

	if (args.framework && args.framework !== "react") {
		return {
			found: true,
			name: res.match.name,
			registryName: res.match.registryName,
			library: res.match.library,
			framework: args.framework,
			...frameworkUsage(args.framework, res.match.name, res.match.library),
		};
	}

	const item = await fetchRegistryItem(res.match.registryName, {
		registryBase: ctx.registryBase,
	});
	const componentName = `${pascalCase(res.match.name)}Icon`;
	return {
		found: true,
		name: res.match.name,
		registryName: res.match.registryName,
		library: res.match.library,
		fileName: `${res.match.name}.tsx`,
		componentName,
		importSnippet: `import { ${componentName} } from "@/components/icons/${res.match.name}";`,
		source: renderIconContent(item),
	};
}

export interface AddIconResult {
	added: boolean;
	message: string;
	file?: string;
}

export async function addIconTool(
	ctx: ToolContext,
	args: { name: string; targetDir?: string; overwrite?: boolean },
): Promise<AddIconResult> {
	const catalog = await fetchCatalog({ registryBase: ctx.registryBase });
	const res = resolveIcon(catalog, args.name);

	if (!res.match) {
		const candidates = [...res.ambiguous, ...res.suggestions].map(
			(i) => i.registryName,
		);
		return {
			added: false,
			message: candidates.length
				? `"${args.name}" not found / ambiguous. Candidates: ${candidates.join(", ")}.`
				: `"${args.name}" not found.`,
		};
	}

	const item = await fetchRegistryItem(res.match.registryName, {
		registryBase: ctx.registryBase,
	});
	const written = writeIcon(item, {
		cwd: ctx.cwd,
		targetDir: args.targetDir ?? "components/icons",
		fileName: `${res.match.name}.tsx`,
		overwrite: args.overwrite,
	});

	return {
		added: !written.skipped,
		file: written.file,
		message: written.skipped
			? `${written.file} already exists (pass overwrite: true to replace).`
			: `Wrote ${res.match.registryName} to ${written.file}. Requires the \`motion\` package.`,
	};
}

export interface GetDocsResult {
	found: boolean;
	message?: string;
	pages?: Omit<DocPage, "content">[];
	slug?: string;
	title?: string;
	url?: string;
	content?: string;
}

export async function getDocsTool(
	ctx: ToolContext,
	args: { page?: string },
): Promise<GetDocsResult> {
	const docs = await fetchDocs({ registryBase: ctx.registryBase });

	if (!args.page?.trim()) {
		return {
			found: true,
			pages: docs.pages.map(({ content: _content, ...page }) => page),
		};
	}

	const page = findDoc(docs, args.page);
	if (!page) {
		return {
			found: false,
			message: `"${args.page}" not found. Available pages: ${docs.pages.map((p) => p.slug).join(", ")}.`,
		};
	}

	return {
		found: true,
		slug: page.slug,
		title: page.title,
		url: page.url,
		content: page.content,
	};
}
