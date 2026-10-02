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

test("dist/ exists - package was built", async () => {
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
			`dist/${file} missing - broken exports map`,
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
		"missing 'use client' banner - RSC consumers will break",
	);
});

test('"use client" banner is preserved in CJS build', async () => {
	const source = await fs.readFile(path.join(DIST, "lucide.cjs"), "utf8");
	assert.match(
		source,
		/^\s*["']use client["']/,
		"missing 'use client' banner in CJS - RSC consumers will break",
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

test("top-level entry exports IconHandle type", async () => {
	const dts = await fs.readFile(path.join(DIST, "index.d.ts"), "utf8");
	assert.match(
		dts,
		/IconHandle/,
		"index.d.ts should re-export IconHandle type",
	);
});

test("top-level entry exports the useIconHover hook in ESM and CJS", async () => {
	const esm = await import(path.join(DIST, "index.js"));
	const cjs = require(path.join(DIST, "index.cjs"));
	assert.equal(
		typeof esm.useIconHover,
		"function",
		"dist/index.js is missing useIconHover",
	);
	assert.equal(
		typeof cjs.useIconHover,
		"function",
		"dist/index.cjs is missing useIconHover",
	);
});

test("third-party notices ship with the package and match the repo copy", async () => {
	const pkg = JSON.parse(
		await fs.readFile(path.join(PKG_ROOT, "package.json"), "utf8"),
	);
	assert.ok(
		pkg.files.includes("THIRD_PARTY_NOTICES.md"),
		"package.json files must list THIRD_PARTY_NOTICES.md",
	);
	const shipped = await fs.readFile(
		path.join(PKG_ROOT, "THIRD_PARTY_NOTICES.md"),
		"utf8",
	);
	const repo = await fs.readFile(
		path.join(PKG_ROOT, "..", "THIRD_PARTY_NOTICES.md"),
		"utf8",
	);
	assert.equal(
		shipped,
		repo,
		"npm/THIRD_PARTY_NOTICES.md drifted from the root copy",
	);
	for (const holder of [
		"Lucide Icons and Contributors",
		"Cole Bemis",
		"Hugeicons",
	]) {
		assert.match(shipped, new RegExp(`Copyright \\(c\\) .*${holder}`));
	}
});

test("index.d.ts declares useIconHover, IconConfig and IconTrigger", async () => {
	for (const file of ["index.d.ts", "index.d.cts"]) {
		const dts = await fs.readFile(path.join(DIST, file), "utf8");
		assert.match(dts, /useIconHover/, `${file} should declare useIconHover`);
		assert.match(dts, /IconTrigger/, `${file} should declare IconTrigger`);
		assert.match(dts, /IconConfig/, `${file} should declare IconConfig`);
	}
});

test("subpath .d.ts files re-export their handle types", async () => {
	const lucideDts = await fs.readFile(path.join(DIST, "lucide.d.ts"), "utf8");
	assert.match(
		lucideDts,
		/BellRingIconHandle/,
		"lucide.d.ts missing BellRingIconHandle type export",
	);
});

test("ESM ships one module per icon - the barrel only re-exports", async () => {
	const barrel = await fs.readFile(path.join(DIST, "lucide.js"), "utf8");
	assert.ok(
		barrel.length < 120_000,
		`lucide.js is ${barrel.length}B - it should be re-exports only, not a bundle. Tree-shaking is broken.`,
	);
	assert.ok(
		await exists(path.join(DIST, "icons", "lucide", "bell-ring-icon.js")),
		"dist/icons/lucide/bell-ring-icon.js missing - per-icon modules not emitted",
	);
	const perIcon = await fs.readdir(path.join(DIST, "icons", "lucide"));
	assert.ok(
		perIcon.length >= 248,
		`expected ≥248 per-icon modules, got ${perIcon.length}`,
	);
});

test("deep per-icon subpaths resolve and carry types", async () => {
	const pkg = JSON.parse(
		await fs.readFile(path.join(PKG_ROOT, "package.json"), "utf8"),
	);
	assert.ok(
		pkg.exports["./lucide/*"] && pkg.exports["./huge/*"],
		"missing per-icon subpath exports - Next consumers cannot tree-shake",
	);
	const mod = await import(
		path.join(DIST, "icons", "lucide", "bell-ring-icon.js")
	);
	assert.ok(mod.BellRingIcon, "deep subpath does not export BellRingIcon");
	const dts = await fs.readFile(
		path.join(DIST, "icons", "lucide", "bell-ring-icon.d.ts"),
		"utf8",
	);
	assert.match(
		dts,
		/BellRingIcon\b/,
		"deep subpath .d.ts missing the component",
	);
	assert.match(
		dts,
		/BellRingIconHandle/,
		"deep subpath .d.ts missing the handle type",
	);
});
