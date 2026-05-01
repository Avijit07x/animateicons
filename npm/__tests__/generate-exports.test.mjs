/**
 * Codegen integrity test.
 *
 * generate-exports.mjs uses regexes to find component / handle exports
 * inside each icon source file. If a future icon ever uses a non-matching
 * declaration shape (default export, unusual type annotation, etc.) it
 * gets silently dropped from the barrel. That's a class of bug the
 * smoke test (which only checks a handful of named exports) can't catch.
 *
 * This test asserts the count invariant directly:
 *   number of *-icon.tsx files in icons/<lib>/  ===
 *   number of `export { *Icon }` lines in src/<lib>.ts
 *
 * Run with:  node --test __tests__/generate-exports.test.mjs
 * Wired into `verify`.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(PKG_ROOT, "..");

const ICONS_DIRS = {
	lucide: path.join(REPO_ROOT, "icons", "lucide"),
	huge: path.join(REPO_ROOT, "icons", "huge"),
};

const SRC = path.join(PKG_ROOT, "src");

/** Count `*-icon.tsx` files in a library directory. */
const countIconFiles = async (dir) => {
	const files = await fs.readdir(dir);
	return files.filter((f) => f.endsWith("-icon.tsx")).length;
};

/** Count `export { XxxIcon } from "..."` lines in a generated barrel. */
const countBarrelExports = async (file) => {
	const source = await fs.readFile(file, "utf8");
	const matches = source.match(/^export\s*\{\s*[A-Z][A-Za-z0-9]*Icon\s*\}/gm);
	return matches ? matches.length : 0;
};

/** Count `// SKIP ...` markers — generate-exports emits these when the
 *  regex couldn't pick up a component name. Should always be zero. */
const countSkippedIcons = async (file) => {
	const source = await fs.readFile(file, "utf8");
	const matches = source.match(/^\/\/ SKIP\s/gm);
	return matches ? matches.length : 0;
};

test("barrels exist — run `pnpm gen` if this fails", async () => {
	for (const lib of Object.keys(ICONS_DIRS)) {
		const barrel = path.join(SRC, `${lib}.ts`);
		const exists = await fs.stat(barrel).catch(() => null);
		assert.ok(exists, `src/${lib}.ts missing — run \`pnpm gen\` first`);
	}
});

test("every icon source file produces a barrel export (lucide)", async () => {
	const inputCount = await countIconFiles(ICONS_DIRS.lucide);
	const exportCount = await countBarrelExports(path.join(SRC, "lucide.ts"));
	assert.equal(
		exportCount,
		inputCount,
		`lucide: ${inputCount} *-icon.tsx files, but only ${exportCount} exports in src/lucide.ts. ` +
			`generate-exports likely silently dropped one — check NAMING_REPORT.md and the file list.`,
	);
});

test("every icon source file produces a barrel export (huge)", async () => {
	const inputCount = await countIconFiles(ICONS_DIRS.huge);
	const exportCount = await countBarrelExports(path.join(SRC, "huge.ts"));
	assert.equal(
		exportCount,
		inputCount,
		`huge: ${inputCount} *-icon.tsx files, but only ${exportCount} exports in src/huge.ts. ` +
			`generate-exports likely silently dropped one.`,
	);
});

test("no icons were skipped during codegen", async () => {
	for (const lib of Object.keys(ICONS_DIRS)) {
		const skipped = await countSkippedIcons(path.join(SRC, `${lib}.ts`));
		assert.equal(
			skipped,
			0,
			`${lib}: ${skipped} icon(s) skipped by codegen. Check the comments at ` +
				`the top of src/${lib}.ts and fix the source file's export shape.`,
		);
	}
});

test("top-level index re-exports IconHandle type", async () => {
	const source = await fs.readFile(path.join(SRC, "index.ts"), "utf8");
	assert.match(
		source,
		/export\s+type\s*\{\s*IconHandle\s*\}/,
		"src/index.ts must re-export IconHandle",
	);
});
