/**
 * Tests for useIconSearchFilter — the filter+rank hook powering the
 * AnimateIcons gallery search (and URL-driven `?q=` query).
 */

import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useIconSearchFilter } from "@/hooks/useIconFilter";

const Stub: React.FC = () => null;

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

describe("useIconSearchFilter", () => {
	it("returns all icons when query is empty and category is 'all'", () => {
		const { result } = renderHook(() =>
			useIconSearchFilter({ icons: ICONS, category: "all", query: "" }),
		);
		expect(result.current).toHaveLength(3);
	});

	it("ranks exact name matches first", () => {
		const { result } = renderHook(() =>
			useIconSearchFilter({ icons: ICONS, category: "all", query: "bell" }),
		);
		expect(result.current[0].name).toBe("bell");
		expect(result.current.map((i) => i.name)).toContain("bell-ring");
	});

	it("filters by category", () => {
		const { result } = renderHook(() =>
			useIconSearchFilter({ icons: ICONS, category: "People", query: "" }),
		);
		expect(result.current).toHaveLength(1);
		expect(result.current[0].name).toBe("user");
	});

	it("ignores queries shorter than 2 chars", () => {
		const { result } = renderHook(() =>
			useIconSearchFilter({ icons: ICONS, category: "all", query: "b" }),
		);
		expect(result.current).toHaveLength(3);
	});

	it("returns empty array when no icon matches", () => {
		const { result } = renderHook(() =>
			useIconSearchFilter({
				icons: ICONS,
				category: "all",
				query: "zzznotfound",
			}),
		);
		expect(result.current).toHaveLength(0);
	});
});
