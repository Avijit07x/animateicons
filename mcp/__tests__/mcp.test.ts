import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vitest";

import { fetchRegistryItem, renderIconContent } from "@animateicons/core";

import { createServer } from "../src/server";
import {
	addIconTool,
	frameworkUsage,
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

describe("get_icon frameworks", () => {
	it("keeps the React output unchanged by default and for framework react", async () => {
		const item = await fetchRegistryItem("lu-bell-ring", {
			registryBase: PUBLIC_R,
		});
		const expected = {
			found: true,
			name: "bell-ring",
			registryName: "lu-bell-ring",
			library: "lucide",
			fileName: "bell-ring.tsx",
			componentName: "BellRingIcon",
			importSnippet:
				'import { BellRingIcon } from "@/components/icons/bell-ring";',
			source: renderIconContent(item),
		};
		const byDefault = await getIconTool(ctx, { name: "lu-bell-ring" });
		const explicit = await getIconTool(ctx, {
			name: "lu-bell-ring",
			framework: "react",
		});
		expect(JSON.stringify(byDefault)).toBe(JSON.stringify(expected));
		expect(JSON.stringify(explicit)).toBe(JSON.stringify(expected));
	});

	it("returns vanilla code for a Lucide icon", async () => {
		const out = await getIconTool(ctx, {
			name: "lu-bell-ring",
			framework: "vanilla",
		});
		expect(out).toEqual({
			found: true,
			name: "bell-ring",
			registryName: "lu-bell-ring",
			library: "lucide",
			framework: "vanilla",
			exportName: "BellRing",
			install: "npm i @animateicons/vanilla",
			usage: [
				'import { createIcon } from "@animateicons/vanilla";',
				'import { BellRing } from "@animateicons/vanilla/lucide";',
				"",
				"const icon = createIcon(BellRing, { size: 24 });",
				"document.body.append(icon);",
			].join("\n"),
			customElement: [
				'<script type="module">',
				'  import { defineIcons } from "@animateicons/vanilla";',
				'  import { BellRing } from "@animateicons/vanilla/lucide";',
				"  defineIcons({ BellRing });",
				"</script>",
				'<animate-icons name="bell-ring"></animate-icons>',
			].join("\n"),
			cdn: [
				'<script src="https://cdn.jsdelivr.net/npm/@animateicons/vanilla/dist/cdn/lucide.js"></script>',
				'<animate-icons name="bell-ring"></animate-icons>',
			].join("\n"),
		});
		expect(out.source).toBeUndefined();
	});

	it("returns vanilla code for a Huge icon", async () => {
		const out = await getIconTool(ctx, {
			name: "hu-arrow-up-right-0-1",
			framework: "vanilla",
		});
		expect(out.library).toBe("huge");
		expect(out.exportName).toBe("ArrowUpRight01");
		expect(out.usage).toContain(
			'import { ArrowUpRight01 } from "@animateicons/vanilla/huge";',
		);
		expect(out.usage).toContain("createIcon(ArrowUpRight01, { size: 24 })");
		expect(out.customElement).toContain("defineIcons({ ArrowUpRight01 });");
		expect(out.customElement).toContain(
			'<animate-icons name="arrow-up-right-0-1"></animate-icons>',
		);
		expect(out.cdn).toContain(
			"https://cdn.jsdelivr.net/npm/@animateicons/vanilla/dist/cdn/huge.js",
		);
	});

	it("returns Vue code for a Lucide icon", async () => {
		const out = await getIconTool(ctx, {
			name: "lu-bell-ring",
			framework: "vue",
		});
		expect(out).toEqual({
			found: true,
			name: "bell-ring",
			registryName: "lu-bell-ring",
			library: "lucide",
			framework: "vue",
			exportName: "BellRingIcon",
			install: "npm i @animateicons/vue",
			usage: [
				'<script setup lang="ts">',
				'import { BellRingIcon } from "@animateicons/vue/lucide";',
				"</script>",
				"",
				"<template>",
				'  <BellRingIcon :size="24" />',
				"</template>",
			].join("\n"),
		});
	});

	it("returns Vue code for a Huge icon", async () => {
		const out = await getIconTool(ctx, {
			name: "hu-arrow-up-right-0-1",
			framework: "vue",
		});
		expect(out.exportName).toBe("ArrowUpRight01Icon");
		expect(out.install).toBe("npm i @animateicons/vue");
		expect(out.usage).toContain(
			'import { ArrowUpRight01Icon } from "@animateicons/vue/huge";',
		);
		expect(out.usage).toContain('<ArrowUpRight01Icon :size="24" />');
	});

	it("returns Angular code for a Lucide icon", async () => {
		const out = await getIconTool(ctx, {
			name: "lu-bell-ring",
			framework: "angular",
		});
		expect(out.exportName).toBe("BellRing");
		expect(out.install).toBe("npm i @animateicons/angular");
		expect(out.usage).toBe(
			[
				'import { Component } from "@angular/core";',
				'import { AnimateIcons } from "@animateicons/angular";',
				'import { BellRing } from "@animateicons/angular/lucide";',
				"",
				"@Component({",
				'  selector: "app-example",',
				"  imports: [AnimateIcons],",
				'  template: `<animate-icons [icon]="bellRing" [size]="24" />`,',
				"})",
				"export class Example {",
				"  bellRing = BellRing;",
				"}",
			].join("\n"),
		);
	});

	it("returns Angular code for a Huge icon", async () => {
		const out = await getIconTool(ctx, {
			name: "hu-arrow-up-right-0-1",
			framework: "angular",
		});
		expect(out.usage).toContain(
			'import { ArrowUpRight01 } from "@animateicons/angular/huge";',
		);
		expect(out.usage).toContain('[icon]="arrowUpRight01"');
		expect(out.usage).toContain("arrowUpRight01 = ArrowUpRight01;");
	});

	it("frameworkUsage only adds the custom element and CDN for vanilla", () => {
		expect(frameworkUsage("vanilla", "bell", "lucide").cdn).toBeTruthy();
		expect(frameworkUsage("vue", "bell", "lucide").cdn).toBeUndefined();
		expect(
			frameworkUsage("angular", "bell", "huge").customElement,
		).toBeUndefined();
	});

	it("reports not found for any framework", async () => {
		const out = await getIconTool(ctx, {
			name: "bell-rng",
			framework: "vue",
		});
		expect(out.found).toBe(false);
	});
});
