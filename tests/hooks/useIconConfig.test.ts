/**
 * Tests for useIconConfig — local state hook for the AnimateIcons
 * playground sheet (size / duration / color / trigger).
 */

import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useIconConfig } from "@/app/icons/_components/playground/useIconConfig";

describe("useIconConfig", () => {
	it("starts with sensible defaults", () => {
		const { result } = renderHook(() => useIconConfig());
		expect(result.current.config.size).toBe(64);
		expect(result.current.config.duration).toBe(1);
		expect(result.current.config.color).toBe("#ffffff");
		expect(result.current.config.trigger).toBe("hover");
	});

	it("update mutates the chosen field only", () => {
		const { result } = renderHook(() => useIconConfig());
		act(() => result.current.update("size", 128));
		expect(result.current.config.size).toBe(128);
		expect(result.current.config.duration).toBe(1);
		expect(result.current.config.color).toBe("#ffffff");
	});

	it("reset returns to defaults (or initial overrides)", () => {
		const { result } = renderHook(() => useIconConfig({ size: 32 }));
		expect(result.current.config.size).toBe(32);

		act(() => result.current.update("size", 100));
		expect(result.current.config.size).toBe(100);

		act(() => result.current.reset());
		expect(result.current.config.size).toBe(32);
	});

	it("supports trigger mode changes", () => {
		const { result } = renderHook(() => useIconConfig());
		act(() => result.current.update("trigger", "loop"));
		expect(result.current.config.trigger).toBe("loop");
	});
});
