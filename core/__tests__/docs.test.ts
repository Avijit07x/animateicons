import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { fetchDocs, findDoc } from "../src/index";

const FIXTURES = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	"fixtures",
);

describe("fetchDocs", () => {
	it("reads a local docs file", async () => {
		const docs = await fetchDocs({ registryBase: FIXTURES });
		expect(docs.total).toBe(3);
		expect(docs.pages.map((p) => p.slug)).toEqual([
			"installation",
			"usage",
			"examples/hover-helper",
		]);
	});
});

describe("findDoc", () => {
	it("finds a page by slug, last segment, title or url", async () => {
		const docs = await fetchDocs({ registryBase: FIXTURES });
		const slugOf = (input: string) => findDoc(docs, input)?.slug;

		expect(slugOf("usage")).toBe("usage");
		expect(slugOf("examples/hover-helper")).toBe("examples/hover-helper");
		expect(slugOf("hover-helper")).toBe("examples/hover-helper");
		expect(slugOf("Hover helper")).toBe("examples/hover-helper");
		expect(slugOf("/icons/docs/usage")).toBe("usage");
		expect(slugOf("https://animateicons.in/icons/docs/usage/")).toBe("usage");
		expect(slugOf("Installation")).toBe("installation");
	});

	it("returns undefined for an unknown or empty page", async () => {
		const docs = await fetchDocs({ registryBase: FIXTURES });
		expect(findDoc(docs, "nope")).toBeUndefined();
		expect(findDoc(docs, "  ")).toBeUndefined();
	});
});
