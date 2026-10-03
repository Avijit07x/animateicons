import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { docsNav } from "@/app/icons/docs/_lib/nav";
import { buildDocs } from "../../scripts/docs-markdown";

const committed = () =>
	JSON.parse(
		fs.readFileSync(path.join(process.cwd(), "public/r/docs.json"), "utf8"),
	);

describe("docs.json", () => {
	it("has a page for every docs nav entry, in nav order", async () => {
		const docs = await buildDocs();
		const titles = docsNav.flatMap((group) => group.items.map((i) => i.title));

		expect(docs.pages.map((p) => p.title)).toEqual(titles);
		expect(docs.total).toBe(titles.length);
	});

	it("gives every page a unique slug, description and content", async () => {
		const docs = await buildDocs();
		const slugs = docs.pages.map((p) => p.slug);

		expect(new Set(slugs).size).toBe(slugs.length);
		for (const page of docs.pages) {
			expect(page.description).not.toBe("");
			expect(page.content.startsWith("# ")).toBe(true);
		}
	});

	it("turns the MDX into plain markdown", async () => {
		const docs = await buildDocs();
		const text = docs.pages.map((p) => p.content).join("\n");

		expect(text).not.toMatch(
			/<(CodeBlock|CommandBlock|ExamplePreview|Callout)/,
		);
		expect(text).not.toMatch(/^export const /m);
		expect(text).not.toMatch(/\{ICON_COUNTS/);
		expect(text).not.toContain("](/");
	});

	it("carries the hook source and the icon props", async () => {
		const docs = await buildDocs();
		const page = (slug: string) =>
			docs.pages.find((p) => p.slug === slug)?.content ?? "";

		expect(page("examples/hover-helper")).toContain(
			"export function useIconHover",
		);
		expect(page("usage")).toContain("startAnimation");
		expect(page("usage")).toContain("isAnimated");
	});

	it("matches the committed public/r/docs.json (run pnpm gen:docs)", async () => {
		expect(committed()).toEqual(await buildDocs());
	});
});
