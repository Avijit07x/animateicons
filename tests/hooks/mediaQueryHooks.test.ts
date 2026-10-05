import { useIsMobile } from "@/hooks/use-mobile";
import { useCoarsePointer } from "@/hooks/useCoarsePointer";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { mockMediaQuery } from "../match-media";

describe.each([
	["useIsMobile", useIsMobile, "(max-width: 767px)"],
	["useCoarsePointer", useCoarsePointer, "(pointer: coarse)"],
])("%s", (_name, useHook, query) => {
	let media: ReturnType<typeof mockMediaQuery>;

	afterEach(() => {
		media.restore();
	});

	it("is false when the query does not match", () => {
		media = mockMediaQuery(query, false);
		const { result } = renderHook(() => useHook());
		expect(result.current).toBe(false);
	});

	it("is true when the query matches", () => {
		media = mockMediaQuery(query, true);
		const { result } = renderHook(() => useHook());
		expect(result.current).toBe(true);
	});

	it("follows the query when it changes", () => {
		media = mockMediaQuery(query, false);
		const { result } = renderHook(() => useHook());
		act(() => media.set(true));
		expect(result.current).toBe(true);
		act(() => media.set(false));
		expect(result.current).toBe(false);
	});

	it("stops listening when the component unmounts", () => {
		media = mockMediaQuery(query, false);
		const { unmount } = renderHook(() => useHook());
		expect(media.listenerCount()).toBe(1);
		unmount();
		expect(media.listenerCount()).toBe(0);
	});
});
