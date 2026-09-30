import { useCopy } from "@/hooks/useCopy";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("useCopy", () => {
	const writeText = vi.fn().mockResolvedValue(undefined);

	beforeEach(() => {
		vi.useFakeTimers();
		writeText.mockClear();
		Object.defineProperty(navigator, "clipboard", {
			value: { writeText },
			configurable: true,
		});
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("writes the text and flips copied on", async () => {
		const { result } = renderHook(() => useCopy());
		expect(result.current.copied).toBe(false);
		await act(async () => result.current.copy("npm i x"));
		expect(writeText).toHaveBeenCalledWith("npm i x");
		expect(result.current.copied).toBe(true);
	});

	it("resets copied after the delay", async () => {
		const { result } = renderHook(() => useCopy(1000));
		await act(async () => result.current.copy("x"));
		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(result.current.copied).toBe(false);
	});
});
