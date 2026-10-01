import { ICON_META as HUGE_META } from "@/icons/huge/meta";
import { ICON_META as LUCIDE_META } from "@/icons/lucide/meta";
import { describe, expect, it } from "vitest";
import { familyOf, sortIconsByFamily } from "../../scripts/icon-order";

const names = (icons: { name: string }[]) => icons.map((i) => i.name);
const sorted = (list: string[]) =>
	names(sortIconsByFamily(list.map((name) => ({ name }))));

describe("sortIconsByFamily", () => {
	it("keeps each family together, in order of first appearance", () => {
		expect(sorted(["bell", "heart", "bell-off", "star", "heart-plus"])).toEqual(
			["bell", "bell-off", "heart", "heart-plus", "star"],
		);
	});

	it("puts the base icon first and sorts variants naturally", () => {
		expect(
			sorted(["map-pin-x", "map-pin", "map-pin-check", "map", "map-pin-10"]),
		).toEqual(["map", "map-pin", "map-pin-10", "map-pin-check", "map-pin-x"]);
	});

	it("sorts numbered variants by number", () => {
		expect(
			sorted(["arrow-up-0-10", "arrow-up", "arrow-up-0-2", "arrow-up-0-1"]),
		).toEqual(["arrow-up", "arrow-up-0-1", "arrow-up-0-2", "arrow-up-0-10"]);
	});

	it("merges aliased names into one family", () => {
		expect(
			sorted(["notification", "mail", "bell-ring", "notification-off"]),
		).toEqual(["notification", "notification-off", "bell-ring", "mail"]);
		expect(sorted(["chevrons-down", "chevron-up", "chevron-down"])).toEqual([
			"chevron-down",
			"chevron-up",
			"chevrons-down",
		]);
		expect(familyOf("chevrons-left")).toBe(familyOf("chevron-left"));
		expect(familyOf("upload")).toBe(familyOf("download"));
	});

	it("does not change the input and is idempotent", () => {
		const input = [{ name: "b-x" }, { name: "a" }, { name: "b" }];
		const once = sortIconsByFamily(input);
		expect(names(input)).toEqual(["b-x", "a", "b"]);
		expect(names(sortIconsByFamily(once))).toEqual(names(once));
	});
});

describe.each([
	["lucide", LUCIDE_META],
	["huge", HUGE_META],
])("%s gallery order", (library, meta) => {
	it("is grouped into families (run pnpm gen:icons if this fails)", () => {
		expect(names(meta)).toEqual(names(sortIconsByFamily(meta)));
	});

	it("never splits a family into two places", () => {
		const seen = new Set<string>();
		let previous = "";
		const split: string[] = [];

		for (const { name } of meta) {
			const family = familyOf(name);
			if (family !== previous && seen.has(family)) split.push(name);
			seen.add(family);
			previous = family;
		}

		expect(split, `${library}: families split apart`).toEqual([]);
	});
});
