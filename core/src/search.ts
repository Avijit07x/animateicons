import Fuse from "fuse.js";

import type { Catalog, CatalogIcon, IconLibrary } from "./types";

export interface SearchOptions {
	/** Restrict results to a single library. */
	library?: IconLibrary;
	/** Max results to return. Defaults to 20. */
	limit?: number;
}

/**
 * Fuzzy-search the catalog over name, keywords, and category. Mirrors the
 * weighting used by the showcase site's Cmd+K palette so CLI/MCP results feel
 * consistent with the website. An empty query returns the (optionally
 * library-filtered) catalog head.
 */
export function searchIcons(
	catalog: Catalog,
	query: string,
	opts: SearchOptions = {},
): CatalogIcon[] {
	const { library, limit = 20 } = opts;

	let pool = catalog.icons;
	if (library) pool = pool.filter((i) => i.library === library);

	const q = query.trim();
	if (!q) return pool.slice(0, limit);

	const fuse = new Fuse(pool, {
		keys: [
			{ name: "name", weight: 0.5 },
			{ name: "keywords", weight: 0.3 },
			{ name: "category", weight: 0.2 },
		],
		threshold: 0.4,
		ignoreLocation: true,
		includeScore: true,
	});

	return fuse
		.search(q)
		.slice(0, limit)
		.map((r) => r.item);
}
