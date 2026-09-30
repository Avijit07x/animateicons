import {
	LIBRARY_PREVIEW_NAMES,
	PLAYGROUND_NAMES,
	SHOWCASE,
	SHOWCASE_NAMES,
} from "@/components/home/showcase-icons";
import { ICON_META } from "@/icons/huge/meta";
import { ICON_META as LUCIDE_META } from "@/icons/lucide/meta";
import { describe, expect, it } from "vitest";

describe("homepage showcase icons", () => {
	it("only lists icons that exist in the Huge library", () => {
		const known = new Set(ICON_META.map((icon) => icon.name));
		const missing = SHOWCASE_NAMES.filter((name) => !known.has(name));
		expect(missing).toEqual([]);
	});

	it("only lists playground icons that exist in the Huge library", () => {
		const known = new Set(ICON_META.map((icon) => icon.name));
		const missing = PLAYGROUND_NAMES.filter((name) => !known.has(name));
		expect(missing).toEqual([]);
	});

	it("only lists library preview icons that exist in their library", () => {
		const huge = new Set(ICON_META.map((icon) => icon.name));
		const lucide = new Set(LUCIDE_META.map((icon) => icon.name));
		expect(LIBRARY_PREVIEW_NAMES.huge.filter((n) => !huge.has(n))).toEqual([]);
		expect(LIBRARY_PREVIEW_NAMES.lucide.filter((n) => !lucide.has(n))).toEqual(
			[],
		);
	});

	it("lists each icon once", () => {
		expect(new Set(SHOWCASE_NAMES).size).toBe(SHOWCASE_NAMES.length);
		expect(new Set(PLAYGROUND_NAMES).size).toBe(PLAYGROUND_NAMES.length);
	});

	it("builds one component per name", () => {
		expect(SHOWCASE).toHaveLength(SHOWCASE_NAMES.length);
	});
});
