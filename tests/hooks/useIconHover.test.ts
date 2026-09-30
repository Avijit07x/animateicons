import { useIconHover } from "@/hooks/useIconHover";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("useIconHover", () => {
	it("starts and stops the icon through the returned handlers", () => {
		const { result } = renderHook(() => useIconHover());
		const start = vi.fn();
		const stop = vi.fn();
		result.current.ref.current = { startAnimation: start, stopAnimation: stop };

		result.current.hoverProps.onMouseEnter({
			type: "mouseenter",
		} as React.MouseEvent);
		result.current.hoverProps.onMouseLeave({
			type: "mouseleave",
		} as React.MouseEvent);

		expect(start).toHaveBeenCalledTimes(1);
		expect(stop).toHaveBeenCalledTimes(1);
	});

	it("does nothing before the icon has mounted", () => {
		const { result } = renderHook(() => useIconHover());
		expect(() =>
			result.current.hoverProps.onMouseEnter({
				type: "mouseenter",
			} as React.MouseEvent),
		).not.toThrow();
	});
});
