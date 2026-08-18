/**
 * Tests for IconSearchContext - manages query state, debouncing,
 * and URL synchronization while guarding against oversized queries.
 */

import { describe, expect, it, beforeEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import React from "react";
import {
	IconSearchProvider,
	MAX_SEARCH_LENGTH,
	useIconSearch,
	useIconSearchResult,
} from "@/app/icons/_contexts/IconSearchContext";

const mockReplace = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		replace: mockReplace,
	}),
	usePathname: () => "/icons/lucide",
	useSearchParams: () => mockSearchParams,
}));

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<IconSearchProvider>{children}</IconSearchProvider>
);

describe("IconSearchContext", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSearchParams = new URLSearchParams();
	});

	it("hydrates empty query when searchParams has no q", () => {
		const { result } = renderHook(() => useIconSearch(), { wrapper });
		expect(result.current.query).toBe("");
	});

	it("hydrates from searchParams on mount", () => {
		mockSearchParams = new URLSearchParams("q=bell");
		const { result } = renderHook(() => useIconSearch(), { wrapper });
		expect(result.current.query).toBe("bell");
	});

	it("truncates oversized query hydrated from searchParams to MAX_SEARCH_LENGTH", () => {
		const hugeQuery = "a".repeat(500);
		mockSearchParams = new URLSearchParams(`q=${hugeQuery}`);
		const { result } = renderHook(() => useIconSearch(), { wrapper });
		expect(result.current.query).toHaveLength(MAX_SEARCH_LENGTH);
		expect(result.current.query).toBe("a".repeat(MAX_SEARCH_LENGTH));
	});

	it("clamps query when setQuery is called with long string", () => {
		const { result } = renderHook(() => useIconSearch(), { wrapper });
		act(() => {
			result.current.setQuery("b".repeat(300));
		});
		expect(result.current.query).toHaveLength(MAX_SEARCH_LENGTH);
		expect(result.current.query).toBe("b".repeat(MAX_SEARCH_LENGTH));
	});

	it("clamps query when setQuery is called with function updater", () => {
		const { result } = renderHook(() => useIconSearch(), { wrapper });
		act(() => {
			result.current.setQuery(() => "c".repeat(300));
		});
		expect(result.current.query).toHaveLength(MAX_SEARCH_LENGTH);
		expect(result.current.query).toBe("c".repeat(MAX_SEARCH_LENGTH));
	});

	it("rewrites an oversized inbound ?q= down to MAX_SEARCH_LENGTH in the URL", async () => {
		const hugeQuery = "a".repeat(5000);
		mockSearchParams = new URLSearchParams(`q=${hugeQuery}`);
		renderHook(() => useIconSearch(), { wrapper });

		await vi.waitFor(() => expect(mockReplace).toHaveBeenCalled());

		const [url] = mockReplace.mock.calls.at(-1)!;
		const replaced = new URLSearchParams(url.split("?")[1]).get("q");
		expect(replaced).toHaveLength(MAX_SEARCH_LENGTH);
		expect(url.length).toBeLessThan(hugeQuery.length);
	});

	it("throws if used outside the provider", () => {
		const spy = vi.spyOn(console, "error").mockImplementation(() => {});
		expect(() => renderHook(() => useIconSearch())).toThrow(
			"useIconSearch must be used inside IconSearchProvider",
		);
		expect(() => renderHook(() => useIconSearchResult())).toThrow(
			"useIconSearchResult must be used inside IconSearchProvider",
		);
		spy.mockRestore();
	});
});
