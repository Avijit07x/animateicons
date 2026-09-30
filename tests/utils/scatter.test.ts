import { scatter } from "@/utils/scatter";
import { describe, expect, it } from "vitest";

describe("scatter", () => {
	it("returns one point per item", () => {
		expect(scatter(30, 10, 3)).toHaveLength(30);
	});

	it("is deterministic for the same seed", () => {
		expect(scatter(12, 4, 3)).toEqual(scatter(12, 4, 3));
	});

	it("changes with the seed", () => {
		expect(scatter(12, 4, 3, 1)).not.toEqual(scatter(12, 4, 3, 2));
	});

	it("keeps every point inside its box", () => {
		for (const p of scatter(30, 10, 3)) {
			expect(Number(p.left)).toBeGreaterThan(0);
			expect(Number(p.left)).toBeLessThan(100);
			expect(Number(p.top)).toBeGreaterThan(0);
			expect(Number(p.top)).toBeLessThan(100);
		}
	});

	it("thins out alternate cells", () => {
		const points = scatter(4, 2, 2);
		expect(points.map((p) => p.thinned)).toEqual([false, true, true, false]);
	});
});
