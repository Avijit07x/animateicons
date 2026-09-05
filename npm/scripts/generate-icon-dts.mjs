/**
 * Post-build: emit a .d.ts beside every per-icon module in dist/icons/.
 *
 * The deep subpaths ("@animateicons/react/lucide/bell-ring-icon") are what
 * actually tree-shake in Next's App Router - a "use client" barrel is a
 * client-reference boundary, so Next pulls in every icon behind it. Those
 * subpaths need types, and running tsup's dts over 550 entries is slow and
 * emits 550 large files, so each one re-exports from the barrel's .d.ts
 * instead. Names come from the barrel so the handful of icons whose handle
 * type doesn't follow <Name>IconHandle stay correct.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const LIBS = ["lucide", "huge"];

const parseBarrel = async (lib) => {
	const source = await fs.readFile(path.join(ROOT, "src", `${lib}.ts`), "utf8");
	const byFile = new Map();
	const add = (file, name, isType) => {
		const entry = byFile.get(file) ?? { values: new Set(), types: new Set() };
		(isType ? entry.types : entry.values).add(name);
		byFile.set(file, entry);
	};
	for (const [, name, file] of source.matchAll(
		/export \{ (\w+) \} from "\.\.\/\.\.\/icons\/[a-z]+\/([a-z0-9-]+)"/g,
	)) {
		add(file, name, false);
	}
	for (const [, name, file] of source.matchAll(
		/export type \{ (\w+) \} from "\.\.\/\.\.\/icons\/[a-z]+\/([a-z0-9-]+)"/g,
	)) {
		add(file, name, true);
	}
	return byFile;
};

const main = async () => {
	let written = 0;
	for (const lib of LIBS) {
		const byFile = await parseBarrel(lib);
		for (const [file, { values, types }] of byFile) {
			const js = path.join(DIST, "icons", lib, `${file}.js`);
			try {
				await fs.access(js);
			} catch {
				throw new Error(`${js} missing - barrel and dist/ are out of sync`);
			}
			const specifiers = [
				...[...values].map((n) => n),
				...[...types].map((n) => `type ${n}`),
			].join(", ");
			const body = `export { ${specifiers} } from "../../${lib}.js";\n`;
			await fs.writeFile(path.join(DIST, "icons", lib, `${file}.d.ts`), body);
			written++;
		}
	}
	console.log(`  per-icon d.ts: ${written} icons`);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
