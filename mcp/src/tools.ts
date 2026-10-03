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
}

export async function getIconTool(
	ctx: ToolContext,
	args: { name: string },
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
