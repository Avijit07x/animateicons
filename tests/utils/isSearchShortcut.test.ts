import { isSearchShortcut } from "@/utils/isSearchShortcut";
import { describe, expect, it } from "vitest";

const key = (init: KeyboardEventInit) =>
	new KeyboardEvent("keydown", { key: "k", ...init });

describe("isSearchShortcut", () => {
	it("uses Cmd+K on a Mac and leaves Ctrl+K alone", () => {
		expect(isSearchShortcut(key({ metaKey: true }), true)).toBe(true);
		expect(isSearchShortcut(key({ ctrlKey: true }), true)).toBe(false);
	});

	it("uses Ctrl+K elsewhere and leaves the Windows key alone", () => {
		expect(isSearchShortcut(key({ ctrlKey: true }), false)).toBe(true);
		expect(isSearchShortcut(key({ metaKey: true }), false)).toBe(false);
	});

	it("ignores other keys and a bare K", () => {
		expect(isSearchShortcut(key({ key: "j", metaKey: true }), true)).toBe(
			false,
		);
		expect(isSearchShortcut(key({}), true)).toBe(false);
	});
});
