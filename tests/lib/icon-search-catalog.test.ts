import { ICON_META as HUGE } from "@/icons/huge/meta";
import { ICON_META as LUCIDE } from "@/icons/lucide/meta";
import {
	createIconSearchIndex,
	MIN_QUERY_LENGTH,
	normalizeQuery,
} from "@animateicons/core/icon-search-engine";
import { describe, expect, it } from "vitest";

const LIBRARIES = [
	["lucide", LUCIDE],
	["huge", HUGE],
] as const;

describe.each(LIBRARIES)("real %s catalog", (_library, icons) => {
	const index = createIconSearchIndex(icons);
	const names = (query: string) => index.search(query).map((icon) => icon.name);

	it("has valid data for every icon", () => {
		expect(index.size).toBe(icons.length);
		expect(new Set(icons.map((icon) => icon.name)).size).toBe(icons.length);
	});

	it("finds every icon first by its own name", () => {
		const misses = icons
			.filter((icon) => normalizeQuery(icon.name).length >= MIN_QUERY_LENGTH)
			.filter((icon) => names(icon.name)[0] !== icon.name)
			.map((icon) => `${icon.name} -> ${names(icon.name)[0]}`);
		expect(misses).toEqual([]);
	});

	it("finds every icon by each of its keywords", () => {
		const misses: string[] = [];
		for (const icon of icons) {
			for (const keyword of icon.keywords) {
				if (normalizeQuery(keyword).length < MIN_QUERY_LENGTH) continue;
				if (!names(keyword).includes(icon.name)) {
					misses.push(`${icon.name} by "${keyword}"`);
				}
			}
		}
		expect(misses).toEqual([]);
	});

	it("finds every icon by its name with the case and separators changed", () => {
		const misses = icons
			.filter((icon) => normalizeQuery(icon.name).length >= MIN_QUERY_LENGTH)
			.filter((icon) => {
				const loud = icon.name.toUpperCase().replace(/-/g, " ");
				return !names(loud).includes(icon.name);
			})
			.map((icon) => icon.name);
		expect(misses).toEqual([]);
	});

	it("answers 300 mixed queries quickly", () => {
		const words = icons.flatMap((icon) => [icon.name, ...icon.keywords]);
		const queries = Array.from({ length: 300 }, (_, i) => {
			const word = words[(i * 7) % words.length];
			return i % 3 === 0 ? word.slice(0, -1) : i % 3 === 1 ? `${word}s` : word;
		});
		const start = performance.now();
		for (const query of queries) index.search(query);
		expect(performance.now() - start).toBeLessThan(1000);
	});
});

describe("real lucide catalog results", () => {
	const index = createIconSearchIndex(LUCIDE);
	const names = (query: string) => index.search(query).map((icon) => icon.name);

	it("puts the file family first for 'files' and leaves noise out", () => {
		const result = names("files");
		expect(result.slice(0, 3)).toEqual(["files", "file", "file-archive"]);
		expect(result).not.toContain("milestone");
		expect(result[result.length - 1]).toBe("folder-closed");
	});

	it("leaves look-alikes out", () => {
		expect(names("bell")).not.toContain("ellipsis");
		expect(names("cart")).not.toContain("chart-bar");
		expect(names("home")).not.toContain("smartphone");
		expect(names("house")).not.toContain("mouse");
	});

	it("keeps real substring matches", () => {
		expect(names("bell")).toContain("dumbbell");
		expect(names("lock")).toContain("clock");
	});

	it("puts a word start before a middle-of-word match", () => {
		const result = names("lock");
		expect(result.indexOf("user-lock")).toBeLessThan(result.indexOf("blocks"));
		expect(result.indexOf("globe-lock")).toBeLessThan(result.indexOf("clock"));
	});

	it("puts an exact keyword before a match inside another word", () => {
		const result = names("edit");
		expect(result.indexOf("pencil")).toBeLessThan(
			result.indexOf("credit-card"),
		);
	});

	it("fixes typos and plurals", () => {
		expect(names("calender")[0]).toBe("calendar");
		expect(names("setings")[0]).toBe("settings");
		expect(names("foldr")[0]).toBe("folder");
		expect(names("batteries")).toContain("battery");
		expect(names("arrows")).toContain("arrow-up");
	});

	it("finds several words in any order", () => {
		expect(names("arrow up")).toContain("arrow-up");
		expect(names("up arrow")).toContain("arrow-up");
		expect(names("a z")).toEqual(["arrow-up-a-z", "arrow-up-z-a"]);
	});
});
