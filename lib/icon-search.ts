import {
	getIcon as getHugeIcon,
	ICON_META as HUGE_META,
} from "@/icons/huge/meta";
import {
	getIcon as getLucideIcon,
	ICON_META as LUCIDE_META,
} from "@/icons/lucide/meta";
import Fuse from "fuse.js";
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

const MIN_QUERY_LENGTH = 2;
const MAX_FUSE_SCORE = 0.4;

const FUSE = new Fuse(ICON_CATALOG, {
	keys: [
		{ name: "name", weight: 0.85 },
		{ name: "keywords", weight: 0.15 },
	],
	threshold: 0.3,
	ignoreLocation: true,
	minMatchCharLength: MIN_QUERY_LENGTH,
	includeScore: true,
});

const MAX_MATCHABLE_LENGTH = ICON_CATALOG.reduce((max, icon) => {
	const longestKeyword = (icon.keywords ?? []).reduce(
		(longest, keyword) => Math.max(longest, keyword.length),
		0,
	);
	return Math.max(max, icon.name.length, longestKeyword);
}, 0);

export const searchIcons = (
	query: string,
	limit: number,
): IconSearchEntry[] => {
	const q = query.trim().toLowerCase();
	if (q.length < MIN_QUERY_LENGTH || q.length > MAX_MATCHABLE_LENGTH) return [];

	const exact: IconSearchEntry[] = [];
	const startsWith: IconSearchEntry[] = [];
	const contains: IconSearchEntry[] = [];

	for (const icon of ICON_CATALOG) {
		const name = icon.name.toLowerCase();
		if (name === q) exact.push(icon);
		else if (name.startsWith(q)) startsWith.push(icon);
		else if (name.includes(q)) contains.push(icon);
	}

	const fuseHits = FUSE.search(q)
		.filter((r) => (r.score ?? 1) < MAX_FUSE_SCORE)
		.map((r) => r.item);

	const seen = new Set<string>();
	const merged: IconSearchEntry[] = [];
	for (const list of [exact, startsWith, contains, fuseHits]) {
		for (const icon of list) {
			const key = `${icon.library}-${icon.name}`;
			if (!seen.has(key)) {
				seen.add(key);
				merged.push(icon);
				if (merged.length >= limit) return merged;
			}
		}
	}
	return merged;
};
