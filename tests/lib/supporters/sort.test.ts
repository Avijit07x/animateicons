/**
 * Tests for the supporter sort comparator. Dated entries newest-first,
 * undated grouped after dated, ordered alphabetically by name.
 */

import { describe, expect, it } from "vitest";
import { compareSupporters } from "@/lib/supporters/sort";
import type { Supporter } from "@/lib/supporters/types";

const make = (overrides: Partial<Supporter> = {}): Supporter => ({
	id: "bmc:1",
	source: "bmc",
	name: "Test",
	avatarUrl: null,
	message: null,
	amount: null,
	currency: null,
	createdAt: null,
	url: null,
	...overrides,
});

describe("compareSupporters", () => {
	it("places newer dated supporters before older ones", () => {
		const older = make({ id: "bmc:1", createdAt: "2026-01-01T00:00:00Z" });
		const newer = make({ id: "bmc:2", createdAt: "2026-04-01T00:00:00Z" });
		const result = [older, newer].sort(compareSupporters);
		expect(result.map((s) => s.id)).toEqual(["bmc:2", "bmc:1"]);
	});

	it("groups dated supporters before undated ones", () => {
		const undated = make({
			id: "github:alice",
			source: "github",
			name: "Alice",
		});
		const dated = make({ id: "bmc:1", createdAt: "2026-04-01T00:00:00Z" });
		const result = [undated, dated].sort(compareSupporters);
		expect(result[0]).toBe(dated);
		expect(result[1]).toBe(undated);
	});

	it("sorts undated supporters alphabetically by name", () => {
		const charlie = make({ id: "github:charlie", source: "github", name: "Charlie" });
		const alice = make({ id: "github:alice", source: "github", name: "Alice" });
		const bob = make({ id: "github:bob", source: "github", name: "Bob" });
		const result = [charlie, alice, bob].sort(compareSupporters);
		expect(result.map((s) => s.name)).toEqual(["Alice", "Bob", "Charlie"]);
	});

	it("is stable when timestamps are identical (returns 0)", () => {
		const a = make({ id: "bmc:1", createdAt: "2026-04-01T00:00:00Z" });
		const b = make({ id: "bmc:2", createdAt: "2026-04-01T00:00:00Z" });
		expect(compareSupporters(a, b)).toBe(0);
	});
});
