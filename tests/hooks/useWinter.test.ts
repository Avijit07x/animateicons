import { isWinter } from "@/components/winter/useWinter";
import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("isWinter", () => {
	it("is off before December 1", () => {
		expect(isWinter(new Date(2026, 10, 30))).toBe(false);
	});

	it("turns on December 1", () => {
		expect(isWinter(new Date(2026, 11, 1))).toBe(true);
	});

	it("stays on through the new year", () => {
		expect(isWinter(new Date(2026, 11, 31))).toBe(true);
		expect(isWinter(new Date(2027, 0, 1))).toBe(true);
		expect(isWinter(new Date(2027, 0, 5))).toBe(true);
	});

	it("turns off January 6", () => {
		expect(isWinter(new Date(2027, 0, 6))).toBe(false);
	});

	it("is off the rest of the year", () => {
		expect(isWinter(new Date(2026, 5, 15))).toBe(false);
		expect(isWinter(new Date(2026, 9, 3))).toBe(false);
	});
});

describe("useWinter", () => {
	const setToday = (year: number, month: number, day: number) => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(year, month, day, 12));
	};

	const setUrl = (search: string) =>
		window.history.replaceState({}, "", `/${search}`);

	const loadHook = async () => {
		vi.resetModules();
		const { useWinter } = await import("@/components/winter/useWinter");
		return () => renderHook(() => useWinter()).result.current;
	};

	afterEach(() => {
		vi.useRealTimers();
		setUrl("");
	});

	it("is true when today is inside the window", async () => {
		setToday(2026, 11, 15);
		expect((await loadHook())()).toBe(true);
	});

	it("is false when today is outside the window", async () => {
		setToday(2026, 9, 3);
		expect((await loadHook())()).toBe(false);
	});

	it("?season=winter turns it on outside the window", async () => {
		setToday(2026, 9, 3);
		setUrl("?season=winter");
		expect((await loadHook())()).toBe(true);
	});

	it("?season=off turns it off inside the window", async () => {
		setToday(2026, 11, 15);
		setUrl("?season=off");
		expect((await loadHook())()).toBe(false);
	});

	it("keeps the choice while the page stays open", async () => {
		setToday(2026, 9, 3);
		setUrl("?season=winter");
		const read = await loadHook();
		expect(read()).toBe(true);
		setUrl("");
		expect(read()).toBe(true);
	});

	it("forgets the choice after a reload and goes back to the date", async () => {
		setToday(2026, 9, 3);
		setUrl("?season=winter");
		expect((await loadHook())()).toBe(true);
		setUrl("");
		expect((await loadHook())()).toBe(false);
		expect(sessionStorage.getItem("season")).toBeNull();
	});

	it("ignores unknown values", async () => {
		setToday(2026, 9, 3);
		setUrl("?season=spring");
		expect((await loadHook())()).toBe(false);
	});
});
