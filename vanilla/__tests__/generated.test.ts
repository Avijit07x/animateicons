import { describe, expect, it } from "vitest";
import manifest from "../src/generated/manifest.json";
import * as huge from "../src/generated/huge";
import * as lucide from "../src/generated/lucide";
import type { IconData, IconNode } from "../src/types";

const libraries = { lucide, huge } as Record<string, Record<string, IconData>>;

const countAnimated = (node: IconNode): number =>
	(node.animate ? 1 : 0) +
	(node.children ?? []).reduce(
		(total, child) => total + countAnimated(child),
		0,
	);

describe("generated icon data", () => {
	it("exports every icon in the manifest under its library", () => {
		for (const { library, name, exportName } of manifest) {
			const icon = libraries[library][exportName];
			expect(icon, `${library}/${name}`).toBeDefined();
			expect(icon.name).toBe(name);
			expect(icon.library).toBe(library);
		}
		expect(Object.keys(lucide).length + Object.keys(huge).length).toBe(
			manifest.length,
		);
	});

	it("gives every icon an svg root with a view box and something that moves", () => {
		for (const icon of [...Object.values(lucide), ...Object.values(huge)]) {
			expect(icon.tag).toBe("svg");
			expect(icon.attrs?.viewBox, icon.name).toBeTruthy();
			expect(countAnimated(icon), icon.name).toBeGreaterThan(0);
		}
	});
});
