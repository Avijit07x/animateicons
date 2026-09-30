import { useTypewriter } from "@/hooks/useTypewriter";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const WORDS = ["ab", "xyz"];
const SINGLE = ["hi"];

const advance = (ms: number) =>
	act(() => {
		vi.advanceTimersByTime(ms);
	});

describe("useTypewriter", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("starts empty and types the first word one letter at a time", () => {
		const { result } = renderHook(() => useTypewriter(WORDS, true));
		expect(result.current).toBe("");

		advance(300);
		expect(result.current).toBe("a");

		advance(95);
		expect(result.current).toBe("ab");
	});

	it("holds the finished word, erases it, then moves to the next word", () => {
		const { result } = renderHook(() => useTypewriter(WORDS, true));
		advance(300 + 95);
		expect(result.current).toBe("ab");

		advance(2100);
		expect(result.current).toBe("ab");

		advance(100);
		expect(result.current).toBe("a");

		advance(40);
		expect(result.current).toBe("");

		advance(400);
		expect(result.current).toBe("x");
	});

	it("wraps back to the first word after the last one", () => {
		const { result } = renderHook(() => useTypewriter(SINGLE, true));
		advance(300 + 95);
		expect(result.current).toBe("hi");

		advance(2200 + 40 + 400);
		expect(result.current).toBe("h");
	});

	it("does nothing while inactive", () => {
		const { result } = renderHook(() => useTypewriter(WORDS, false));
		advance(5000);
		expect(result.current).toBe("");
	});

	it("stops when it becomes inactive", () => {
		const { result, rerender } = renderHook(
			({ active }) => useTypewriter(WORDS, active),
			{ initialProps: { active: true } },
		);
		advance(300);
		expect(result.current).toBe("a");

		rerender({ active: false });
		advance(5000);
		expect(result.current).toBe("a");
	});
});
