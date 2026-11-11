import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FRAMEWORK_GUIDES } from "@/app/icons/docs/_lib/frameworks";
import { ICON_COUNT_LABELS } from "@/lib/icon-count.generated";
import { homeMarkdown, skillMarkdown } from "../../scripts/agent-pages";
import { buildDocs, llmsIndex } from "../../scripts/docs-markdown";

const read = (file: string) =>
	fs.readFileSync(path.join(process.cwd(), "public", file), "utf8");

describe("index.md and skill.md", () => {
	it("match the committed files (run pnpm gen:docs)", () => {
		expect(read("index.md")).toBe(homeMarkdown());
		expect(read("skill.md")).toBe(skillMarkdown());
	});

	it("state the current icon counts", () => {
		const home = homeMarkdown();

		expect(home).toContain(`${ICON_COUNT_LABELS.total} free, open source`);
		expect(home).toContain(`${ICON_COUNT_LABELS.lucide} Lucide-style icons`);
		expect(home).toContain(`${ICON_COUNT_LABELS.huge} Huge-style icons`);
		expect(skillMarkdown()).toContain(
			`${ICON_COUNT_LABELS.total} free, open source`,
		);
	});

	it("name every framework package", () => {
		for (const { pkg } of FRAMEWORK_GUIDES) {
			expect(homeMarkdown()).toContain(`\`${pkg}\``);
			expect(skillMarkdown()).toContain(`\`${pkg}\``);
		}
	});

	it("give skill.md a name and description", () => {
		expect(skillMarkdown()).toMatch(
			/^---\nname: animateicons\ndescription: .+\n---\n/,
		);
	});

	it("are linked from llms.txt", async () => {
		const index = llmsIndex(await buildDocs());

		expect(index).toContain("https://animateicons.in/index.md");
		expect(index).toContain("https://animateicons.in/skill.md");
	});
});
