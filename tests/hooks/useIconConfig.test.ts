import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useIconConfig } from "@/app/icons/_components/playground/useIconConfig";

describe("useIconConfig", () => {
	it("starts with sensible defaults", () => {
		const { result } = renderHook(() => useIconConfig());
		expect(result.current.config.size).toBe(64);
		expect(result.current.config.duration).toBe(1);
		expect(result.current.config.color).toBe("#ffffff");
	});

	it("update mutates the chosen field only", () => {
		const { result } = renderHook(() => useIconConfig());
		act(() => result.current.update("size", 128));
		expect(result.current.config.size).toBe(128);
		expect(result.current.config.duration).toBe(1);
		expect(result.current.config.color).toBe("#ffffff");
	});

	it("reset returns to the defaults", () => {
		const { result } = renderHook(() => useIconConfig());
		act(() => result.current.update("size", 100));
		expect(result.current.isDefault).toBe(false);

		act(() => result.current.reset());
		expect(result.current.config.size).toBe(64);
		expect(result.current.isDefault).toBe(true);
	});

	it("keeps reset stable between renders", () => {
		const { result, rerender } = renderHook(() => useIconConfig());
		const first = result.current.reset;
		rerender();
		expect(result.current.reset).toBe(first);
	});
});
