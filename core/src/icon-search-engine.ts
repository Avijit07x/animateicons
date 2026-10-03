import {
	assertLimit,
	assertOptions,
	assertString,
	describeValue,
	isObject,
} from "./search-support";

export type SearchableIcon = {
	name: string;
	keywords?: readonly string[];
};

type SearchOptions<T> = {
	limit?: number;
	tieBreak?: (a: T, b: T) => number;
};

export type IconSearchIndex<T extends SearchableIcon> = {
	readonly size: number;
	search: (query: string, options?: SearchOptions<T>) => T[];
};

type Prepared<T> = {
	item: T;
	index: number;
	name: string;
	compact: string;
	nameWords: string[];
	keywordWords: string[];
};

type Variant = {
	tokens: string[];
	joined: string;
	compact: string;
};

export const MIN_QUERY_LENGTH = 2;
export const MAX_QUERY_LENGTH = 200;

const MAX_QUERY_TOKENS = 8;
const MAX_TYPO_DISTANCE = 2;
const MIN_KEYWORD_PREFIX = 3;
const MAX_KEYWORD_POSITION = 99;
const TYPO_FLOOR = 14;
const SEARCH_OPTION_KEYS: readonly string[] = ["limit", "tieBreak"];
const DIACRITICS = /[\u0300-\u036f]/g;
const NON_ALPHANUMERIC = /[^a-z0-9]+/;
const COMPOUND_PLURAL = /(?:ss|x|ch|sh|z)es$/;

const tokenize = (value: string): string[] =>
	value
		.toLowerCase()
		.normalize("NFKD")
		.replace(DIACRITICS, "")
		.toLowerCase()
		.split(NON_ALPHANUMERIC)
		.filter(Boolean);

const singularize = (word: string): string => {
	if (word.length < 4) return word;
	if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
	if (COMPOUND_PLURAL.test(word)) return word.slice(0, -2);
	if (
		word.endsWith("s") &&
		!word.endsWith("ss") &&
		!word.endsWith("us") &&
		!word.endsWith("is")
	) {
		return word.slice(0, -1);
	}
	return word;
};

const allowedDistance = (length: number): number =>
	length <= 3 ? 0 : length <= 7 ? 1 : MAX_TYPO_DISTANCE;

const SCRATCH_SIZE = 64;
let scratch = [
	new Int32Array(SCRATCH_SIZE),
	new Int32Array(SCRATCH_SIZE),
	new Int32Array(SCRATCH_SIZE),
];

const withinDistance = (a: string, b: string, max: number): number => {
	if (Math.abs(a.length - b.length) > max) return Infinity;
	if (b.length + 1 > scratch[0].length) {
		scratch = [0, 1, 2].map(() => new Int32Array(b.length + 1));
	}
	let beforePrevious = scratch[0];
	let previous = scratch[1];
	let current = scratch[2];
	for (let j = 0; j <= b.length; j++) previous[j] = j;
	for (let i = 1; i <= a.length; i++) {
		current[0] = i;
		let rowMinimum = i;
		const charA = a.charCodeAt(i - 1);
		for (let j = 1; j <= b.length; j++) {
			const charB = b.charCodeAt(j - 1);
			let value = previous[j - 1] + (charA === charB ? 0 : 1);
			const deletion = previous[j] + 1;
			if (deletion < value) value = deletion;
			const insertion = current[j - 1] + 1;
			if (insertion < value) value = insertion;
			if (
				i > 1 &&
				j > 1 &&
				charA === b.charCodeAt(j - 2) &&
				a.charCodeAt(i - 2) === charB
			) {
				const swap = beforePrevious[j - 2] + 1;
				if (swap < value) value = swap;
			}
			current[j] = value;
			if (value < rowMinimum) rowMinimum = value;
		}
		if (rowMinimum > max) return Infinity;
		const spare = beforePrevious;
		beforePrevious = previous;
		previous = current;
		current = spare;
	}
	const result = previous[b.length];
	return result <= max ? result : Infinity;
};

const nameWordMatches = (word: string, token: string): boolean =>
	token.length === 1 ? word === token : word.startsWith(token);

const keywordWordMatches = (word: string, token: string): boolean =>
	token.length < MIN_KEYWORD_PREFIX ? word === token : word.startsWith(token);

const prepare = <T extends SearchableIcon>(
	item: T,
	index: number,
): Prepared<T> => {
	const label = `items[${index}]`;
	if (!isObject(item)) {
		throw new TypeError(
			`createIconSearchIndex: ${label} must be an object like { name: "bell", keywords: ["alert"] }, received ${describeValue(item)}.`,
		);
	}
	if (typeof item.name !== "string" || item.name === "") {
		throw new TypeError(
			`createIconSearchIndex: ${label}.name must be a non-empty string, received ${describeValue(item.name)}.`,
		);
	}
	const nameWords = tokenize(item.name);
	if (nameWords.length === 0) {
		throw new TypeError(
			`createIconSearchIndex: ${label}.name ${describeValue(item.name)} has no letters or digits to search.`,
		);
	}
	const { keywords } = item;
	if (keywords !== undefined && !Array.isArray(keywords)) {
		throw new TypeError(
			`createIconSearchIndex: ${label}.keywords must be an array of strings, received ${describeValue(keywords)}.`,
		);
	}
	const keywordWords = new Set<string>();
	(keywords ?? []).forEach((keyword: unknown, k: number) => {
		if (typeof keyword !== "string") {
			throw new TypeError(
				`createIconSearchIndex: ${label}.keywords[${k}] must be a string, received ${describeValue(keyword)}.`,
			);
		}
		for (const word of tokenize(keyword)) keywordWords.add(word);
	});
	return {
		item,
		index,
		name: nameWords.join("-"),
		compact: nameWords.join(""),
		nameWords,
		keywordWords: [...keywordWords],
	};
};

const keywordPosition = (
	entry: Prepared<unknown>,
	tokens: string[],
	matchesName: (token: string) => boolean,
	exact: boolean,
): number => {
	let position = 0;
	for (const token of tokens) {
		if (matchesName(token)) continue;
		let at = -1;
		for (let i = 0; i < entry.keywordWords.length; i++) {
			const word = entry.keywordWords[i];
			if (exact ? word === token : keywordWordMatches(word, token)) {
				at = i;
				break;
			}
		}
		if (at === -1) return -1;
		if (at > position) position = Math.min(at, MAX_KEYWORD_POSITION);
	}
	return position;
};

const matchLevel = (
	entry: Prepared<unknown>,
	{ tokens, joined, compact }: Variant,
	includeKeywords: boolean,
): number => {
	if (entry.name === joined) return 0;
	if (entry.name.startsWith(joined)) return 1;
	const matchesName = (token: string) =>
		entry.nameWords.some((word) => nameWordMatches(word, token));
	if (tokens.every(matchesName)) return 2;
	if (includeKeywords) {
		const position = keywordPosition(entry, tokens, matchesName, true);
		if (position !== -1) return 3 + position / 1000;
	}
	if (entry.name.includes(joined)) return 4;
	if (includeKeywords) {
		const position = keywordPosition(entry, tokens, matchesName, false);
		if (position !== -1) return 5 + position / 1000;
	}
	if (
		includeKeywords &&
		(entry.compact === compact || entry.compact.startsWith(compact))
	) {
		return 6;
	}
	return -1;
};

const scoreEntry = (entry: Prepared<unknown>, variants: Variant[]): number => {
	let best = Infinity;
	variants.forEach((variant, i) => {
		const level = matchLevel(entry, variant, i === 0);
		if (level !== -1) best = Math.min(best, level * 2 + i);
	});
	return best;
};

type CostCache = { name: Map<string, number>; keyword: Map<string, number> };

const wordCost = (
	word: string,
	token: string,
	distance: number,
	isName: boolean,
	cache: Map<string, number>,
): number => {
	let cost = cache.get(word);
	if (cost === undefined) {
		cost =
			word === token ||
			(isName ? nameWordMatches(word, token) : keywordWordMatches(word, token))
				? 0
				: distance > 0
					? withinDistance(word, token, distance)
					: Infinity;
		cache.set(word, cost);
	}
	return cost;
};

const typoScore = (
	entry: Prepared<unknown>,
	tokens: string[],
	distances: number[],
	caches: CostCache[],
	compactQuery: string,
): number => {
	const compactCost = withinDistance(
		entry.compact,
		compactQuery,
		allowedDistance(compactQuery.length),
	);
	let total = 0;
	let usedKeyword = false;
	for (let t = 0; t < tokens.length; t++) {
		const token = tokens[t];
		let best = Infinity;
		for (const word of entry.nameWords) {
			const cost = wordCost(word, token, distances[t], true, caches[t].name);
			if (cost < best) best = cost;
		}
		if (best === Infinity) {
			for (const word of entry.keywordWords) {
				const cost = wordCost(
					word,
					token,
					distances[t],
					false,
					caches[t].keyword,
				);
				if (cost < best) best = cost;
			}
			if (best !== Infinity) usedKeyword = true;
		}
		if (best === Infinity) {
			total = Infinity;
			break;
		}
		total += best;
	}
	if (compactCost <= total) return TYPO_FLOOR + compactCost * 2;
	if (total === Infinity) return Infinity;
	return TYPO_FLOOR + total * 2 + (usedKeyword ? 1 : 0);
};

export const normalizeQuery = (query: string): string => {
	assertString(query, "normalizeQuery", "query");
	if (query.length > MAX_QUERY_LENGTH) return "";
	const tokens = tokenize(query);
	return tokens.length > MAX_QUERY_TOKENS ? "" : tokens.join("-");
};

const parseOptions = <T>(
	options: unknown,
): { limit: number; tieBreak?: (a: T, b: T) => number } => {
	if (options === undefined) return { limit: Infinity };
	const { limit, tieBreak } = assertOptions(
		options,
		"search",
		"{ limit: 20 }",
		SEARCH_OPTION_KEYS,
	);
	if (limit !== undefined) {
		assertLimit(limit, "search", "Leave it out to get every match.");
	}
	if (tieBreak !== undefined && typeof tieBreak !== "function") {
		throw new TypeError(
			`search: tieBreak must be a function like (a, b) => number, received ${describeValue(tieBreak)}.`,
		);
	}
	return {
		limit: (limit as number | undefined) ?? Infinity,
		tieBreak: tieBreak as ((a: T, b: T) => number) | undefined,
	};
};

export const createIconSearchIndex = <T extends SearchableIcon>(
	items: readonly T[],
): IconSearchIndex<T> => {
	if (!Array.isArray(items as unknown)) {
		throw new TypeError(
			`createIconSearchIndex: items must be an array of { name, keywords } objects, received ${describeValue(items)}.`,
		);
	}

	const entries = items.map((item, index) => prepare(item, index));

	let maxWordLength = 0;
	for (const entry of entries) {
		maxWordLength = Math.max(maxWordLength, entry.compact.length);
		for (const word of entry.nameWords) {
			maxWordLength = Math.max(maxWordLength, word.length);
		}
		for (const word of entry.keywordWords) {
			maxWordLength = Math.max(maxWordLength, word.length);
		}
	}

	const search = (query: string, options?: SearchOptions<T>): T[] => {
		assertString(query, "search", "query");
		const { limit, tieBreak } = parseOptions<T>(options);

		if (query.length > MAX_QUERY_LENGTH) return [];
		const tokens = tokenize(query);
		if (tokens.length === 0 || tokens.length > MAX_QUERY_TOKENS) return [];
		const joined = tokens.join("-");
		if (joined.length < MIN_QUERY_LENGTH) return [];
		if (
			tokens.some((token) => token.length > maxWordLength + MAX_TYPO_DISTANCE)
		) {
			return [];
		}

		const singular = tokens.map(singularize);
		const variants: Variant[] = [{ tokens, joined, compact: tokens.join("") }];
		if (singular.some((token, i) => token !== tokens[i])) {
			variants.push({
				tokens: singular,
				joined: singular.join("-"),
				compact: singular.join(""),
			});
		}

		const matches: { entry: Prepared<T>; score: number }[] = [];
		for (const entry of entries) {
			const score = scoreEntry(entry, variants);
			if (score !== Infinity) matches.push({ entry, score });
		}

		if (matches.length === 0) {
			const distances = tokens.map((token) => allowedDistance(token.length));
			const caches: CostCache[] = tokens.map(() => ({
				name: new Map(),
				keyword: new Map(),
			}));
			for (const entry of entries) {
				const score = typoScore(
					entry,
					tokens,
					distances,
					caches,
					tokens.join(""),
				);
				if (score !== Infinity) matches.push({ entry, score });
			}
		}

		matches.sort(
			(a, b) =>
				a.score - b.score ||
				(tieBreak && a.score < TYPO_FLOOR
					? tieBreak(a.entry.item, b.entry.item) || 0
					: 0) ||
				a.entry.index - b.entry.index,
		);

		return matches.slice(0, limit).map(({ entry }) => entry.item);
	};

	return { size: entries.length, search };
};
