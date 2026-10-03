import { useIconSearchFilter } from "@/hooks/useIconFilter";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	expectError,
	expectErrorEach,
} from "@/core/__tests__/helpers/expect-error";

const Stub: React.FC = () => null;
const today = new Date().toISOString().slice(0, 10);

const ICONS: IconListItem[] = [
	{
		name: "bell",
		icon: Stub,
		addedAt: "2024-01-01",
		category: ["Notification"],
		keywords: ["alert", "ring"],
	},
	{
		name: "bell-ring",
		icon: Stub,
		addedAt: "2024-01-01",
		category: ["Notification"],
		keywords: ["alert"],
	},
	{
		name: "user",
		icon: Stub,
		addedAt: "2024-01-01",
		category: ["People"],
		keywords: ["profile", "person"],
	},
];

const FILES: IconListItem[] = [
	{
		name: "folder-closed",
		icon: Stub,
		addedAt: "2024-01-01",
		updatedAt: today,
		category: ["File icons"],
		keywords: ["folder", "closed", "directory", "files"],
	},
	{
		name: "file-text",
		icon: Stub,
		addedAt: "2024-01-01",
		category: ["File icons"],
		keywords: ["file", "document"],
	},
	{
		name: "file",
		icon: Stub,
		addedAt: "2024-01-01",
		category: ["File icons"],
		keywords: ["file", "page"],
	},
	{
		name: "files",
		icon: Stub,
		addedAt: "2024-01-01",
		category: ["File icons"],
		keywords: ["files", "copy"],
	},
	{
		name: "milestone",
		icon: Stub,
		addedAt: "2024-01-01",
		category: ["Navigation"],
		keywords: ["milestone", "marker", "goal"],
	},
];

type Props = { icons: IconMeta[]; category: string; query: string };

const run = (props: Props) =>
	renderHook((p: Props) => useIconSearchFilter(p), { initialProps: props });

const names = (props: Props) => run(props).result.current.map((i) => i.name);

describe("useIconSearchFilter", () => {
	it("returns all icons when query is empty and category is 'all'", () => {
		expect(names({ icons: ICONS, category: "all", query: "" })).toHaveLength(3);
	});

	it("ranks exact name matches first", () => {
		const result = names({ icons: ICONS, category: "all", query: "bell" });
		expect(result[0]).toBe("bell");
		expect(result).toContain("bell-ring");
	});

	it("filters by category", () => {
		expect(names({ icons: ICONS, category: "People", query: "" })).toEqual([
			"user",
		]);
	});

	it("ignores queries shorter than 2 chars", () => {
		expect(names({ icons: ICONS, category: "all", query: "b" })).toHaveLength(
			3,
		);
		expect(
			names({ icons: ICONS, category: "all", query: "  b " }),
		).toHaveLength(3);
	});

	it("short-circuits queries longer than any matchable name or keyword", () => {
		expect(
			names({ icons: ICONS, category: "all", query: "a".repeat(50) }),
		).toHaveLength(0);
	});

	it("still matches a query as long as the longest keyword", () => {
		expect(
			names({ icons: ICONS, category: "all", query: "profile" }),
		).toContain("user");
	});

	it("returns empty array when no icon matches", () => {
		expect(
			names({ icons: ICONS, category: "all", query: "zzznotfound" }),
		).toHaveLength(0);
	});

	it("returns nothing for a query with no letters or digits", () => {
		expect(names({ icons: ICONS, category: "all", query: "🔥🔥" })).toEqual([]);
		expect(names({ icons: ICONS, category: "all", query: "!!" })).toEqual([]);
	});

	it("handles an empty icon list", () => {
		expect(names({ icons: [], category: "all", query: "" })).toEqual([]);
		expect(names({ icons: [], category: "all", query: "bell" })).toEqual([]);
		expect(names({ icons: [], category: "People", query: "bell" })).toEqual([]);
	});

	it("handles a category nobody uses", () => {
		expect(names({ icons: ICONS, category: "Nope", query: "bell" })).toEqual(
			[],
		);
		expect(names({ icons: ICONS, category: "Nope", query: "" })).toEqual([]);
	});

	it("keeps a recently updated keyword match below the name matches", () => {
		const result = names({ icons: FILES, category: "all", query: "files" });
		expect(result.slice(0, 3)).toEqual(["files", "file", "file-text"]);
		expect(result).not.toContain("milestone");
		expect(result.indexOf("folder-closed")).toBeGreaterThan(
			result.indexOf("file-text"),
		);
	});

	it("puts new or updated icons first only within the same match level", () => {
		const icons: IconListItem[] = [
			{ name: "bell-off", icon: Stub, addedAt: "2024-01-01", keywords: [] },
			{
				name: "bell-ring",
				icon: Stub,
				addedAt: "2024-01-01",
				updatedAt: today,
				keywords: [],
			},
			{ name: "doorbell", icon: Stub, addedAt: today, keywords: [] },
		];
		expect(names({ icons, category: "all", query: "bell" })).toEqual([
			"bell-ring",
			"bell-off",
			"doorbell",
		]);
	});

	it("lists new icons first when there is no query", () => {
		const icons: IconListItem[] = [
			{ name: "old", icon: Stub, addedAt: "2024-01-01", keywords: [] },
			{ name: "fresh", icon: Stub, addedAt: today, keywords: [] },
			{
				name: "changed",
				icon: Stub,
				addedAt: "2024-01-01",
				updatedAt: today,
				keywords: [],
			},
		];
		expect(names({ icons, category: "all", query: "" })).toEqual([
			"fresh",
			"changed",
			"old",
		]);
	});

	it("flags new and updated icons", () => {
		const icons: IconListItem[] = [
			{ name: "fresh", icon: Stub, addedAt: today, keywords: [] },
			{
				name: "changed",
				icon: Stub,
				addedAt: "2024-01-01",
				updatedAt: today,
				keywords: [],
			},
			{ name: "old", icon: Stub, addedAt: "2024-01-01", keywords: [] },
			{ name: "broken", icon: Stub, addedAt: "not a date", keywords: [] },
		];
		const result = run({ icons, category: "all", query: "" }).result.current;
		const flags = Object.fromEntries(
			result.map((i) => [i.name, [i.isNew, i.isUpdated]]),
		);
		expect(flags).toEqual({
			fresh: [true, false],
			changed: [false, true],
			old: [false, false],
			broken: [false, false],
		});
	});

	it("tolerates a typo only when nothing else matches", () => {
		expect(
			names({ icons: FILES, category: "all", query: "folderr" }),
		).toContain("folder-closed");
		expect(names({ icons: ICONS, category: "all", query: "bel" })).toEqual([
			"bell",
			"bell-ring",
		]);
	});

	it("searches inside the chosen category only", () => {
		expect(
			names({ icons: FILES, category: "File icons", query: "files" }),
		).not.toContain("milestone");
		expect(
			names({ icons: FILES, category: "Navigation", query: "file" }),
		).toEqual([]);
		expect(
			names({ icons: FILES, category: "Navigation", query: "milestne" }),
		).toEqual(["milestone"]);
	});
});

describe("useIconSearchFilter stability", () => {
	const props: Props = { icons: ICONS, category: "all", query: "bell" };

	it("does not render again on its own", () => {
		let renders = 0;
		renderHook(() => {
			renders += 1;
			return useIconSearchFilter(props);
		});
		expect(renders).toBe(1);
	});

	it("returns the same array when rerendered with the same input", () => {
		const { result, rerender } = run(props);
		const first = result.current;
		rerender({ ...props });
		expect(result.current).toBe(first);
	});

	it("returns the same array for queries that mean the same thing", () => {
		const { result, rerender } = run(props);
		const first = result.current;
		for (const query of ["Bell", "  bell ", "BELL", "bell!", "(bell)"]) {
			rerender({ ...props, query });
			expect(result.current).toBe(first);
		}
	});

	it("returns the cached array when an earlier query comes back", () => {
		const { result, rerender } = run(props);
		const first = result.current;
		rerender({ ...props, query: "user" });
		expect(result.current).not.toBe(first);
		rerender({ ...props, query: "bell" });
		expect(result.current).toBe(first);
	});

	it("keeps the same item objects across queries", () => {
		const { result, rerender } = run({ ...props, query: "" });
		const all = new Map(result.current.map((icon) => [icon.name, icon]));
		for (const query of ["bell", "user", "bell-ring"]) {
			rerender({ ...props, query });
			for (const icon of result.current) {
				expect(icon).toBe(all.get(icon.name));
			}
		}
	});

	it("returns the same array for the empty query and for a too-short one", () => {
		const { result, rerender } = run({ ...props, query: "" });
		const all = result.current;
		for (const query of ["b", " ", "  b "]) {
			rerender({ ...props, query });
			expect(result.current).toBe(all);
		}
	});

	it("keeps each category's array when switching back and forth", () => {
		const { result, rerender } = run({ ...props, query: "" });
		const all = result.current;
		rerender({ ...props, query: "", category: "People" });
		const people = result.current;
		expect(people).not.toBe(all);
		rerender({ ...props, query: "", category: "all" });
		expect(result.current).toBe(all);
		rerender({ ...props, query: "", category: "People" });
		expect(result.current).toBe(people);
	});

	it("starts again when the icon list changes", () => {
		const { result, rerender } = run(props);
		const first = result.current;
		rerender({ ...props, icons: [...ICONS] });
		expect(result.current).not.toBe(first);
		expect(result.current.map((i) => i.name)).toEqual(first.map((i) => i.name));
	});

	it("shares results between components that use the same icon list", () => {
		const first = run(props);
		const second = run(props);
		expect(second.result.current).toBe(first.result.current);
		first.unmount();
		expect(run(props).result.current).toBe(second.result.current);
	});

	it("returns arrays that cannot be changed by the caller", () => {
		const { result, rerender } = run(props);
		expect(Object.isFrozen(result.current)).toBe(true);
		expect(() => (result.current as unknown as unknown[]).push(1)).toThrow(
			TypeError,
		);
		rerender({ ...props, query: "" });
		expect(Object.isFrozen(result.current)).toBe(true);
	});

	it("only keeps a limited number of queries", () => {
		const icons: IconListItem[] = Array.from({ length: 60 }, (_, i) => ({
			name: `icon-${String.fromCharCode(97 + (i % 26))}${String.fromCharCode(97 + Math.floor(i / 26))}`,
			icon: Stub,
			addedAt: "2024-01-01",
			keywords: [],
		}));
		const { result, rerender } = run({
			icons,
			category: "all",
			query: "icon-aa",
		});
		const first = result.current;
		for (let i = 0; i < 40; i++) {
			rerender({ icons, category: "all", query: `icon-${i}` });
		}
		rerender({ icons, category: "all", query: "icon-aa" });
		expect(result.current).not.toBe(first);
		expect(result.current.map((i) => i.name)).toEqual(first.map((i) => i.name));
	});
});

describe("useIconSearchFilter errors", () => {
	const ok: Props = { icons: ICONS, category: "all", query: "bell" };

	it("rejects params that are not an object", () => {
		expectErrorEach(
			[
				[undefined, "undefined"],
				[null, "null"],
				["bell", '"bell"'],
				[[], "an array"],
			],
			(bad) => renderHook(() => useIconSearchFilter(bad as never)),
			TypeError,
			(shown) =>
				`useIconSearchFilter: options must be an object like { icons, category, query }, received ${shown}.`,
		);
	});

	it("rejects an unknown option", () => {
		expectError(
			() =>
				renderHook(() => useIconSearchFilter({ ...ok, q: "bell" } as never)),
			TypeError,
			'useIconSearchFilter: unknown option "q". Valid options are "icons", "category" and "query".',
		);
	});

	it("rejects icons that are not an array", () => {
		expectErrorEach(
			[
				[undefined, "undefined"],
				[null, "null"],
				[{}, "an object"],
				["bell", '"bell"'],
			],
			(bad) =>
				renderHook(() => useIconSearchFilter({ ...ok, icons: bad } as never)),
			TypeError,
			(shown) =>
				`useIconSearchFilter: icons must be an array of icon metadata, received ${shown}.`,
		);
	});

	it("rejects a category that is not a string", () => {
		expectError(
			() =>
				renderHook(() =>
					useIconSearchFilter({ ...ok, category: undefined } as never),
				),
			TypeError,
			"useIconSearchFilter: category must be a string, received undefined.",
		);
		expectError(
			() =>
				renderHook(() => useIconSearchFilter({ ...ok, category: 5 } as never)),
			TypeError,
			"useIconSearchFilter: category must be a string, received 5.",
		);
	});

	it("rejects a query that is not a string", () => {
		expectError(
			() =>
				renderHook(() =>
					useIconSearchFilter({ ...ok, query: undefined } as never),
				),
			TypeError,
			"useIconSearchFilter: query must be a string, received undefined.",
		);
		expectError(
			() =>
				renderHook(() => useIconSearchFilter({ ...ok, query: null } as never)),
			TypeError,
			"useIconSearchFilter: query must be a string, received null.",
		);
	});

	it("names the bad entry when an icon is malformed", () => {
		const bad = [
			...ICONS,
			{ name: "", icon: Stub, addedAt: "2024-01-01", keywords: [] },
		];
		expectError(
			() =>
				renderHook(() =>
					useIconSearchFilter({ icons: bad, category: "all", query: "bell" }),
				),
			TypeError,
			'createIconSearchIndex: items[3].name must be a non-empty string, received "".',
		);
	});

	it("does not look at the icon entries until a search needs them", () => {
		const bad = [{ name: "", icon: Stub, addedAt: "2024-01-01", keywords: [] }];
		expect(() =>
			renderHook(() =>
				useIconSearchFilter({ icons: bad, category: "all", query: "" }),
			),
		).not.toThrow();
	});
});
