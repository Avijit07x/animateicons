import {
	createIconSearchIndex,
	normalizeQuery,
	type IconSearchIndex,
} from "./icon-search-engine";
import {
	assertLimit,
	assertOptions,
	assertString,
	describeValue,
	isObject,
} from "./search-support";
import type { Catalog, CatalogIcon, IconLibrary } from "./types";

export interface SearchOptions {
	library?: IconLibrary;
	limit?: number;
}

type Entry = {
	name: string;
	keywords: string[];
	icon: CatalogIcon;
};

type Pool = {
	size: number;
	icons: CatalogIcon[];
	index?: IconSearchIndex<Entry>;
};

const DEFAULT_LIMIT = 20;
const OPTION_KEYS: readonly string[] = ["library", "limit"];
const POOLS = new WeakMap<CatalogIcon[], Map<string, Pool>>();
const FILE_EXTENSION = /\.(?:tsx|ts|jsx|js|json)$/i;
const CAMEL_BOUNDARY = /([a-z0-9])([A-Z])/g;
const ICON_SUFFIX = /[\s_-]+icons?$/i;

const textList = (value: unknown): string[] => {
	if (typeof value === "string") return [value];
	if (!Array.isArray(value)) return [];
	return value.filter((item): item is string => typeof item === "string");
};

const getPool = (icons: CatalogIcon[], library?: string): Pool => {
	let pools = POOLS.get(icons);
	if (!pools) {
		pools = new Map();
		POOLS.set(icons, pools);
	}
	const key = library ?? "";
	let pool = pools.get(key);
	if (!pool || pool.size !== icons.length) {
		pool = {
			size: icons.length,
			icons: library
				? icons.filter((icon) => icon?.library === library)
				: icons.slice(),
		};
		pools.set(key, pool);
	}
	return pool;
};

const getIndex = (pool: Pool): IconSearchIndex<Entry> => {
	if (!pool.index) {
		const entries: Entry[] = [];
		for (const icon of pool.icons) {
			if (typeof icon?.name !== "string" || normalizeQuery(icon.name) === "") {
				continue;
			}
			entries.push({
				name: icon.name,
				keywords: [...textList(icon.keywords), ...textList(icon.category)],
				icon,
			});
		}
		pool.index = createIconSearchIndex(entries);
	}
	return pool.index;
};

const cleanQuery = (query: string): string => {
	const cleaned = query
		.replace(FILE_EXTENSION, "")
		.replace(CAMEL_BOUNDARY, "$1 $2")
		.replace(ICON_SUFFIX, "");
	return cleaned.trim() === "" ? query : cleaned;
};

const matchLetter = (pool: Pool, key: string, limit: number) => {
	const exact: CatalogIcon[] = [];
	const starts: CatalogIcon[] = [];
	const words: CatalogIcon[] = [];
	for (const icon of pool.icons) {
		const name = typeof icon?.name === "string" ? icon.name.toLowerCase() : "";
		if (!name) continue;
		if (name === key) exact.push(icon);
		else if (name.startsWith(key)) starts.push(icon);
		else if (name.split(/[^a-z0-9]+/).includes(key)) words.push(icon);
	}
	return [...exact, ...starts, ...words].slice(0, limit);
};

export function searchIcons(
	catalog: Catalog,
	query: string,
	opts: SearchOptions = {},
): CatalogIcon[] {
	if (!isObject(catalog) || !Array.isArray(catalog.icons)) {
		throw new TypeError(
			`searchIcons: catalog must be an object with an "icons" array, received ${describeValue(catalog)}.`,
		);
	}
	assertString(query, "searchIcons", "query");
	assertOptions(opts, "searchIcons", "{ limit: 20 }", OPTION_KEYS);
	const { library, limit = DEFAULT_LIMIT } = opts;
	if (library !== undefined && typeof library !== "string") {
		throw new TypeError(
			`searchIcons: library must be "lucide" or "huge", received ${describeValue(library)}.`,
		);
	}
	assertLimit(limit, "searchIcons");

	const pool = getPool(catalog.icons, library);
	const trimmed = query.trim();
	if (!trimmed) return pool.icons.slice(0, limit);

	const key = normalizeQuery(cleanQuery(trimmed));
	if (key === "") return [];
	if (key.length === 1) return matchLetter(pool, key, limit);

	return getIndex(pool)
		.search(key, { limit })
		.map((entry) => entry.icon);
}
