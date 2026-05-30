/**
 * Tests for firstGrapheme - uppercased first user-perceived character,
 * resilient to emoji, surrogate pairs, and combining marks.
 */

import { describe, expect, it } from "vitest";
import { firstGrapheme } from "@/lib/utils/firstGrapheme";

describe("firstGrapheme", () => {
	it("returns the first ASCII letter uppercased", () => {
		expect(firstGrapheme("helio")).toBe("H");
	});

	it("uppercases lowercase first letters", () => {
		expect(firstGrapheme("avijit")).toBe("A");
	});

	it("returns ? for empty / whitespace-only strings", () => {
		expect(firstGrapheme("")).toBe("?");
		expect(firstGrapheme("   ")).toBe("?");
	});

	it("trims leading whitespace before reading", () => {
		expect(firstGrapheme("  helio")).toBe("H");
	});

	it("returns the emoji intact (single grapheme), not a broken surrogate", () => {
		const result = firstGrapheme("🐈 helio");
		// Either the cat emoji (Segmenter present) or the cat emoji's first
		// code point - both render correctly and are not lone surrogates.
		expect(result.length).toBeGreaterThanOrEqual(1);
		expect(result).not.toBe("\uD83D"); // half a surrogate pair
	});

	it("returns a usable first character for accented input (NFC/NFD agnostic)", () => {
		// "école" - the result should be a short grapheme whose normalized
		// base is "E", regardless of source encoding.
		const result = firstGrapheme("école");
		expect(result).not.toBe("?");
		expect(result.length).toBeGreaterThan(0);
		expect(result.length).toBeLessThanOrEqual(2);
		expect(result.toUpperCase().normalize("NFD").startsWith("E")).toBe(true);
	});
});
