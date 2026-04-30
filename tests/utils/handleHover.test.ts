/**
 * Tests for handleHover — the helper every AnimateIcons consumer uses
 * to drive a child icon's animation from a wrapping element's hover.
 */

import { describe, expect, it, vi } from "vitest";
import handleHover from "@/utils/handleHover";
import type { IconHandle } from "@/types/icon";

const mkRef = (start = vi.fn(), stop = vi.fn()) => ({
	current: { startAnimation: start, stopAnimation: stop } as IconHandle,
});

describe("handleHover", () => {
	it("calls startAnimation on mouseenter", () => {
		const start = vi.fn();
		const ref = mkRef(start);
		handleHover(
			{ type: "mouseenter" } as React.MouseEvent,
			ref as React.RefObject<IconHandle | null>,
		);
		expect(start).toHaveBeenCalledTimes(1);
	});

	it("calls stopAnimation on mouseleave", () => {
		const stop = vi.fn();
		const ref = mkRef(vi.fn(), stop);
		handleHover(
			{ type: "mouseleave" } as React.MouseEvent,
			ref as React.RefObject<IconHandle | null>,
		);
		expect(stop).toHaveBeenCalledTimes(1);
	});

	it("is a no-op for unrelated event types", () => {
		const start = vi.fn();
		const stop = vi.fn();
		const ref = mkRef(start, stop);
		handleHover(
			{ type: "click" } as React.MouseEvent,
			ref as React.RefObject<IconHandle | null>,
		);
		expect(start).not.toHaveBeenCalled();
		expect(stop).not.toHaveBeenCalled();
	});

	it("is a no-op when ref.current is null", () => {
		const ref = { current: null };
		expect(() =>
			handleHover(
				{ type: "mouseenter" } as React.MouseEvent,
				ref as React.RefObject<IconHandle | null>,
			),
		).not.toThrow();
	});
});
