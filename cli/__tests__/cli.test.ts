import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vitest";

import { runAdd } from "../src/commands/add";
import { runInfo, runList, runSearch } from "../src/commands/query";

// Run against the repo's real generated registry — no network needed.
const PUBLIC_R = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"../../public/r",
);

const tmpDirs: string[] = [];
function makeTmpDir(): string {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-cli-"));
	tmpDirs.push(dir);
	return dir;
}

afterAll(() => {
	for (const dir of tmpDirs) fs.rmSync(dir, { recursive: true, force: true });
});

describe("search / list / info", () => {
	it("searches by keyword", async () => {
		const names = (
			await runSearch("notification", { registryBase: PUBLIC_R })
		).map((i) => i.registryName);
		expect(names).toContain("lu-bell-ring");
	});

	it("lists a single library", async () => {
		const huge = await runList({ registryBase: PUBLIC_R, library: "huge" });
		expect(huge.length).toBeGreaterThan(0);
		expect(huge.every((i) => i.library === "huge")).toBe(true);
	});

	it("returns metadata for a known icon", async () => {
		const { icon } = await runInfo("bell-ring", { registryBase: PUBLIC_R });
		expect(icon?.registryName).toBe("lu-bell-ring");
		expect(icon?.url).toContain("/r/lu-bell-ring.json");
	});
});

describe("add", () => {
	it("writes an icon to the target directory", async () => {
		const cwd = makeTmpDir();
		const outcome = await runAdd(["bell-ring"], {
			cwd,
			dir: "components/icons",
			registryBase: PUBLIC_R,
		});

		expect(outcome.added).toHaveLength(1);
		expect(outcome.added[0].skipped).toBe(false);

		const written = path.join(cwd, "components/icons/bell-ring.tsx");
		expect(fs.existsSync(written)).toBe(true);

		const content = fs.readFileSync(written, "utf8");
		expect(content).toContain('"use client"');
		expect(content).toContain("BellRingIcon");
	});

	it("skips existing files unless --overwrite", async () => {
		const cwd = makeTmpDir();
		const opts = { cwd, dir: "components/icons", registryBase: PUBLIC_R };

		await runAdd(["bell-ring"], opts);
		const second = await runAdd(["bell-ring"], opts);
		expect(second.added[0].skipped).toBe(true);

		const third = await runAdd(["bell-ring"], { ...opts, overwrite: true });
		expect(third.added[0].skipped).toBe(false);
	});

	it("reports unknown names with suggestions", async () => {
		const cwd = makeTmpDir();
		const outcome = await runAdd(["bell-rng"], {
			cwd,
			dir: "components/icons",
			registryBase: PUBLIC_R,
		});
		expect(outcome.added).toHaveLength(0);
		expect(outcome.notFound).toHaveLength(1);
		expect(outcome.notFound[0].input).toBe("bell-rng");
	});
});
