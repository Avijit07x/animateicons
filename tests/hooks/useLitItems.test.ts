import { useLitItems } from "@/hooks/useLitItems";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const visibleRect = () =>
	({
		width: 40,
		left: 10,
		right: 50,
		top: 0,
		bottom: 40,
		height: 40,
	}) as DOMRect;

const attach = (result: { current: ReturnType<typeof useLitItems> }, n = 1) =>
	Array.from({ length: n }, (_, i) => {
		const el = document.createElement("div");
		el.getBoundingClientRect = visibleRect;
		const handle = { startAnimation: vi.fn(), stopAnimation: vi.fn() };
		result.current.setItem(i)(el);
		result.current.setIcon(i)(handle);
		return { el, handle };
	});

describe("useLitItems", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.stubGlobal(
			"IntersectionObserver",
			class {
				cb: IntersectionObserverCallback;
				constructor(cb: IntersectionObserverCallback) {
					this.cb = cb;
				}
				observe() {
					this.cb(
						[{ isIntersecting: true } as IntersectionObserverEntry],
						this as unknown as IntersectionObserver,
					);
				}
				disconnect() {}
			},
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it("lights an item, plays its icon and clears the flag after litMs", () => {
		const { result } = renderHook(() => useLitItems({ count: 1, litMs: 500 }));
		const [{ el, handle }] = attach(result);

		act(() => result.current.light(0));
		expect(el.hasAttribute("data-lit")).toBe(true);
		expect(handle.startAnimation).toHaveBeenCalledTimes(1);

		act(() => {
			vi.advanceTimersByTime(500);
		});
		expect(el.hasAttribute("data-lit")).toBe(false);
	});

	it("restarts the timer when an item is lit again", () => {
		const { result } = renderHook(() => useLitItems({ count: 1, litMs: 500 }));
		const [{ el }] = attach(result);

		act(() => result.current.light(0));
		act(() => {
			vi.advanceTimersByTime(300);
		});
		act(() => result.current.light(0));
		act(() => {
			vi.advanceTimersByTime(300);
		});
		expect(el.hasAttribute("data-lit")).toBe(true);
		act(() => {
			vi.advanceTimersByTime(200);
		});
		expect(el.hasAttribute("data-lit")).toBe(false);
	});

	it("lights a visible item on every idle tick once the last flash ended", () => {
		const { result, rerender } = renderHook(
			({ idleEveryMs }) => useLitItems({ count: 1, idleEveryMs, litMs: 300 }),
			{ initialProps: { idleEveryMs: undefined as number | undefined } },
		);
		const [{ handle }] = attach(result);
		result.current.fieldRef.current = document.createElement("div");
		rerender({ idleEveryMs: 400 });

		act(() => {
			vi.advanceTimersByTime(800);
		});
		expect(handle.startAnimation).toHaveBeenCalledTimes(2);
	});

	it("skips items that are off screen", () => {
		const { result, rerender } = renderHook(
			({ idleEveryMs }) => useLitItems({ count: 1, idleEveryMs }),
			{ initialProps: { idleEveryMs: undefined as number | undefined } },
		);
		const [{ el, handle }] = attach(result);
		el.getBoundingClientRect = () =>
			({ width: 40, left: -200, right: -160 }) as DOMRect;
		result.current.fieldRef.current = document.createElement("div");
		rerender({ idleEveryMs: 400 });

		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(handle.startAnimation).not.toHaveBeenCalled();
	});

	it("does nothing when disabled", () => {
		const { result, rerender } = renderHook(
			({ idleEveryMs }) =>
				useLitItems({ count: 1, idleEveryMs, enabled: false }),
			{ initialProps: { idleEveryMs: undefined as number | undefined } },
		);
		const [{ handle }] = attach(result);
		result.current.fieldRef.current = document.createElement("div");
		rerender({ idleEveryMs: 400 });

		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(handle.startAnimation).not.toHaveBeenCalled();
	});

	it("wakes an item when the pointer comes within reach, once per cooldown", () => {
		const { result, rerender } = renderHook(
			({ enabled }) =>
				useLitItems({ count: 1, reach: 50, litMs: 1000, enabled }),
			{ initialProps: { enabled: false } },
		);
		const [{ handle }] = attach(result);
		result.current.fieldRef.current = document.createElement("div");
		rerender({ enabled: true });
		act(() => {
			vi.advanceTimersByTime(2000);
		});

		const move = (x: number, y: number) =>
			act(() => {
				window.dispatchEvent(
					new MouseEvent("pointermove", { clientX: x, clientY: y }),
				);
				vi.advanceTimersByTime(20);
			});

		move(300, 300);
		expect(handle.startAnimation).not.toHaveBeenCalled();

		move(32, 22);
		expect(handle.startAnimation).toHaveBeenCalledTimes(1);

		move(33, 22);
		expect(handle.startAnimation).toHaveBeenCalledTimes(1);

		act(() => {
			vi.advanceTimersByTime(1100);
		});
		move(32, 22);
		expect(handle.startAnimation).toHaveBeenCalledTimes(2);
	});

	it("ignores items that have no size when the pointer moves", () => {
		const { result, rerender } = renderHook(
			({ enabled }) => useLitItems({ count: 1, reach: 500, enabled }),
			{ initialProps: { enabled: false } },
		);
		const [{ el, handle }] = attach(result);
		el.getBoundingClientRect = () =>
			({ width: 0, left: 0, right: 0 }) as DOMRect;
		result.current.fieldRef.current = document.createElement("div");
		rerender({ enabled: true });
		act(() => {
			vi.advanceTimersByTime(2000);
		});

		act(() => {
			window.dispatchEvent(
				new MouseEvent("pointermove", { clientX: 1, clientY: 1 }),
			);
			vi.advanceTimersByTime(20);
		});
		expect(handle.startAnimation).not.toHaveBeenCalled();
	});
});
