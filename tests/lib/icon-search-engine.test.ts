import {
	createIconSearchIndex,
	MAX_QUERY_LENGTH,
	MIN_QUERY_LENGTH,
	normalizeQuery,
	type SearchableIcon,
} from "@animateicons/core/icon-search-engine";
import { describe, expect, it } from "vitest";
import {
	expectError,
	expectErrorEach,
} from "@/core/__tests__/helpers/expect-error";

const ICONS: SearchableIcon[] = [
	{ name: "files", keywords: ["files", "copy", "documents", "stack"] },
	{ name: "file", keywords: ["file", "document", "page", "blank"] },
	{ name: "file-text", keywords: ["file", "document"] },
	{ name: "file-archive", keywords: ["zip", "compress"] },
	{ name: "folder", keywords: ["directory"] },
	{
		name: "folder-closed",
		keywords: ["folder", "closed", "directory", "files"],
	},
	{ name: "milestone", keywords: ["marker", "signpost", "progress", "goal"] },
	{ name: "bell", keywords: ["alert", "ring"] },
	{ name: "bell-ring", keywords: ["alert"] },
	{ name: "dumbbell", keywords: ["gym", "weight"] },
	{ name: "ellipsis", keywords: ["dots", "more"] },
	{ name: "arrow-up", keywords: ["direction"] },
	{ name: "arrow-up-a-z", keywords: ["sort"] },
	{ name: "move-vertical", keywords: ["arrows", "resize"] },
	{ name: "battery", keywords: ["power"] },
	{ name: "box", keywords: ["package"] },
	{ name: "glass", keywords: ["drink"] },
	{ name: "calendar", keywords: ["date", "schedule"] },
	{ name: "settings", keywords: ["gear", "preferences"] },
	{ name: "home-0-1", keywords: ["house"] },
	{ name: "heart", keywords: ["love"] },
];

const index = createIconSearchIndex(ICONS);
const names = (query: string, options?: Parameters<typeof index.search>[1]) =>
	index.search(query, options).map((icon) => icon.name);

describe("createIconSearchIndex errors", () => {
	it("rejects items that are not an array", () => {
		expectError(
			() => createIconSearchIndex(undefined as never),
			TypeError,
			"createIconSearchIndex: items must be an array of { name, keywords } objects, received undefined.",
		);
		expectError(
			() => createIconSearchIndex({ name: "bell" } as never),
			TypeError,
			"createIconSearchIndex: items must be an array of { name, keywords } objects, received an object.",
		);
		expectError(
			() => createIconSearchIndex("bell" as never),
			TypeError,
			'createIconSearchIndex: items must be an array of { name, keywords } objects, received "bell".',
		);
	});

	it("rejects an item that is not an object and names its position", () => {
		expectError(
			() => createIconSearchIndex([{ name: "bell" }, null as never]),
			TypeError,
			'createIconSearchIndex: items[1] must be an object like { name: "bell", keywords: ["alert"] }, received null.',
		);
		expectError(
			() => createIconSearchIndex(["bell" as never]),
			TypeError,
			'createIconSearchIndex: items[0] must be an object like { name: "bell", keywords: ["alert"] }, received "bell".',
		);
		expectError(
			() => createIconSearchIndex([[] as never]),
			TypeError,
			'createIconSearchIndex: items[0] must be an object like { name: "bell", keywords: ["alert"] }, received an array.',
		);
	});

	it("rejects a missing, empty or non-string name", () => {
		expectError(
			() => createIconSearchIndex([{} as never]),
			TypeError,
			"createIconSearchIndex: items[0].name must be a non-empty string, received undefined.",
		);
		expectError(
			() => createIconSearchIndex([{ name: "" }]),
			TypeError,
			'createIconSearchIndex: items[0].name must be a non-empty string, received "".',
		);
		expectError(
			() => createIconSearchIndex([{ name: 42 as never }]),
			TypeError,
			"createIconSearchIndex: items[0].name must be a non-empty string, received 42.",
		);
	});

	it("rejects a name with nothing to search", () => {
		expectError(
			() => createIconSearchIndex([{ name: "---" }]),
			TypeError,
			'createIconSearchIndex: items[0].name "---" has no letters or digits to search.',
		);
		expectError(
			() => createIconSearchIndex([{ name: "🔥" }]),
			TypeError,
			'createIconSearchIndex: items[0].name "🔥" has no letters or digits to search.',
		);
	});

	it("rejects keywords that are not an array of strings", () => {
		expectError(
			() =>
				createIconSearchIndex([{ name: "bell", keywords: "alert" as never }]),
			TypeError,
			'createIconSearchIndex: items[0].keywords must be an array of strings, received "alert".',
		);
		expectError(
			() =>
				createIconSearchIndex([
					{ name: "bell", keywords: ["alert", 7 as never] },
				]),
			TypeError,
			"createIconSearchIndex: items[0].keywords[1] must be a string, received 7.",
		);
	});

	it("accepts an empty list and items without keywords", () => {
		expect(createIconSearchIndex([]).size).toBe(0);
		expect(createIconSearchIndex([]).search("bell")).toEqual([]);
		expect(
			createIconSearchIndex([{ name: "bell" }]).search("bell"),
		).toHaveLength(1);
	});
});

describe("search errors", () => {
	it("rejects a query that is not a string", () => {
		expectErrorEach(
			[
				[undefined, "undefined"],
				[null, "null"],
				[42, "42"],
				[{}, "an object"],
				[["bell"], "an array"],
				[() => "bell", "a function"],
			],
			(bad) => index.search(bad as never),
			TypeError,
			(shown) => `search: query must be a string, received ${shown}.`,
		);
	});

	it("rejects options that are not an object", () => {
		expectError(
			() => index.search("bell", 5 as never),
			TypeError,
			"search: options must be an object like { limit: 20 }, received 5.",
		);
		expectError(
			() => index.search("bell", [] as never),
			TypeError,
			"search: options must be an object like { limit: 20 }, received an array.",
		);
		expectError(
			() => index.search("bell", null as never),
			TypeError,
			"search: options must be an object like { limit: 20 }, received null.",
		);
	});

	it("rejects an unknown option", () => {
		expectError(
			() => index.search("bell", { max: 5 } as never),
			TypeError,
			'search: unknown option "max". Valid options are "limit" and "tieBreak".',
		);
	});

	it("rejects a bad limit", () => {
		expectErrorEach(
			[
				[0, "0"],
				[-1, "-1"],
				[1.5, "1.5"],
				[NaN, "NaN"],
				[Infinity, "Infinity"],
				["3", '"3"'],
				[null, "null"],
			],
			(bad) => index.search("bell", { limit: bad as never }),
			RangeError,
			(shown) =>
				`search: limit must be a whole number of 1 or more, received ${shown}. Leave it out to get every match.`,
		);
	});

	it("rejects a tieBreak that is not a function", () => {
		expectError(
			() => index.search("bell", { tieBreak: "newest" as never }),
			TypeError,
			'search: tieBreak must be a function like (a, b) => number, received "newest".',
		);
	});

	it("accepts explicit undefined options", () => {
		expect(names("bell", { limit: undefined, tieBreak: undefined })).toEqual(
			names("bell"),
		);
		expect(names("bell", undefined)).toEqual(names("bell"));
	});

	it("checks the options before it looks at the query", () => {
		expectError(
			() => index.search("", { limit: 0 }),
			RangeError,
			"search: limit must be a whole number of 1 or more, received 0. Leave it out to get every match.",
		);
	});
});

describe("ranking", () => {
	it("puts an exact name first, then names that start with the query, then names that contain it", () => {
		expect(names("bell")).toEqual(["bell", "bell-ring", "dumbbell"]);
	});

	it("treats a plural as the same word, right after the literal match", () => {
		const result = names("files");
		expect(result.slice(0, 4)).toEqual([
			"files",
			"file",
			"file-text",
			"file-archive",
		]);
	});

	it("ranks a keyword-only match below every name match", () => {
		const result = names("files");
		expect(result).toContain("folder-closed");
		expect(result.indexOf("folder-closed")).toBeGreaterThan(
			result.indexOf("file-archive"),
		);
	});

	it("does not pull in a look-alike through a one-letter typo when real matches exist", () => {
		expect(names("files")).not.toContain("milestone");
		expect(names("bell")).not.toContain("ellipsis");
	});

	it("keeps catalog order inside the same level", () => {
		expect(names("file").slice(0, 3)).toEqual(["file", "files", "file-text"]);
	});

	it("is deterministic", () => {
		expect(names("fil")).toEqual(names("fil"));
		expect(names("foldr")).toEqual(names("foldr"));
	});

	it("returns the same item objects it was given", () => {
		expect(index.search("bell")[0]).toBe(ICONS[7]);
	});

	it("returns a fresh array on every call", () => {
		const first = index.search("bell");
		first.length = 0;
		expect(index.search("bell")).toHaveLength(3);
	});
});

describe("match levels", () => {
	const items = [
		{ name: "blocks", keywords: [] },
		{ name: "clock", keywords: [] },
		{ name: "user-lock", keywords: [] },
		{ name: "lock-open", keywords: [] },
		{ name: "lock", keywords: [] },
		{ name: "globe-lock", keywords: [] },
	];
	const levels = createIconSearchIndex(items);

	it("puts a match at the start of a word before a match in the middle of a word", () => {
		expect(levels.search("lock").map((i) => i.name)).toEqual([
			"lock",
			"lock-open",
			"user-lock",
			"globe-lock",
			"blocks",
			"clock",
		]);
	});

	it("puts an exact keyword before letters in the middle of a name", () => {
		const edits = createIconSearchIndex([
			{ name: "credit-card", keywords: ["payment"] },
			{ name: "pencil", keywords: ["edit"] },
			{ name: "edit-3", keywords: [] },
		]);
		expect(edits.search("edit").map((i) => i.name)).toEqual([
			"edit-3",
			"pencil",
			"credit-card",
		]);
	});

	it("puts an exact keyword word before a keyword that only starts with the query", () => {
		const stars = createIconSearchIndex([
			{ name: "house", keywords: ["start"] },
			{ name: "sparkles", keywords: ["star"] },
			{ name: "play", keywords: ["starting"] },
			{ name: "star", keywords: [] },
		]);
		expect(stars.search("star").map((i) => i.name)).toEqual([
			"star",
			"sparkles",
			"house",
			"play",
		]);
	});
});

describe("names written without hyphens", () => {
	const items = [
		{ name: "bell-ring", keywords: [] },
		{ name: "file-text", keywords: [] },
		{ name: "file-type", keywords: [] },
		{ name: "arrow-up", keywords: [] },
		{ name: "arrow-up-0-1", keywords: [] },
	];
	const compact = createIconSearchIndex(items);
	const found = (query: string) => compact.search(query).map((i) => i.name);

	it("finds a name typed with its hyphens left out", () => {
		expect(found("bellring")).toEqual(["bell-ring"]);
		expect(found("filetext")).toEqual(["file-text"]);
		expect(found("BELLRING")).toEqual(["bell-ring"]);
	});

	it("finds the start of a name across a hyphen", () => {
		expect(found("bellr")).toEqual(["bell-ring"]);
		expect(found("filet")).toEqual(["file-text", "file-type"]);
		expect(found("arrowup")).toEqual(["arrow-up", "arrow-up-0-1"]);
	});

	it("treats separated words the same way", () => {
		expect(found("file text")).toEqual(["file-text"]);
		expect(found("bell ring")).toEqual(["bell-ring"]);
	});

	it("never lets a hyphen-less match outrank a real match", () => {
		const family = createIconSearchIndex([
			{ name: "file-scan", keywords: [] },
			{ name: "file-search", keywords: [] },
			{ name: "files", keywords: [] },
			{ name: "file", keywords: [] },
		]);
		expect(family.search("files").map((i) => i.name)).toEqual([
			"files",
			"file",
			"file-scan",
			"file-search",
		]);
	});

	it("does not match across a hyphen in the middle of a name", () => {
		expect(found("ellr")).toEqual([]);
		expect(found("lering")).toEqual([]);
	});
});

describe("keyword position", () => {
	it("ranks a keyword that comes first above one that comes later", () => {
		const houses = createIconSearchIndex([
			{ name: "coffee", keywords: ["cup", "drink", "cafe", "home"] },
			{ name: "house", keywords: ["home", "main"] },
			{ name: "sofa", keywords: ["couch", "home"] },
		]);
		expect(houses.search("home").map((i) => i.name)).toEqual([
			"house",
			"sofa",
			"coffee",
		]);
	});

	it("ranks keywords from the icon itself above words from its category", () => {
		const listed = createIconSearchIndex([
			{ name: "cup", keywords: ["drink", "weather"] },
			{ name: "sun", keywords: ["day", "light"] },
			{ name: "rain", keywords: ["weather", "water"] },
		]);
		expect(listed.search("weather").map((i) => i.name)).toEqual([
			"rain",
			"cup",
		]);
	});

	it("still lets a name match beat any keyword match", () => {
		const mixed = createIconSearchIndex([
			{ name: "alpha", keywords: ["home"] },
			{ name: "home-0-1", keywords: ["x"] },
		]);
		expect(mixed.search("home").map((i) => i.name)).toEqual([
			"home-0-1",
			"alpha",
		]);
	});

	it("uses new or updated only to separate equal positions", () => {
		const fresh = new Set(["b"]);
		const byFresh = (a: SearchableIcon, b: SearchableIcon) =>
			Number(fresh.has(b.name)) - Number(fresh.has(a.name));
		const same = createIconSearchIndex([
			{ name: "a", keywords: ["tool", "go"] },
			{ name: "b", keywords: ["tool", "go"] },
			{ name: "c", keywords: ["go", "tool"] },
		]);
		expect(
			same.search("tool", { tieBreak: byFresh }).map((i) => i.name),
		).toEqual(["b", "a", "c"]);
	});
});

describe("typos in names written without hyphens", () => {
	const items = [
		{ name: "bell-ring", keywords: [] },
		{ name: "bell-off", keywords: [] },
		{ name: "file-text", keywords: [] },
	];
	const loose = createIconSearchIndex(items);
	const found = (query: string) => loose.search(query).map((i) => i.name);

	it("fixes one mistake in a hyphen-less name", () => {
		expect(found("belring")).toEqual(["bell-ring"]);
		expect(found("bellrng")).toEqual(["bell-ring"]);
		expect(found("filetxt")).toEqual(["file-text"]);
	});

	it("does not match a name that is too far away", () => {
		expect(found("blrng")).toEqual([]);
		expect(found("xyzring")).toEqual([]);
	});
});

describe("plurals", () => {
	it("handles -s, -ies and -es plurals", () => {
		expect(names("batteries")).toContain("battery");
		expect(names("boxes")).toContain("box");
		expect(names("glasses")[0]).toBe("glass");
		expect(names("arrows")).toContain("arrow-up");
	});

	it("does not strip the s from words that only look plural", () => {
		expect(names("glass")[0]).toBe("glass");
		expect(names("settings")[0]).toBe("settings");
	});

	it("finds a keyword written as a plural", () => {
		expect(names("arrows")).toContain("move-vertical");
	});
});

describe("several words and separators", () => {
	it("matches the words in any order", () => {
		expect(names("arrow up")).toContain("arrow-up");
		expect(names("up arrow")).toContain("arrow-up");
	});

	it("treats space, hyphen, underscore and other punctuation the same", () => {
		const expected = names("arrow up");
		for (const query of [
			"arrow-up",
			"arrow_up",
			"arrow,up",
			"arrow.up",
			"  arrow   up  ",
			"arrow\tup",
			"arrow\nup",
			"(arrow) [up]",
		]) {
			expect(names(query)).toEqual(expected);
		}
	});

	it("requires every word to match", () => {
		expect(names("arrow zebra")).toEqual([]);
	});

	it("finds names with digits and one-letter words", () => {
		expect(names("home 0 1")).toEqual(["home-0-1"]);
		expect(names("a z")).toContain("arrow-up-a-z");
		expect(names("0-1")).toContain("home-0-1");
	});

	it("only matches a one-letter word exactly", () => {
		expect(names("arrow a")).toEqual(["arrow-up-a-z"]);
	});
});

describe("keywords", () => {
	it("matches a keyword by prefix from three letters", () => {
		expect(names("sign")).toContain("milestone");
		expect(names("gea")).toContain("settings");
	});

	it("needs an exact word for a two-letter keyword match", () => {
		expect(names("go")).not.toContain("milestone");
	});

	it("does not match inside a keyword", () => {
		expect(names("gnpo")).not.toContain("milestone");
	});
});

describe("typos", () => {
	it("fixes one wrong letter, a missing letter and an extra letter", () => {
		expect(names("calender")[0]).toBe("calendar");
		expect(names("foldr")).toContain("folder");
		expect(names("hearrt")).toContain("heart");
	});

	it("counts a swapped pair of letters as one mistake", () => {
		expect(names("calendra")[0]).toBe("calendar");
		expect(names("setitngs")[0]).toBe("settings");
	});

	it("allows two mistakes on long words", () => {
		expect(names("preferenses")).toContain("settings");
		expect(names("prefernses")).toContain("settings");
	});

	it("allows no typo on a word of three letters or fewer", () => {
		expect(names("hxa")).toEqual([]);
		expect(names("gxm")).toEqual([]);
	});

	it("allows one typo on a word of four to seven letters, not two", () => {
		expect(names("hert")).toContain("heart");
		expect(names("hxrt")).toEqual([]);
	});

	it("only looks for typos when nothing else matched", () => {
		expect(names("fil")).not.toContain("folder");
		expect(names("bel")).toEqual(["bell", "bell-ring", "dumbbell"]);
	});

	it("ranks fewer mistakes first, then name matches over keyword matches", () => {
		const items = [
			{ name: "zebra", keywords: ["horse"] },
			{ name: "alpha", keywords: ["zebre"] },
			{ name: "zebre", keywords: [] },
		];
		const typoIndex = createIconSearchIndex(items);
		expect(typoIndex.search("zebro").map((i) => i.name)).toEqual([
			"zebra",
			"zebre",
			"alpha",
		]);
	});

	it("needs every word of a multi-word query to match, typos included", () => {
		expect(names("arow up")).toContain("arrow-up");
		expect(names("arow zebra")).toEqual([]);
	});

	it("never matches a name through letters that are not there", () => {
		expect(names("qqqqq")).toEqual([]);
		expect(names("zzzzzzzz")).toEqual([]);
	});
});

describe("input handling", () => {
	it("ignores case and surrounding spaces", () => {
		expect(names("  BeLL ")).toEqual(names("bell"));
	});

	it("ignores accents and full-width letters", () => {
		expect(names("calendár")[0]).toBe("calendar");
		expect(names("CALENDÄR")[0]).toBe("calendar");
		expect(names("ｆｉｌｅ")[0]).toBe("file");
		expect(names("İstanbul")).toEqual([]);
	});

	it("returns nothing when there is nothing to search", () => {
		for (const query of [
			"",
			" ",
			"   ",
			"\n\t",
			"-",
			"--",
			"!!",
			"?",
			"…",
			"🔥",
			"🔥🔥🔥",
			"猫",
			"ключ",
			"ß",
		]) {
			expect(names(query)).toEqual([]);
		}
	});

	it("returns nothing for a single character", () => {
		expect(names("b")).toEqual([]);
		expect(names("b!")).toEqual([]);
		expect(MIN_QUERY_LENGTH).toBe(2);
	});

	it("never throws on regex characters, quotes or markup", () => {
		for (const query of [
			"(",
			"[",
			".*",
			"\\",
			"^$",
			"a{2,}",
			"+++",
			"(?<x>",
			"<script>",
			"'; DROP TABLE",
			"%00",
			"\u0000",
			"\ud800",
			"a​b",
		]) {
			expect(() => index.search(query)).not.toThrow();
		}
		expect(names("(bell)")).toEqual(names("bell"));
	});

	it("is not fooled by names that exist on every object", () => {
		for (const query of [
			"constructor",
			"__proto__",
			"toString",
			"hasOwnProperty",
			"prototype",
			"valueOf",
		]) {
			expect(names(query)).toEqual([]);
		}
	});

	it("returns nothing for a query longer than any icon word", () => {
		expect(names("a".repeat(50))).toEqual([]);
		expect(names("x".repeat(MAX_QUERY_LENGTH + 1))).toEqual([]);
		expect(names("bell ".repeat(100))).toEqual([]);
	});

	it("returns nothing for a query with too many words", () => {
		expect(names("a b c d e f g h i")).toEqual([]);
	});

	it("handles very large input without slowing down", () => {
		const start = performance.now();
		index.search("x".repeat(1_000_000));
		index.search("bell ".repeat(200_000));
		index.search("é".repeat(100_000));
		expect(performance.now() - start).toBeLessThan(100);
	});

	it("stays fast when every typo candidate has to be checked", () => {
		const big = createIconSearchIndex(
			Array.from({ length: 2000 }, (_, i) => ({
				name: `icon-name-${i}`,
				keywords: ["alpha", "bravo", "charlie", "delta", "echo"],
			})),
		);
		const start = performance.now();
		for (let i = 0; i < 20; i++) big.search("qwertyuiop asdfghjk");
		expect(performance.now() - start).toBeLessThan(500);
	});
});

describe("limit and tieBreak", () => {
	it("returns at most the limit", () => {
		expect(names("file", { limit: 2 })).toHaveLength(2);
		expect(names("file", { limit: 1 })).toEqual(["file"]);
		expect(names("file", { limit: 999 })).toEqual(names("file"));
	});

	it("applies the limit after ranking, not before", () => {
		expect(names("bell", { limit: 1 })).toEqual(["bell"]);
	});

	it("uses tieBreak only inside the same level", () => {
		const fresh = new Set(["bell-ring"]);
		const byFresh = (a: SearchableIcon, b: SearchableIcon) =>
			Number(fresh.has(b.name)) - Number(fresh.has(a.name));
		expect(names("bell", { tieBreak: byFresh })).toEqual([
			"bell",
			"bell-ring",
			"dumbbell",
		]);
		const items = [
			{ name: "bell-off", keywords: [] },
			{ name: "bell-ring", keywords: [] },
			{ name: "bell-dot", keywords: [] },
		];
		const small = createIconSearchIndex(items);
		expect(
			small.search("bell", { tieBreak: byFresh }).map((i) => i.name),
		).toEqual(["bell-ring", "bell-off", "bell-dot"]);
	});

	it("does not use tieBreak to reorder typo matches", () => {
		const items = [
			{ name: "folder", keywords: [] },
			{ name: "foldar", keywords: [] },
		];
		const small = createIconSearchIndex(items);
		const reverse = () => -1;
		expect(
			small.search("foldr", { tieBreak: reverse }).map((i) => i.name),
		).toEqual(["folder", "foldar"]);
	});

	it("ignores a tieBreak that returns NaN", () => {
		expect(names("file", { tieBreak: () => NaN })).toEqual(names("file"));
	});

	it("lets an error from tieBreak through", () => {
		expect(() =>
			names("file", {
				tieBreak: () => {
					throw new Error("boom");
				},
			}),
		).toThrow("boom");
	});
});

describe("index", () => {
	it("keeps duplicate names", () => {
		const twins = createIconSearchIndex([
			{ name: "eye", keywords: ["lucide"] },
			{ name: "eye", keywords: ["huge"] },
		]);
		expect(twins.size).toBe(2);
		expect(twins.search("eye")).toHaveLength(2);
	});

	it("is a snapshot, so changing the original list afterwards does nothing", () => {
		const list: SearchableIcon[] = [{ name: "bell" }];
		const snap = createIconSearchIndex(list);
		list.push({ name: "bell-ring" });
		list[0] = { name: "other" };
		expect(snap.size).toBe(1);
		expect(snap.search("bell").map((i) => i.name)).toEqual(["bell"]);
	});

	it("reports its size", () => {
		expect(index.size).toBe(ICONS.length);
	});
});

describe("normalizeQuery", () => {
	it("turns every spelling of a query into one key", () => {
		for (const query of [
			"arrow up",
			"Arrow-Up",
			"  arrow_up ",
			"(arrow) [up]",
			"ARROW\tUP",
		]) {
			expect(normalizeQuery(query)).toBe("arrow-up");
		}
		expect(normalizeQuery("calendár")).toBe("calendar");
		expect(normalizeQuery("ｆｉｌｅ")).toBe("file");
	});

	it("returns an empty key when there is nothing to search", () => {
		for (const query of ["", "  ", "!!", "🔥", "猫"]) {
			expect(normalizeQuery(query)).toBe("");
		}
		expect(normalizeQuery("x".repeat(MAX_QUERY_LENGTH + 1))).toBe("");
		expect(normalizeQuery("a b c d e f g h i")).toBe("");
	});

	it("gives the same search results as the original query", () => {
		for (const query of [
			"Bell",
			" arrow  up ",
			"files",
			"calendár",
			"foldr",
			"(bell)",
			"x".repeat(300),
			"a b c d e f g h i",
			"🔥",
			"a",
			"a!",
			"0-1",
			"constructor",
		]) {
			expect(names(normalizeQuery(query))).toEqual(names(query));
		}
	});

	it("rejects a query that is not a string", () => {
		expectError(
			() => normalizeQuery(undefined as never),
			TypeError,
			"normalizeQuery: query must be a string, received undefined.",
		);
	});
});
