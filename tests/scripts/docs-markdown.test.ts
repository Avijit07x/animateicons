import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { docsNav } from "@/app/icons/docs/_lib/nav";
import {
	buildDocs,
	llmsFull,
	llmsIndex,
	pageMarkdown,
} from "../../scripts/docs-markdown";

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
		expect(page("react")).toContain("startAnimation");
		expect(page("react")).toContain("isAnimated");
		expect(page("vue")).toContain("@animateicons/vue");
		expect(page("installation")).toContain("@animateicons/angular");
	});

	it("matches the committed public/r/docs.json (run pnpm gen:docs)", async () => {
		expect(committed()).toEqual(await buildDocs());
	});

	it("matches the committed markdown pages and llms files (run pnpm gen:docs)", async () => {
		const docs = await buildDocs();
		const read = (file: string) =>
			fs.readFileSync(path.join(process.cwd(), "public", file), "utf8");

		for (const page of docs.pages) {
			expect(read(`r/docs/${page.slug}.md`)).toBe(pageMarkdown(page));
		}
		expect(read("llms.txt")).toBe(llmsIndex(docs));
		expect(read("llms-full.txt")).toBe(llmsFull(docs));
	});

	it("links every page from llms.txt to its markdown file", async () => {
		const docs = await buildDocs();
		const index = llmsIndex(docs);

		for (const page of docs.pages) {
			expect(index).toContain(`https://animateicons.in/r/docs/${page.slug}.md`);
		}
	});
});
