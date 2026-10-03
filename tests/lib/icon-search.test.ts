import {
	ICON_CATALOG,
	POPULAR_ICON_NAMES,
	POPULAR_ICONS,
	searchIcons,
} from "@/lib/icon-search";
import { describe, expect, it } from "vitest";
import {
	expectError,
	expectErrorEach,
} from "@/core/__tests__/helpers/expect-error";

describe("icon search", () => {
	it("returns nothing for queries shorter than two characters", () => {
		expect(searchIcons("", 6)).toEqual([]);
		expect(searchIcons("h", 6)).toEqual([]);
		expect(searchIcons("   ", 6)).toEqual([]);
	});

	it("returns nothing for a query longer than any icon name or keyword", () => {
		expect(searchIcons("x".repeat(200), 6)).toEqual([]);
	});

	it("never returns more than the limit", () => {
		expect(searchIcons("arrow", 4)).toHaveLength(4);
		expect(searchIcons("arrow", 1)).toHaveLength(1);
	});

	it("ranks an exact name match ahead of prefix and partial matches", () => {
		const names = searchIcons("heart", 10).map((icon) => icon.name);
		expect(names[0]).toBe("heart");
		expect(names.slice(0, 2)).toEqual(["heart", "heart"]);
	});

	it("searches both libraries", () => {
		const libraries = new Set(searchIcons("heart", 10).map((i) => i.library));
		expect(libraries).toEqual(new Set(["lucide", "huge"]));
	});

	it("ignores case and surrounding spaces", () => {
		const plain = searchIcons("lock", 6).map((i) => `${i.library}-${i.name}`);
		const messy = searchIcons("  LoCk ", 6).map(
			(i) => `${i.library}-${i.name}`,
		);
		expect(messy).toEqual(plain);
	});

	it("does not repeat an icon", () => {
		const keys = searchIcons("cart", 40).map((i) => `${i.library}-${i.name}`);
		expect(new Set(keys).size).toBe(keys.length);
	});

	it("gives every catalog entry a name, a library and a component", () => {
		for (const icon of ICON_CATALOG) {
			expect(icon.name).toBeTruthy();
			expect(["lucide", "huge"]).toContain(icon.library);
			expect(icon.component).toBeTruthy();
		}
	});

	it("has a popular icon for every listed name, from both libraries", () => {
		const names = new Set(POPULAR_ICONS.map((icon) => icon.name));
		expect(POPULAR_ICON_NAMES.filter((name) => !names.has(name))).toEqual([]);
		const libraries = new Set(POPULAR_ICONS.map((icon) => icon.library));
		expect(libraries).toEqual(new Set(["lucide", "huge"]));
	});

	it("lists each popular icon once", () => {
		const keys = POPULAR_ICONS.map((icon) => `${icon.library}-${icon.name}`);
		expect(new Set(keys).size).toBe(keys.length);
	});

	it("rejects a query that is not a string", () => {
		expectError(
			() => searchIcons(undefined as never, 6),
			TypeError,
			"searchIcons: query must be a string, received undefined.",
		);
		expectError(
			() => searchIcons(42 as never, 6),
			TypeError,
			"searchIcons: query must be a string, received 42.",
		);
	});

	it("rejects a limit that is not a whole number of 1 or more", () => {
		expectErrorEach(
			[
				[0, "0"],
				[-3, "-3"],
				[2.5, "2.5"],
				[NaN, "NaN"],
				[Infinity, "Infinity"],
				["6", '"6"'],
				[undefined, "undefined"],
			],
			(bad) => searchIcons("bell", bad as never),
			RangeError,
			(shown) =>
				`searchIcons: limit must be a whole number of 1 or more, received ${shown}.`,
		);
	});

	it("checks the limit even when the query is too short", () => {
		expectError(
			() => searchIcons("", 0),
			RangeError,
			"searchIcons: limit must be a whole number of 1 or more, received 0.",
		);
	});

	it("returns the same array for queries that mean the same thing", () => {
		const first = searchIcons("heart", 6);
		expect(searchIcons("  HEART ", 6)).toBe(first);
		expect(searchIcons("(heart)", 6)).toBe(first);
		expect(searchIcons("heart", 4)).not.toBe(first);
	});

	it("returns arrays that cannot be changed by the caller", () => {
		expect(Object.isFrozen(searchIcons("heart", 6))).toBe(true);
		expect(Object.isFrozen(searchIcons("", 6))).toBe(true);
		expect(searchIcons("", 6)).toBe(searchIcons("x", 6));
	});

	it("finds plurals, typos and several words", () => {
		const names = (query: string) =>
			searchIcons(query, 20).map((icon) => icon.name);
		expect(names("files")).toContain("file");
		expect(names("calender")).toContain("calendar");
		expect(names("arrow up")).toContain("arrow-up");
	});

	it("does not throw on odd input", () => {
		for (const query of [
			"🔥",
			"(",
			"\\",
			"constructor",
			"__proto__",
			"x".repeat(10_000),
		]) {
			expect(() => searchIcons(query, 6)).not.toThrow();
		}
	});
});
