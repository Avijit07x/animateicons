import { searchIcons } from "./search";
import type { Catalog, CatalogIcon } from "./types";

export interface ResolveResult {
	/** The resolved icon, or null when the input is unknown or ambiguous. */
	match: CatalogIcon | null;
	/**
	 * Set when a bare base name exists in more than one library
	 * (e.g. "activity" → lu-activity + hu-activity). The caller should ask the
	 * user to disambiguate with the prefixed `registryName`.
	 */
	ambiguous: CatalogIcon[];
	/** Fuzzy near-misses, surfaced as "did you mean …" when there is no match. */
	suggestions: CatalogIcon[];
}

/**
 * Resolve a user-supplied identifier to a single catalog icon. Accepts either
 * the prefixed `registryName` ("lu-bell-ring") - always unique - or the bare
 * base name ("bell-ring"). A bare name that maps to multiple libraries is
 * reported as ambiguous rather than silently picking one.
 */
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
