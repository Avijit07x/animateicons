/**
 * Plain-Node mirror of normalize-handle-names.ts so the codemod can run
 * without needing tsx/esbuild on the host. Keep them in sync if either
 * changes — ts version is the canonical source.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(PKG_ROOT, "..");

const ICONS_DIRS = [
	path.join(REPO_ROOT, "icons", "lucide"),
	path.join(REPO_ROOT, "icons", "huge"),
];

const COMPONENT_RE = /(?:const|function)\s+([A-Z][A-Za-z0-9]*Icon)\s*[=(:<]/m;
const HANDLE_RE = /^export\s+(?:interface|type)\s+([A-Z][A-Za-z0-9]*Handle)\b/m;

const escapeForRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeFile = async (dir, file) => {
	const full = path.join(dir, file);
	const source = await fs.readFile(full, "utf8");

	const componentMatch = source.match(COMPONENT_RE);
	const handleMatch = source.match(HANDLE_RE);
	if (!componentMatch || !handleMatch) return null;

	const componentName = componentMatch[1];
	const currentHandle = handleMatch[1];
	const canonicalHandle = `${componentName}Handle`;

	if (currentHandle === canonicalHandle) return null;

	const wordRe = new RegExp(`\\b${escapeForRegex(currentHandle)}\\b`, "g");
	const next = source.replace(wordRe, canonicalHandle);

	if (next === source) return null;

	await fs.writeFile(full, next, "utf8");
	return {
		file: path.relative(REPO_ROOT, full),
		from: currentHandle,
		to: canonicalHandle,
	};
};

const main = async () => {
	const results = [];
	for (const dir of ICONS_DIRS) {
		const files = (await fs.readdir(dir))
			.filter((f) => f.endsWith("-icon.tsx"))
			.sort();
		for (const file of files) {
			const result = await normalizeFile(dir, file);
			if (result) results.push(result);
		}
	}

	if (!results.length) {
		console.log("All handle names already canonical.");
		return;
	}

	console.log(`Renamed handles in ${results.length} file(s):`);
	for (const r of results) {
		console.log(`  ${r.file}: ${r.from} -> ${r.to}`);
	}
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
