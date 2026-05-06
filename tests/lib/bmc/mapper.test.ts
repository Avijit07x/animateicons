/**
 * Tests for the BMC raw → Supporter mapper. Pure function, no I/O.
 */

import { describe, expect, it } from "vitest";
import { mapBmcSupporter } from "@/lib/bmc/mapper";
import type { BmcSupporterRaw } from "@/lib/bmc/types";

const baseRaw: BmcSupporterRaw = {
	support_id: 42,
	supporter_name: "Helio",
	support_note: "Love the icons!",
	support_coffees: 3,
	support_coffee_price: "5.00",
	support_currency: "USD",
	support_created_on: "2026-04-12T10:00:00Z",
	support_visibility: 1,
};

describe("mapBmcSupporter", () => {
	it("maps a vanilla supporter into the unified shape", () => {
		const result = mapBmcSupporter(baseRaw);
		expect(result).toEqual({
			id: "bmc:42",
			source: "bmc",
			name: "Helio",
			avatarUrl: null,
			message: "Love the icons!",
			amount: 15,
			currency: "USD",
			createdAt: "2026-04-12T10:00:00Z",
			url: null,
		});
	});

	it("falls back to 'Anonymous' when name is missing or whitespace", () => {
		expect(mapBmcSupporter({ ...baseRaw, supporter_name: null }).name).toBe(
			"Anonymous",
		);
		expect(mapBmcSupporter({ ...baseRaw, supporter_name: "   " }).name).toBe(
			"Anonymous",
		);
	});

	it("trims surrounding whitespace from name and note", () => {
		const result = mapBmcSupporter({
			...baseRaw,
			supporter_name: "  Helio  ",
			support_note: "  thanks!  ",
		});
		expect(result.name).toBe("Helio");
		expect(result.message).toBe("thanks!");
	});

	it("returns null message when note is empty or whitespace", () => {
		expect(mapBmcSupporter({ ...baseRaw, support_note: null }).message).toBeNull();
		expect(mapBmcSupporter({ ...baseRaw, support_note: "" }).message).toBeNull();
		expect(mapBmcSupporter({ ...baseRaw, support_note: "   " }).message).toBeNull();
	});

	it("coerces amount to null when price is non-numeric", () => {
		const result = mapBmcSupporter({
			...baseRaw,
			support_coffee_price: "not-a-number",
		});
		expect(result.amount).toBeNull();
	});

	it("coerces amount to null when computed total is zero or negative", () => {
		expect(
			mapBmcSupporter({ ...baseRaw, support_coffees: 0 }).amount,
		).toBeNull();
	});

	it("multiplies coffees × price correctly with decimal prices", () => {
		const result = mapBmcSupporter({
			...baseRaw,
			support_coffees: 2,
			support_coffee_price: "3.50",
		});
		expect(result.amount).toBe(7);
	});

	it("namespaces the id with 'bmc:' so it can't collide with github:", () => {
		expect(mapBmcSupporter({ ...baseRaw, support_id: 1 }).id).toBe("bmc:1");
	});
});
