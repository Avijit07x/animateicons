import {
	getIcon as getHugeIcon,
	ICON_META as HUGE_META,
} from "@/icons/huge/meta";
import {
	getIcon as getLucideIcon,
	ICON_META as LUCIDE_META,
} from "@/icons/lucide/meta";
import {
	createIconSearchIndex,
	MIN_QUERY_LENGTH,
	normalizeQuery,
	type IconSearchIndex,
} from "@animateicons/core/icon-search-engine";
import {
	assertLimit,
	assertString,
	createBoundedCache,
} from "@animateicons/core/search-support";
import type { ElementType } from "react";

export type IconSearchEntry = {
	name: string;
	library: "lucide" | "huge";
	component: ElementType;
	keywords?: string[];
};

export const ICON_CATALOG: IconSearchEntry[] = [
	...LUCIDE_META.map((i) => ({
		name: i.name,
		library: "lucide" as const,
		component: getLucideIcon(i.name),
		keywords: i.keywords,
	})),
	...HUGE_META.map((i) => ({
		name: i.name,
		library: "huge" as const,
		component: getHugeIcon(i.name),
		keywords: i.keywords,
	})),
];

export const POPULAR_ICON_NAMES = [
	"house",
	"home-0-1",
	"search",
	"user",
	"settings",
	"settings-0-1",
	"heart",
	"bell",
	"notification",
	"mail",
	"mail-0-1",
	"calendar",
	"calendar-0-1",
	"download",
	"share",
	"star",
] as const;

export const POPULAR_ICONS: IconSearchEntry[] = POPULAR_ICON_NAMES.flatMap(
	(name) => ICON_CATALOG.filter((icon) => icon.name === name),
);

const MAX_CACHED_SEARCHES = 32;
const NO_RESULTS: readonly IconSearchEntry[] = Object.freeze([]);

let catalogIndex: IconSearchIndex<IconSearchEntry> | undefined;
const searchCache =
	createBoundedCache<readonly IconSearchEntry[]>(MAX_CACHED_SEARCHES);

export const searchIcons = (
	query: string,
	limit: number,
): readonly IconSearchEntry[] => {
	assertString(query, "searchIcons", "query");
	assertLimit(limit, "searchIcons");
	if (query.trim().length < MIN_QUERY_LENGTH) return NO_RESULTS;

	const normalized = normalizeQuery(query);
	const key = `${limit}|${normalized}`;
	const cached = searchCache.get(key);
	if (cached) return cached;

	catalogIndex ??= createIconSearchIndex(ICON_CATALOG);
	return searchCache.set(
		key,
		Object.freeze(catalogIndex.search(normalized, { limit })),
	);
};
