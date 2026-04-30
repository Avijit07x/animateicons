/**
 * Post-build: prepend `"use client";` to every entry file in dist/.
 *
 * Why this script exists:
 *   tsup's `banner: { js }` option intermittently drops the directive
 *   when esbuild splits shared code into a chunk file (we have one:
 *   `chunk-*.js` for the inlined `cn` helper). Without "use client"
 *   at the top of each entry, Next.js App Router treats the icons as
 *   server components and crashes on `useRef`/`useAnimation`.
 *
 * We don't add the banner to the chunk file itself — chunks are
 * imported by the entries and inherit their environment.
 *
 * Idempotent: skips files that already start with the directive.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");

// Only the public entries — `dist/index.{js,cjs}` is types-only at the
// source level, but tsup still emits a tiny runtime stub for it.
const ENTRY_BASES = ["index", "lucide", "huge"];
const EXTENSIONS = [".js", ".cjs"];

const BANNER = '"use client";\n';

const hasBanner = (source) => /^\s*["']use client["']/.test(source);

const inject = async (file) => {
	const source = await fs.readFile(file, "utf8");
	if (hasBanner(source)) return false;

	// CJS files often start with `'use strict';` — keep it second so
	// both directives are recognized at the top of the file.
	await fs.writeFile(file, BANNER + source, "utf8");
	return true;
};

const main = async () => {
	let injected = 0;
	let skipped = 0;
	for (const base of ENTRY_BASES) {
		for (const ext of EXTENSIONS) {
			const file = path.join(DIST, `${base}${ext}`);
			try {
				const did = await inject(file);
				if (did) injected++;
				else skipped++;
			} catch (err) {
				if (err.code === "ENOENT") continue;
				throw err;
			}
		}
	}
	console.log(
		`  use-client banner: injected ${injected}, already-present ${skipped}`,
	);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
