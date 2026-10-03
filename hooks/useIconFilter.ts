"use client";

import {
	createIconSearchIndex,
	MIN_QUERY_LENGTH,
	normalizeQuery,
	type IconSearchIndex,
} from "@animateicons/core/icon-search-engine";
import {
	assertOptions,
	assertString,
	createBoundedCache,
	describeValue,
	type BoundedCache,
} from "@animateicons/core/search-support";
import { isIconNew } from "@/utils/isIconNew";

type Params = {
	icons: IconMeta[];
	category: string;
	query: string;
};

export type IconFilteredItem = IconMeta & {
	isNew: boolean;
	isUpdated: boolean;
};

type Bucket = {
	icons: IconFilteredItem[];
	ordered: readonly IconFilteredItem[];
	index?: IconSearchIndex<IconFilteredItem>;
	results: BoundedCache<readonly IconFilteredItem[]>;
};

type Source = {
	decorated: IconFilteredItem[];
	buckets: Map<string, Bucket>;
};

const PARAM_KEYS: readonly string[] = ["icons", "category", "query"];
const MAX_CACHED_QUERIES = 32;

const rank = (icon: { isNew: boolean; isUpdated: boolean }) =>
	icon.isNew ? 2 : icon.isUpdated ? 1 : 0;

const byFreshness = (a: IconFilteredItem, b: IconFilteredItem) =>
	rank(b) - rank(a);

const decorate = (icon: IconMeta): IconFilteredItem => {
	const isNew = isIconNew(icon.addedAt);
	return { ...icon, isNew, isUpdated: !isNew && isIconNew(icon.updatedAt) };
};

const SOURCES = new WeakMap<IconMeta[], Source>();

const getBucket = (icons: IconMeta[], category: string): Bucket => {
	let source = SOURCES.get(icons);
	if (!source) {
		source = { decorated: icons.map(decorate), buckets: new Map() };
		SOURCES.set(icons, source);
	}
	let bucket = source.buckets.get(category);
	if (!bucket) {
		const list =
			category === "all"
				? source.decorated
				: source.decorated.filter((icon) => icon.category?.includes(category));
		bucket = {
			icons: list,
			ordered: Object.freeze([...list].sort(byFreshness)),
			results: createBoundedCache(MAX_CACHED_QUERIES),
		};
		source.buckets.set(category, bucket);
	}
	return bucket;
};

const searchBucket = (
	bucket: Bucket,
	key: string,
): readonly IconFilteredItem[] => {
	const cached = bucket.results.get(key);
	if (cached) return cached;

	bucket.index ??= createIconSearchIndex(bucket.icons);
	return bucket.results.set(
		key,
		Object.freeze(bucket.index.search(key, { tieBreak: byFreshness })),
	);
};

const validate = (params: unknown): Params => {
	const { icons, category, query } = assertOptions(
		params,
		"useIconSearchFilter",
		"{ icons, category, query }",
		PARAM_KEYS,
	);
	if (!Array.isArray(icons)) {
		throw new TypeError(
			`useIconSearchFilter: icons must be an array of icon metadata, received ${describeValue(icons)}.`,
		);
	}
	assertString(category, "useIconSearchFilter", "category");
	assertString(query, "useIconSearchFilter", "query");
	return { icons, category, query } as Params;
};

export const useIconSearchFilter = (
	params: Params,
): readonly IconFilteredItem[] => {
	const { icons, category, query } = validate(params);
	const bucket = getBucket(icons, category);

	if (query.trim().length < MIN_QUERY_LENGTH) return bucket.ordered;
	return searchBucket(bucket, normalizeQuery(query));
};
