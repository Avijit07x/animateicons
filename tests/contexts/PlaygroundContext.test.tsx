/**
 * Tests for PlaygroundContext — tracks which AnimateIcons icon is
 * currently being explored in the playground sheet, and the
 * iconNameToComponent helper that turns "bell-ring" into
 * "BellRingIcon" for the playground's copyable JSX snippet.
 */

import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
	iconNameToComponent,
	PlaygroundProvider,
	usePlayground,
} from "@/app/icons/_contexts/PlaygroundContext";

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<PlaygroundProvider>{children}</PlaygroundProvider>
);

const Stub: React.FC = () => null;

describe("iconNameToComponent", () => {
	it("converts kebab-case to PascalCase + Icon suffix", () => {
		expect(iconNameToComponent("bell")).toBe("BellIcon");
		expect(iconNameToComponent("bell-ring")).toBe("BellRingIcon");
		expect(iconNameToComponent("git-branch-plus")).toBe("GitBranchPlusIcon");
	});

	it("ignores empty segments from leading or trailing dashes", () => {
		expect(iconNameToComponent("-bell-")).toBe("BellIcon");
		expect(iconNameToComponent("--foo--bar")).toBe("FooBarIcon");
	});
});

describe("PlaygroundContext", () => {
	it("starts closed with no icon", () => {
		const { result } = renderHook(() => usePlayground(), { wrapper });
		expect(result.current.open).toBe(false);
		expect(result.current.icon).toBeNull();
	});

	it("openPlayground sets icon and opens", () => {
		const { result } = renderHook(() => usePlayground(), { wrapper });

		act(() =>
			result.current.openPlayground({
				name: "bell",
				Component: Stub,
				componentName: "BellIcon",
			}),
		);

		expect(result.current.open).toBe(true);
		expect(result.current.icon?.name).toBe("bell");
	});

	it("closePlayground only flips open=false (icon stays for exit animation)", () => {
		const { result } = renderHook(() => usePlayground(), { wrapper });

		act(() =>
			result.current.openPlayground({
				name: "bell",
				Component: Stub,
				componentName: "BellIcon",
			}),
		);
		act(() => result.current.closePlayground());

		expect(result.current.open).toBe(false);
		expect(result.current.icon?.name).toBe("bell");
	});
});
