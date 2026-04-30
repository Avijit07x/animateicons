/**
 * Smoke test against the BUILT package output.
 *
 * Why a separate test from Vitest: this verifies the actual
 * publish artifact (`dist/`), not the source. Catches things
 * `tsc` won't, like:
 *   - tsup dropping an icon during tree-shaking analysis
 *   - "use client" banner stripping breaking React Server Components
 *   - dual-package hazard if ESM + CJS resolve to different copies
 *
 * Run with:  node --test __tests__/consume.test.mjs
 * Requires:  pnpm build  (i.e. dist/ must exist)
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(__dirname, "..");
const DIST = path.join(PKG_ROOT, "dist");
const require = createRequire(import.meta.url);

const exists = async (p) => {
	try {
		await fs.access(p);
		return true;
	} catch {
		return false;
	}
};

test("dist/ exists — package was built", async () => {
	assert.ok(
		await exists(DIST),
		"dist/ missing. Run `pnpm build` before this test.",
	);
});

test("all declared export targets are emitted", async () => {
	const expected = [
		"index.js",
		"index.cjs",
		"index.d.ts",
		"lucide.js",
		"lucide.cjs",
		"lucide.d.ts",
		"huge.js",
		"huge.cjs",
		"huge.d.ts",
	];
	for (const file of expected) {
		assert.ok(
			await exists(path.join(DIST, file)),
			`dist/${file} missing — broken exports map`,
		);
	}
});

test("ESM: lucide subpath exports a known icon component", async () => {
	const mod = await import(path.join(DIST, "lucide.js"));
	assert.equal(
		typeof mod.BellRingIcon,
		"object",
		"BellRingIcon should be a forwardRef object",
	);
	assert.ok(mod.BellRingIcon, "BellRingIcon export missing");
});

test("ESM: huge subpath exports a known icon component", async () => {
	const mod = await import(path.join(DIST, "huge.js"));
	assert.ok(mod.HeartIcon, "HeartIcon export missing from /huge");
});

test("CJS: lucide subpath exports a known icon component", () => {
	const mod = require(path.join(DIST, "lucide.cjs"));
	assert.ok(mod.BellRingIcon, "BellRingIcon export missing from CJS build");
});

test("CJS: huge subpath exports a known icon component", () => {
	const mod = require(path.join(DIST, "huge.cjs"));
	assert.ok(mod.HeartIcon, "HeartIcon export missing from CJS build");
});

test('"use client" banner is preserved in ESM build', async () => {
	const source = await fs.readFile(path.join(DIST, "lucide.js"), "utf8");
	assert.match(
		source,
		/^\s*["']use client["']/,
		"missing 'use client' banner — RSC consumers will break",
	);
});

test('"use client" banner is preserved in CJS build', async () => {
	const source = await fs.readFile(path.join(DIST, "lucide.cjs"), "utf8");
	assert.match(
		source,
		/^\s*["']use client["']/,
		"missing 'use client' banner in CJS — RSC consumers will break",
	);
});

test("expected icon counts: lucide ≥ 248, huge ≥ 33", async () => {
	const lucide = await import(path.join(DIST, "lucide.js"));
	const huge = await import(path.join(DIST, "huge.js"));
	const lucideIcons = Object.keys(lucide).filter((k) => k.endsWith("Icon"));
	const hugeIcons = Object.keys(huge).filter((k) => k.endsWith("Icon"));
	assert.ok(
		lucideIcons.length >= 248,
		`expected ≥248 lucide icons, got ${lucideIcons.length}`,
	);
	assert.ok(
		hugeIcons.length >= 33,
		`expected ≥33 huge icons, got ${hugeIcons.length}`,
	);
});

test("top-level types-only entry exports IconHandle type", async () => {
	const dts = await fs.readFile(path.join(DIST, "index.d.ts"), "utf8");
	assert.match(
		dts,
		/IconHandle/,
		"index.d.ts should re-export IconHandle type",
	);
});

test("subpath .d.ts files re-export their handle types", async () => {
	const lucideDts = await fs.readFile(path.join(DIST, "lucide.d.ts"), "utf8");
	assert.match(
		lucideDts,
		/BellRingIconHandle/,
		"lucide.d.ts missing BellRingIconHandle type export",
	);
});
