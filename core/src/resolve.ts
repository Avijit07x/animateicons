import { searchIcons } from "./search";
import type { Catalog, CatalogIcon } from "./types";

export interface ResolveResult {
	match: CatalogIcon | null;
	ambiguous: CatalogIcon[];
	suggestions: CatalogIcon[];
}

export function resolveIcon(catalog: Catalog, input: string): ResolveResult {
	const needle = input.trim().toLowerCase();

	const byRegistry = catalog.icons.find(
		(i) => i.registryName.toLowerCase() === needle,
	);
	if (byRegistry) return { match: byRegistry, ambiguous: [], suggestions: [] };

	const byName = catalog.icons.filter((i) => i.name.toLowerCase() === needle);
	if (byName.length === 1) {
		return { match: byName[0], ambiguous: [], suggestions: [] };
	}
	if (byName.length > 1) {
		return { match: null, ambiguous: byName, suggestions: [] };
	}

	return {
		match: null,
		ambiguous: [],
		suggestions: searchIcons(catalog, input, { limit: 5 }),
	};
}
