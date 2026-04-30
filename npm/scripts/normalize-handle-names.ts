/**
 * Normalize handle names in icon source files.
 *
 * The AnimateIcons sources have inconsistent handle interface names:
 *   - Some use the canonical `XxxIconHandle` (e.g. `BellRingIconHandle`)
 *   - Some drop the `Icon` infix (e.g. `BlendHandle`)
 *   - A few have copy-paste bugs (e.g. `eye-icon.tsx` exports
 *     `ExternalLinkIconHandle`, `trash-icon.tsx` exports `DashboardIconHandle`)
 *
 * For each `icons/<lib>/<stem>-icon.tsx`:
 *   1. Parse the actual component name and handle name.
 *   2. Compute the canonical handle name as `${componentName}Handle`.
 *   3. If the current handle name doesn't match, do a whole-word
 *      replace across the file (covers `export interface ...`, the
 *      `forwardRef<...>` generic, and any other reference).
 *
 * Idempotent — re-running it on already-normalized files is a no-op.
 *
 * Run with:  pnpm tsx scripts/normalize-handle-names.ts
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

type Result = {
	file: string;
	from: string;
	to: string;
};

const escapeForRegex = (s: string): string =>
	s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeFile = async (
	dir: string,
	file: string,
): Promise<Result | null> => {
	const full = path.join(dir, file);
	const source = await fs.readFile(full, "utf8");

	const componentMatch = source.match(COMPONENT_RE);
	const handleMatch = source.match(HANDLE_RE);
	if (!componentMatch || !handleMatch) return null;

	const componentName = componentMatch[1];
	const currentHandle = handleMatch[1];
	const canonicalHandle = `${componentName}Handle`;

	if (currentHandle === canonicalHandle) return null;

	// Whole-word replacement so we don't accidentally clobber substrings.
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

const main = async (): Promise<void> => {
	const results: Result[] = [];

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
		console.log(`  ${r.file}: ${r.from} → ${r.to}`);
	}
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
