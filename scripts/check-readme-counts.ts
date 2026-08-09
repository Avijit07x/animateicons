import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ICON_COUNTS } from "../lib/icon-count.generated";

/**
 * Guard: the icon counts printed in README.md / npm/README.md must match the
 * generated source of truth (lib/icon-count.generated.ts, produced by
 * `pnpm gen:catalog`). Runs in pre-push so a stale count can't ship - npm
 * only refreshes a package's README on a new publish, so a wrong number
 * there sticks until the next release.
 *
 * A pattern that stops matching (someone reworded the line) fails too, on
 * purpose: better a loud failure than silently skipping the check.
 */

const ROOT = process.cwd();

type Check = { file: string; label: string; expected: number; pattern: RegExp };

const checks: Check[] = [
	{
		file: "README.md",
		label: "headline total",
		expected: ICON_COUNTS.total,
		pattern: /([\d,]+)\s+animated SVG icons/,
	},
	{
		file: "README.md",
		label: "lucide (tree)",
		expected: ICON_COUNTS.lucide,
		pattern: /([\d,]+)\s+Lucide-style icons/,
	},
	{
		file: "README.md",
		label: "huge (tree)",
		expected: ICON_COUNTS.huge,
		pattern: /([\d,]+)\s+Huge-style icons/,
	},
	{
		file: "npm/README.md",
		label: "headline total",
		expected: ICON_COUNTS.total,
		pattern: /([\d,]+)\s+animated SVG icons/,
	},
];

function main(): void {
	const failures: string[] = [];

	for (const c of checks) {
		const text = readFileSync(join(ROOT, c.file), "utf-8");
		const m = text.match(c.pattern);
		if (!m) {
			failures.push(
				`${c.file}: could not find "${c.label}" (pattern ${c.pattern}) - did the wording change?`,
			);
			continue;
		}
		const found = Number(m[1].replace(/,/g, ""));
		if (found !== c.expected) {
			failures.push(
				`${c.file}: ${c.label} says ${found}, expected ${c.expected}`,
			);
		}
	}

	if (failures.length > 0) {
		console.error("✗ README icon counts are out of date:\n");
		for (const f of failures) console.error("  • " + f);
		console.error(
			`\nSource of truth: lib/icon-count.generated.ts ` +
				`(lucide ${ICON_COUNTS.lucide}, huge ${ICON_COUNTS.huge}, total ${ICON_COUNTS.total}).`,
		);
		console.error("Update README.md and npm/README.md, then re-push.");
		process.exit(1);
	}

	console.log(
		`✓ README icon counts match (total ${ICON_COUNTS.total}, ` +
			`lucide ${ICON_COUNTS.lucide}, huge ${ICON_COUNTS.huge}).`,
	);
}

main();
