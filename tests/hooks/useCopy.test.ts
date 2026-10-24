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

	it("stays off and reports failure when the clipboard refuses", async () => {
		writeText.mockRejectedValueOnce(new Error("denied"));
		const { result } = renderHook(() => useCopy());
		let ok: boolean | undefined;
		await act(async () => {
			ok = await result.current.copy("x");
		});
		expect(ok).toBe(false);
		expect(result.current.copied).toBe(false);
	});

	it("restarts the delay when copied again before it ends", async () => {
		const { result } = renderHook(() => useCopy(1000));
		await act(async () => result.current.copy("a"));
		act(() => {
			vi.advanceTimersByTime(800);
		});
		await act(async () => result.current.copy("b"));
		act(() => {
			vi.advanceTimersByTime(800);
		});
		expect(result.current.copied).toBe(true);
	});
});
