import {
	ICON_CATALOG,
	POPULAR_ICON_NAMES,
	POPULAR_ICONS,
	searchIcons,
} from "@/lib/icon-search";
import { describe, expect, it } from "vitest";

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
});
