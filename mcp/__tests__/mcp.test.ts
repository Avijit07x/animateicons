import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vitest";

import { createServer } from "../src/server";
import {
	addIconTool,
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

	it("list_libraries reports counts", async () => {
		const out = await listLibrariesTool(ctx);
		expect(out.total).toBeGreaterThan(0);
		expect(out.libraries.lucide).toBeGreaterThan(0);
	});

	it("get_icon returns source + import snippet", async () => {
		const out = await getIconTool(ctx, { name: "bell-ring" });
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
		const out = await addIconTool({ ...ctx, cwd }, { name: "bell-ring" });
		expect(out.added).toBe(true);
		expect(out.file && fs.existsSync(out.file)).toBe(true);
		expect(fs.readFileSync(out.file!, "utf8")).toContain("BellRingIcon");
	});
});
