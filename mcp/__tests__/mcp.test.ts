import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vitest";

import { createServer } from "../src/server";
import {
	addIconTool,
	getDocsTool,
	getIconTool,
	listLibrariesTool,
	searchIconsTool,
	type ToolContext,
} from "../src/tools";

const PUBLIC_R = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"../../public/r",
);
const ctx: ToolContext = { registryBase: PUBLIC_R };

const tmpDirs: string[] = [];
function makeTmpDir(): string {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-mcp-"));
	tmpDirs.push(dir);
	return dir;
}

afterAll(() => {
	for (const dir of tmpDirs) fs.rmSync(dir, { recursive: true, force: true });
});

describe("createServer", () => {
	it("builds without throwing", () => {
		expect(createServer(ctx)).toBeTruthy();
	});
});

describe("tools", () => {
	it("search_icons finds by keyword", async () => {
		const out = await searchIconsTool(ctx, { query: "notification" });
		expect(out.results.map((r) => r.registryName)).toContain("lu-bell-ring");
	});

	it("search_icons ranks real matches first and drops look-alikes", async () => {
		const files = await searchIconsTool(ctx, { query: "files" });
		expect(files.results.slice(0, 2).map((r) => r.registryName)).toContain(
			"lu-files",
		);
		const cart = await searchIconsTool(ctx, { query: "cart", limit: 50 });
		const names = cart.results.map((r) => r.registryName);
		expect(names).toContain("lu-shopping-cart");
		expect(names.some((n) => n.includes("chart"))).toBe(false);
	});

	it("search_icons reports the count it returns", async () => {
		const out = await searchIconsTool(ctx, { query: "arrow", limit: 5 });
		expect(out.count).toBe(5);
		expect(out.results).toHaveLength(5);
	});

	it("list_libraries reports counts", async () => {
		const out = await listLibrariesTool(ctx);
		expect(out.total).toBeGreaterThan(0);
		expect(out.libraries.lucide).toBeGreaterThan(0);
	});

	it("get_icon returns source + import snippet", async () => {
		const out = await getIconTool(ctx, { name: "lu-bell-ring" });
		expect(out.found).toBe(true);
		expect(out.componentName).toBe("BellRingIcon");
		expect(out.source).toContain("BellRingIcon");
		expect(out.importSnippet).toContain("BellRingIcon");
	});

	it("get_icon reports not-found with suggestions", async () => {
		const out = await getIconTool(ctx, { name: "bell-rng" });
		expect(out.found).toBe(false);
		expect(out.message).toBeTruthy();
	});

	it("add_icon writes the component to disk", async () => {
		const cwd = makeTmpDir();
		const out = await addIconTool({ ...ctx, cwd }, { name: "lu-bell-ring" });
		expect(out.added).toBe(true);
		expect(out.file && fs.existsSync(out.file)).toBe(true);
		expect(fs.readFileSync(out.file!, "utf8")).toContain("BellRingIcon");
	});

	it("get_docs lists the pages without their content", async () => {
		const out = await getDocsTool(ctx, {});
		const slugs = out.pages?.map((p) => p.slug);
		expect(slugs).toContain("usage");
		expect(slugs).toContain("examples/hover-helper");
		expect(out.pages?.every((p) => !("content" in p))).toBe(true);
	});

	it("get_docs reads the hover helper page", async () => {
		const out = await getDocsTool(ctx, { page: "hover helper" });
		expect(out.found).toBe(true);
		expect(out.slug).toBe("examples/hover-helper");
		expect(out.content).toContain("useIconHover");
		expect(out.content).toContain('trigger: "both"');
	});

	it("get_docs reads the usage page props", async () => {
		const out = await getDocsTool(ctx, { page: "usage" });
		expect(out.content).toContain("startAnimation");
		expect(out.content).toContain("isAnimated");
	});

	it("get_docs reports an unknown page with the available slugs", async () => {
		const out = await getDocsTool(ctx, { page: "nope" });
		expect(out.found).toBe(false);
		expect(out.message).toContain("usage");
	});
});
