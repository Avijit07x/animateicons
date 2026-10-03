import {
	fetchCatalog,
	resolveIcon,
	searchIcons,
	type CatalogIcon,
	type IconLibrary,
} from "@animateicons/core";

export interface QueryOptions {
	registryBase?: string;
	library?: IconLibrary;
	limit?: number;
}

export async function runSearch(
	query: string,
	opts: QueryOptions = {},
): Promise<CatalogIcon[]> {
	const catalog = await fetchCatalog({ registryBase: opts.registryBase });
	return searchIcons(catalog, query, {
		library: opts.library,
		limit: opts.limit,
	});
}

export async function runList(opts: QueryOptions = {}): Promise<CatalogIcon[]> {
	const catalog = await fetchCatalog({ registryBase: opts.registryBase });
	const icons = opts.library
		? catalog.icons.filter((i) => i.library === opts.library)
		: catalog.icons;
	return typeof opts.limit === "number" ? icons.slice(0, opts.limit) : icons;
}

export interface InfoResult {
	icon: CatalogIcon | null;
	candidates: string[];
}

export async function runInfo(
	name: string,
	opts: QueryOptions = {},
): Promise<InfoResult> {
	const catalog = await fetchCatalog({ registryBase: opts.registryBase });
	const res = resolveIcon(catalog, name);
	return {
		icon: res.match,
		candidates: [...res.ambiguous, ...res.suggestions].map(
			(i) => i.registryName,
		),
	};
}
