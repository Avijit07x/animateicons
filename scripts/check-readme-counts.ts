import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ICON_COUNTS } from "../lib/icon-count.generated";

const ROOT = process.cwd();

type Check = { file: string; label: string; expected: number; pattern: RegExp };

const README_FILES = [
	"README.md",
	"npm/README.md",
	"vue/README.md",
	"angular/README.md",
	"vanilla/README.md",
];

const checks: Check[] = README_FILES.map((file) => ({
	file,
	label: "headline total",
	expected: ICON_COUNTS.total,
	pattern: /([\d,]+) free, open source animated icons/,
}));

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
		console.error(`Update ${README_FILES.join(", ")}, then re-push.`);
		process.exit(1);
	}

	console.log(
		`✓ README icon counts match (total ${ICON_COUNTS.total}, ` +
			`lucide ${ICON_COUNTS.lucide}, huge ${ICON_COUNTS.huge}).`,
	);
}

main();
