import {
	assertLimit,
	assertOptions,
	assertString,
	createBoundedCache,
	describeValue,
	isObject,
} from "@animateicons/core/search-support";
import { describe, expect, it } from "vitest";
import {
	expectError,
	expectErrorEach,
} from "@/core/__tests__/helpers/expect-error";

describe("describeValue", () => {
	it("says what a value is in a few words", () => {
		expect(describeValue("bell")).toBe('"bell"');
		expect(describeValue(42)).toBe("42");
		expect(describeValue(NaN)).toBe("NaN");
		expect(describeValue(undefined)).toBe("undefined");
		expect(describeValue(null)).toBe("null");
		expect(describeValue(true)).toBe("true");
		expect(describeValue([])).toBe("an array");
		expect(describeValue({})).toBe("an object");
		expect(describeValue(() => 1)).toBe("a function");
		expect(describeValue(BigInt(10))).toBe("10n");
		expect(describeValue(Symbol("s"))).toBe("Symbol(s)");
	});

	it("shortens a very long string", () => {
		expect(describeValue("x".repeat(500))).toBe(`"${"x".repeat(40)}…"`);
	});
});

describe("isObject", () => {
	it("accepts plain objects only", () => {
		expect(isObject({})).toBe(true);
		expect(isObject({ a: 1 })).toBe(true);
		for (const value of [null, undefined, [], "x", 1, () => 1]) {
			expect(isObject(value)).toBe(false);
		}
	});
});

describe("assertString", () => {
	it("passes strings, including empty ones", () => {
		expect(() => assertString("", "scope", "query")).not.toThrow();
		expect(() => assertString("bell", "scope", "query")).not.toThrow();
	});

	it("names the scope, the label and what it received", () => {
		expectErrorEach(
			[
				[undefined, "undefined"],
				[7, "7"],
				[["a"], "an array"],
			],
			(bad) => assertString(bad, "find", "name"),
			TypeError,
			(shown) => `find: name must be a string, received ${shown}.`,
		);
	});
});

describe("assertOptions", () => {
	const keys = ["limit", "library", "tieBreak"];

	it("returns the options when they are valid", () => {
		const options = { limit: 3 };
		expect(assertOptions(options, "scope", "{ limit: 20 }", keys)).toBe(
			options,
		);
		expect(assertOptions({}, "scope", "{ limit: 20 }", keys)).toEqual({});
	});

	it("rejects anything that is not a plain object", () => {
		expectErrorEach(
			[
				[null, "null"],
				[5, "5"],
				["a", '"a"'],
				[[], "an array"],
			],
			(bad) => assertOptions(bad, "find", "{ limit: 20 }", keys),
			TypeError,
			(shown) =>
				`find: options must be an object like { limit: 20 }, received ${shown}.`,
		);
	});

	it("lists the valid options in plain words", () => {
		expectError(
			() => assertOptions({ max: 1 }, "find", "{}", ["limit"]),
			TypeError,
			'find: unknown option "max". Valid options are "limit".',
		);
		expectError(
			() => assertOptions({ max: 1 }, "find", "{}", ["limit", "library"]),
			TypeError,
			'find: unknown option "max". Valid options are "limit" and "library".',
		);
		expectError(
			() => assertOptions({ max: 1 }, "find", "{}", keys),
			TypeError,
			'find: unknown option "max". Valid options are "limit", "library" and "tieBreak".',
		);
	});
});

describe("assertLimit", () => {
	it("passes a whole number of 1 or more", () => {
		for (const value of [1, 2, 20, 2000]) {
			expect(() => assertLimit(value, "find")).not.toThrow();
		}
	});

	it("rejects everything else, with an optional hint", () => {
		expectErrorEach(
			[
				[0, "0"],
				[-1, "-1"],
				[1.5, "1.5"],
				[NaN, "NaN"],
				[Infinity, "Infinity"],
				["3", '"3"'],
				[null, "null"],
				[undefined, "undefined"],
			],
			(bad) => assertLimit(bad, "find"),
			RangeError,
			(shown) =>
				`find: limit must be a whole number of 1 or more, received ${shown}.`,
		);
		expectError(
			() => assertLimit(0, "find", "Leave it out to get every match."),
			RangeError,
			"find: limit must be a whole number of 1 or more, received 0. Leave it out to get every match.",
		);
	});
});

describe("createBoundedCache", () => {
	it("stores and returns values", () => {
		const cache = createBoundedCache<number>(3);
		expect(cache.get("a")).toBeUndefined();
		expect(cache.set("a", 1)).toBe(1);
		expect(cache.get("a")).toBe(1);
	});

	it("drops the oldest entry when it is full", () => {
		const cache = createBoundedCache<number>(2);
		cache.set("a", 1);
		cache.set("b", 2);
		cache.set("c", 3);
		expect(cache.get("a")).toBeUndefined();
		expect(cache.get("b")).toBe(2);
		expect(cache.get("c")).toBe(3);
	});

	it("does not drop anything when an existing key is replaced", () => {
		const cache = createBoundedCache<number>(2);
		cache.set("a", 1);
		cache.set("b", 2);
		cache.set("a", 10);
		expect(cache.get("a")).toBe(10);
		expect(cache.get("b")).toBe(2);
	});

	it("keeps returning the same object it was given", () => {
		const cache = createBoundedCache<string[]>(2);
		const value = ["x"];
		expect(cache.set("k", value)).toBe(value);
		expect(cache.get("k")).toBe(value);
	});
});
