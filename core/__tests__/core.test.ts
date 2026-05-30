import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vitest";

import {
	fetchCatalog,
	fetchRegistryItem,
	renderIconContent,
	resolveIcon,
	searchIcons,
	writeIcon,
} from "../src/index";
import type { Catalog } from "../src/types";

const FIXTURES = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	"fixtures",
);

async function loadCatalog(): Promise<Catalog> {
	return fetchCatalog({ registryBase: FIXTURES });
}

const tmpDirs: string[] = [];
function makeTmpDir(): string {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-core-"));
	tmpDirs.push(dir);
	return dir;
}

afterAll(() => {
	for (const dir of tmpDirs) fs.rmSync(dir, { recursive: true, force: true });
});

describe("fetchCatalog", () => {
	it("reads a local catalog directory", async () => {
		const catalog = await loadCatalog();
		expect(catalog.total).toBe(4);
		expect(catalog.icons).toHaveLength(4);
	});
});

describe("fetchRegistryItem", () => {
	it("reads a per-icon registry item from a local directory", async () => {
		const item = await fetchRegistryItem("lu-bell-ring", {
			registryBase: FIXTURES,
		});
		expect(item.name).toBe("bell-ring");
		expect(item.files[0].content).toContain("BellRingIcon");
	});
});

describe("searchIcons", () => {
	it("finds bell-ring by a keyword", async () => {
		const catalog = await loadCatalog();
		const names = searchIcons(catalog, "notification").map(
			(i) => i.registryName,
		);
		expect(names).toContain("lu-bell-ring");
	});

	it("filters by library", async () => {
		const catalog = await loadCatalog();
		const results = searchIcons(catalog, "activity", { library: "huge" });
		expect(results.every((i) => i.library === "huge")).toBe(true);
		expect(results.map((i) => i.registryName)).toContain("hu-activity");
	});

	it("returns the head for an empty query", async () => {
		const catalog = await loadCatalog();
		expect(searchIcons(catalog, "", { limit: 2 })).toHaveLength(2);
	});
});

describe("resolveIcon", () => {
	it("resolves a prefixed registry name", async () => {
		const catalog = await loadCatalog();
		expect(resolveIcon(catalog, "lu-bell-ring").match?.registryName).toBe(
			"lu-bell-ring",
		);
	});

	it("resolves a unique bare base name", async () => {
		const catalog = await loadCatalog();
		expect(resolveIcon(catalog, "bell-ring").match?.registryName).toBe(
			"lu-bell-ring",
		);
	});

	it("reports ambiguity for a base name in multiple libraries", async () => {
		const catalog = await loadCatalog();
		const res = resolveIcon(catalog, "activity");
		expect(res.match).toBeNull();
		expect(res.ambiguous.map((i) => i.registryName).sort()).toEqual([
			"hu-activity",
			"lu-activity",
		]);
	});

	it("returns suggestions for an unknown name", async () => {
		const catalog = await loadCatalog();
		const res = resolveIcon(catalog, "bel");
		expect(res.match).toBeNull();
		expect(res.suggestions.length).toBeGreaterThan(0);
	});
});

describe("renderIconContent / writeIcon", () => {
	it("rewrites the @/lib/utils import when a different alias is given", async () => {
		const item = await fetchRegistryItem("lu-bell-ring", {
			registryBase: FIXTURES,
		});
		const out = renderIconContent(item, { utilsImport: "~/utils" });
		expect(out).toContain('from "~/utils"');
		expect(out).not.toContain("@/lib/utils");
	});

	it("leaves the import untouched by default", async () => {
		const item = await fetchRegistryItem("lu-bell-ring", {
			registryBase: FIXTURES,
		});
		expect(renderIconContent(item)).toContain('from "@/lib/utils"');
	});

	it("writes the file and then respects the overwrite guard", async () => {
		const item = await fetchRegistryItem("lu-bell-ring", {
			registryBase: FIXTURES,
		});
		const dir = makeTmpDir();

		const first = writeIcon(item, {
			targetDir: dir,
			fileName: "bell-ring.tsx",
		});
		expect(first.skipped).toBe(false);
		expect(fs.existsSync(first.file)).toBe(true);

		const second = writeIcon(item, {
			targetDir: dir,
			fileName: "bell-ring.tsx",
		});
		expect(second.skipped).toBe(true);

		const third = writeIcon(item, {
			targetDir: dir,
			fileName: "bell-ring.tsx",
			overwrite: true,
		});
		expect(third.skipped).toBe(false);
	});
});
