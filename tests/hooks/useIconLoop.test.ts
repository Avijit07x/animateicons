import { useIconLoop } from "@/hooks/useIconLoop";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("useIconLoop", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("plays once shortly after mount, then on every interval", () => {
		const start = vi.fn();
		const { result } = renderHook(() => useIconLoop(1000));
		result.current.current = { startAnimation: start, stopAnimation: vi.fn() };

		act(() => {
			vi.advanceTimersByTime(220);
		});
		expect(start).toHaveBeenCalledTimes(1);

		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(start).toHaveBeenCalledTimes(3);
	});

	it("stops looping after unmount", () => {
		const start = vi.fn();
		const { result, unmount } = renderHook(() => useIconLoop(1000));
		result.current.current = { startAnimation: start, stopAnimation: vi.fn() };
		unmount();

		act(() => {
			vi.advanceTimersByTime(5000);
		});
		expect(start).not.toHaveBeenCalled();
	});
});
