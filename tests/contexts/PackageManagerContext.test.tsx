import { describe, expect, it, beforeEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
	cliCommandFor,
	installCommandFor,
	shadcnAddCommand,
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

describe("installCommandFor", () => {
	it("maps each manager to its package install verb", () => {
		expect(installCommandFor("npm")).toBe("npm i");
		expect(installCommandFor("pnpm")).toBe("pnpm add");
		expect(installCommandFor("bun")).toBe("bun add");
	});
});

describe("shadcnAddCommand", () => {
	it("builds the registry name for the icon with the manager's prefix", () => {
		expect(shadcnAddCommand("bun", "lu", "bell")).toBe(
			"bunx --bun shadcn@latest add @animateicons/lu-bell",
		);
		expect(shadcnAddCommand("npm", "hu", "star")).toBe(
			"npx shadcn@latest add @animateicons/hu-star",
		);
	});
});
