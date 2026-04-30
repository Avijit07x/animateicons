/**
 * Tests for PackageManagerContext — drives the AnimateIcons gallery's
 * "Copy CLI command" output (npm / pnpm / bun) and persists the
 * preference across reloads.
 */

import { describe, expect, it, beforeEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
	cliCommandFor,
	PackageManagerProvider,
	usePackageManager,
} from "@/app/icons/_contexts/PackageManagerContext";

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<PackageManagerProvider>{children}</PackageManagerProvider>
);

describe("PackageManagerContext", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("defaults to npm when localStorage is empty", () => {
		const { result } = renderHook(() => usePackageManager(), { wrapper });
		expect(result.current.packageManager).toBe("npm");
	});

	it("hydrates from localStorage on mount", () => {
		localStorage.setItem("tab", "pnpm");
		const { result } = renderHook(() => usePackageManager(), { wrapper });
		expect(result.current.packageManager).toBe("pnpm");
	});

	it("ignores invalid localStorage values", () => {
		localStorage.setItem("tab", "yarn");
		const { result } = renderHook(() => usePackageManager(), { wrapper });
		expect(result.current.packageManager).toBe("npm");
	});

	it("setPackageManager updates state and persists", () => {
		const { result } = renderHook(() => usePackageManager(), { wrapper });
		act(() => result.current.setPackageManager("bun"));
		expect(result.current.packageManager).toBe("bun");
		expect(localStorage.getItem("tab")).toBe("bun");
	});

	it("throws if used outside the provider", () => {
		// Suppress React's expected error log noise.
		const spy = vi.spyOn(console, "error").mockImplementation(() => {});
		expect(() => renderHook(() => usePackageManager())).toThrow();
		spy.mockRestore();
	});
});

describe("cliCommandFor", () => {
	it("maps each manager to its CLI prefix", () => {
		expect(cliCommandFor("npm")).toBe("npx");
		expect(cliCommandFor("pnpm")).toBe("pnpm dlx");
		expect(cliCommandFor("bun")).toBe("bunx --bun");
	});
});
