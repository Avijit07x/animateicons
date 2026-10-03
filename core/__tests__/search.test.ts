import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { searchIcons } from "../src/index";
import type { Catalog, CatalogIcon, IconLibrary } from "../src/types";
import { expectError, expectErrorEach } from "./helpers/expect-error";

const CATALOG_FILE = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"../../public/r/catalog.json",
);

const real: Catalog = JSON.parse(fs.readFileSync(CATALOG_FILE, "utf8"));

const make = (
	name: string,
	library: IconLibrary = "lucide",
	keywords: string[] = [],
	category: string[] = [],
): CatalogIcon => {
	const prefix = library === "lucide" ? "lu" : "hu";
	return {
		name,
		library,
		prefix,
		registryName: `${prefix}-${name}`,
		addedAt: null,
		category,
		keywords,
		url: `https://example.com/r/${prefix}-${name}.json`,
	};
};

const catalogOf = (icons: CatalogIcon[]): Catalog => ({
	version: 1,
	registryBase: "https://example.com/r",
	total: icons.length,
	libraries: {
		lucide: icons.filter((i) => i?.library === "lucide").length,
		huge: icons.filter((i) => i?.library === "huge").length,
	},
	icons,
});

const found = (
	catalog: Catalog,
	query: string,
	opts?: Parameters<typeof searchIcons>[2],
) => searchIcons(catalog, query, opts).map((icon) => icon.registryName);

describe("searchIcons on the real catalog", () => {
	it("puts the file family first for 'files' and leaves noise out", () => {
		const result = found(real, "files", { library: "lucide", limit: 200 });
		expect(result.slice(0, 2)).toEqual(["lu-files", "lu-file"]);
		expect(result).not.toContain("lu-milestone");
	});

	it("leaves look-alikes out", () => {
		const cart = found(real, "cart", { limit: 200 });
		expect(cart).toContain("lu-shopping-cart");
		expect(cart.some((name) => name.includes("chart"))).toBe(false);
		expect(found(real, "house", { limit: 200 })).not.toContain("lu-mouse");
	});

	it("keeps a first keyword above a category match", () => {
		expect(found(real, "home", { limit: 6 })).toContain("lu-house");
	});

	it("fixes typos", () => {
		expect(found(real, "calender", { limit: 5 })).toContain("hu-calendar-0-1");
		expect(found(real, "foldr", { limit: 5 })[0]).toMatch(/folder/);
		expect(found(real, "heartt", { limit: 3 })).toContain("hu-heart");
	});

	it("finds names typed without hyphens or with a mistake", () => {
		for (const query of ["bellring", "belring", "bell ring", "BellRing"]) {
			expect(found(real, query, { limit: 5 })).toEqual(
				expect.arrayContaining(["lu-bell-ring", "hu-bell-ring"]),
			);
		}
	});

	it("understands file names and component names", () => {
		for (const query of [
			"bell-ring-icon",
			"bell-ring-icon.tsx",
			"bell-ring.tsx",
			"BellRingIcon",
			"bell ring icon",
		]) {
			expect(found(real, query, { limit: 5 })).toEqual(
				expect.arrayContaining(["lu-bell-ring", "hu-bell-ring"]),
			);
		}
	});

	it("finds several words in any order", () => {
		expect(found(real, "arrow up", { limit: 30 })).toContain("lu-arrow-up");
		expect(found(real, "up arrow", { limit: 30 })).toContain("lu-arrow-up");
	});

	it("finds a keyword and a category", () => {
		expect(found(real, "notification")).toContain("hu-notification");
		expect(found(real, "weather", { library: "lucide", limit: 60 })).toContain(
			"lu-cloud",
		);
	});

	it("finds a one-letter icon and the icons built on it", () => {
		const result = found(real, "x", { limit: 50 });
		expect(result[0]).toBe("lu-x");
		expect(result).toContain("lu-file-x");
		expect(result).toContain("lu-circle-x");
	});

	it("lists icons that start with a single letter", () => {
		const result = searchIcons(real, "a", { limit: 30 });
		expect(result.length).toBe(30);
		expect(result.every((icon) => /^a|-a(-|$)/.test(icon.name))).toBe(true);
	});

	it("finds every icon by its own name", () => {
		const misses = real.icons
			.filter((icon) => {
				const result = searchIcons(real, icon.name, { limit: 10 });
				return !result.some((r) => r.registryName === icon.registryName);
			})
			.map((icon) => icon.registryName);
		expect(misses).toEqual([]);
	});

	it("filters by library", () => {
		const huge = searchIcons(real, "activity", { library: "huge" });
		expect(huge.length).toBeGreaterThan(0);
		expect(huge.every((icon) => icon.library === "huge")).toBe(true);
		const lucide = searchIcons(real, "heart", {
			library: "lucide",
			limit: 100,
		});
		expect(lucide.every((icon) => icon.library === "lucide")).toBe(true);
	});

	it("returns nothing for words that match nothing", () => {
		expect(searchIcons(real, "zzzzzz")).toEqual([]);
		expect(searchIcons(real, "🔥")).toEqual([]);
		expect(searchIcons(real, "x".repeat(5000))).toEqual([]);
	});

	it("answers quickly even for a query that matches nothing", () => {
		const start = performance.now();
		for (let i = 0; i < 50; i++) searchIcons(real, "qwertyuiop", { limit: 20 });
		expect(performance.now() - start).toBeLessThan(1500);
	});
});

describe("searchIcons options", () => {
	const small = catalogOf([
		make("alpha"),
		make("bravo"),
		make("charlie"),
		make("delta"),
	]);

	it("returns the head for an empty or blank query", () => {
		expect(found(small, "", { limit: 2 })).toEqual(["lu-alpha", "lu-bravo"]);
		expect(found(small, "   ", { limit: 3 })).toEqual([
			"lu-alpha",
			"lu-bravo",
			"lu-charlie",
		]);
		expect(found(small, "\n\t")).toHaveLength(4);
	});

	it("returns at most 20 by default", () => {
		const many = catalogOf(
			Array.from({ length: 50 }, (_, i) => make(`item-${i}`)),
		);
		expect(searchIcons(many, "")).toHaveLength(20);
		expect(searchIcons(many, "item")).toHaveLength(20);
		expect(searchIcons(many, "item", { limit: 50 })).toHaveLength(50);
		expect(searchIcons(many, "item", { limit: 5000 })).toHaveLength(50);
	});

	it("filters the head by library", () => {
		const mixed = catalogOf([
			make("one", "lucide"),
			make("two", "huge"),
			make("three", "huge"),
		]);
		expect(found(mixed, "", { library: "huge" })).toEqual([
			"hu-two",
			"hu-three",
		]);
		expect(found(mixed, "", { library: "huge", limit: 1 })).toEqual(["hu-two"]);
	});

	it("returns nothing for a library that does not exist", () => {
		expect(
			searchIcons(small, "alpha", { library: "nope" as IconLibrary }),
		).toEqual([]);
		expect(searchIcons(small, "", { library: "nope" as IconLibrary })).toEqual(
			[],
		);
	});

	it("searches keywords and categories", () => {
		const catalog = catalogOf([
			make("sun", "lucide", ["day", "light"], ["Weather"]),
			make("anchor", "lucide", ["ship"], ["Travel"]),
		]);
		expect(found(catalog, "ship")).toEqual(["lu-anchor"]);
		expect(found(catalog, "weather")).toEqual(["lu-sun"]);
		expect(found(catalog, "travel")).toEqual(["lu-anchor"]);
	});

	it("returns a new array each time", () => {
		const first = searchIcons(small, "alpha");
		first.length = 0;
		expect(searchIcons(small, "alpha")).toHaveLength(1);
		const head = searchIcons(small, "");
		head.length = 0;
		expect(searchIcons(small, "")).toHaveLength(4);
	});

	it("notices icons added to the catalog after the first search", () => {
		const live = catalogOf([make("alpha")]);
		expect(found(live, "bravo")).toEqual([]);
		live.icons.push(make("bravo"));
		expect(found(live, "bravo")).toEqual(["lu-bravo"]);
	});

	it("gives the same answer on every call", () => {
		expect(found(real, "foldr")).toEqual(found(real, "foldr"));
		expect(found(real, "files")).toEqual(found(real, "FILES "));
	});
});

describe("searchIcons with an odd catalog", () => {
	it("skips entries it cannot search and keeps the rest", () => {
		const odd = catalogOf([
			make("alpha"),
			null as unknown as CatalogIcon,
			{ ...make("bravo"), name: undefined as unknown as string },
			{ ...make("charlie"), name: 42 as unknown as string },
			{ ...make("delta"), name: "---" },
			{ ...make("echo"), keywords: undefined as unknown as string[] },
			{
				...make("foxtrot"),
				keywords: [1, null, "golf"] as unknown as string[],
			},
			{ ...make("hotel"), category: "Places" as unknown as string[] },
			{ ...make("india"), category: undefined as unknown as string[] },
		]);
		expect(() => searchIcons(odd, "alpha")).not.toThrow();
		expect(found(odd, "alpha")).toEqual(["lu-alpha"]);
		expect(found(odd, "echo")).toEqual(["lu-echo"]);
		expect(found(odd, "golf")).toEqual(["lu-foxtrot"]);
		expect(found(odd, "places")).toEqual(["lu-hotel"]);
		expect(found(odd, "india")).toEqual(["lu-india"]);
		expect(searchIcons(odd, "x")).toEqual([]);
		expect(searchIcons(odd, "", { library: "lucide" })).toHaveLength(8);
		expect(searchIcons(odd, "")).toHaveLength(9);
	});

	it("works on an empty catalog", () => {
		const none = catalogOf([]);
		expect(searchIcons(none, "")).toEqual([]);
		expect(searchIcons(none, "bell")).toEqual([]);
		expect(searchIcons(none, "x")).toEqual([]);
	});
});

describe("searchIcons errors", () => {
	const ok = catalogOf([make("alpha")]);

	it("rejects a catalog without an icons array", () => {
		expectErrorEach(
			[
				[undefined, "undefined"],
				[null, "null"],
				["catalog", '"catalog"'],
				[[], "an array"],
				[{}, "an object"],
				[{ icons: "alpha" }, "an object"],
			],
			(bad) => searchIcons(bad as never, "alpha"),
			TypeError,
			(shown) =>
				`searchIcons: catalog must be an object with an "icons" array, received ${shown}.`,
		);
	});

	it("rejects a query that is not a string", () => {
		expectErrorEach(
			[
				[undefined, "undefined"],
				[null, "null"],
				[42, "42"],
				[["alpha"], "an array"],
			],
			(bad) => searchIcons(ok, bad as never),
			TypeError,
			(shown) => `searchIcons: query must be a string, received ${shown}.`,
		);
	});

	it("rejects options that are not an object", () => {
		expectErrorEach(
			[
				[null, "null"],
				[5, "5"],
				["huge", '"huge"'],
				[[], "an array"],
			],
			(bad) => searchIcons(ok, "alpha", bad as never),
			TypeError,
			(shown) =>
				`searchIcons: options must be an object like { limit: 20 }, received ${shown}.`,
		);
	});

	it("rejects an unknown option", () => {
		expectError(
			() => searchIcons(ok, "alpha", { max: 5 } as never),
			TypeError,
			'searchIcons: unknown option "max". Valid options are "library" and "limit".',
		);
	});

	it("rejects a library that is not a string", () => {
		expectError(
			() => searchIcons(ok, "alpha", { library: 5 as never }),
			TypeError,
			'searchIcons: library must be "lucide" or "huge", received 5.',
		);
		expectError(
			() => searchIcons(ok, "alpha", { library: null as never }),
			TypeError,
			'searchIcons: library must be "lucide" or "huge", received null.',
		);
	});

	it("rejects a limit that is not a whole number of 1 or more", () => {
		expectErrorEach(
			[
				[0, "0"],
				[-1, "-1"],
				[2.5, "2.5"],
				[NaN, "NaN"],
				[Infinity, "Infinity"],
				["5", '"5"'],
				[null, "null"],
			],
			(bad) => searchIcons(ok, "alpha", { limit: bad as never }),
			RangeError,
			(shown) =>
				`searchIcons: limit must be a whole number of 1 or more, received ${shown}.`,
		);
	});

	it("checks the options even when the query is empty", () => {
		expectError(
			() => searchIcons(ok, "", { limit: 0 }),
			RangeError,
			"searchIcons: limit must be a whole number of 1 or more, received 0.",
		);
	});

	it("accepts options that are explicitly undefined", () => {
		expect(
			found(ok, "alpha", { library: undefined, limit: undefined }),
		).toEqual(["lu-alpha"]);
	});
});
