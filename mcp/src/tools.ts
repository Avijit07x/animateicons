import {
	fetchCatalog,
	fetchRegistryItem,
	renderIconContent,
	resolveIcon,
	searchIcons,
	writeIcon,
	type CatalogIcon,
	type IconLibrary,
} from "@animateicons/core";

export interface ToolContext {
	registryBase?: string;
	/** Base directory used by `add_icon`. Defaults to process.cwd(). */
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
