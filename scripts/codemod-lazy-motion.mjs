/**
 * Codemod: switch every icon source from `motion` to the lazy `m`
 * component + LazyMotion wrapper, the size-optimized motion/react
 * pattern.
 *
 * Three transforms per file:
 *   1. Update the value import line:
 *        `import { motion, useAnimation, useReducedMotion } from "motion/react";`
 *      becomes:
 *        `import { domAnimation, LazyMotion, m, useAnimation, useReducedMotion } from "motion/react";`
 *   2. Replace every `motion.X` with `m.X` in JSX (motion.div, motion.svg,
 *      motion.path, motion.circle, etc.).
 *   3. Wrap the return JSX in `<LazyMotion features={domAnimation} strict>...</LazyMotion>`.
 *
 * Run: node scripts/codemod-lazy-motion.mjs
 * Then: pnpm prettier --write 'icons/lucide/*-icon.tsx' 'icons/huge/*-icon.tsx'
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DIRS = [
	path.join(REPO_ROOT, "icons", "lucide"),
	path.join(REPO_ROOT, "icons", "huge"),
];

const transform = (source) => {
	let out = source;
	let changed = false;

	// ─── 1. Update the value import ────────────────────────────────
	// Match the line that imports value bindings from motion/react.
	// Be tolerant of attribute order: only require `motion` is present.
	const valueImportRe =
		/^import\s*\{([^}]*\bmotion\b[^}]*)\}\s*from\s*["']motion\/react["'];?\s*$/m;

	const valueMatch = out.match(valueImportRe);
	if (valueMatch) {
		const inner = valueMatch[1]
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean);

		// Drop `motion`, add the three new bindings.
		const filtered = inner.filter((name) => name !== "motion");
		const next = ["domAnimation", "LazyMotion", "m", ...filtered];
		// Stable order: alphabetical-ish so prettier doesn't reshuffle on save.
		next.sort();

		out = out.replace(
			valueImportRe,
			`import { ${next.join(", ")} } from "motion/react";`,
		);
		changed = true;
	}

	// ─── 2. Replace `motion.X` with `m.X` ──────────────────────────
	// Cover both opening (<motion.path) and self-closing / value usage.
	if (/motion\.[a-zA-Z]/.test(out)) {
		out = out.replace(/\bmotion\.([a-zA-Z]+)/g, "m.$1");
		changed = true;
	}

	// ─── 3. Wrap the return JSX with LazyMotion ────────────────────
	// Skip if already wrapped (idempotency).
	if (changed && !out.includes("<LazyMotion")) {
		// Find the `return (` block ending at `\n\t);` (consistent across icons).
		// The outermost element is always <m.div ...> so we wrap that and its
		// closing tag without touching inner indentation. Prettier reflows after.
		const returnRe = /(return\s*\(\s*\n)([\s\S]*?)(\n\s*\);)/;
		out = out.replace(returnRe, (_match, open, body, close) => {
			return `${open}\t\t<LazyMotion features={domAnimation} strict>\n\t${body
				.split("\n")
				.map((l) => (l.length > 0 ? `\t${l}` : l))
				.join("\n")}\n\t\t</LazyMotion>${close}`;
		});
	}

	return { out, changed };
};

const main = async () => {
	let scanned = 0;
	let touched = 0;
	for (const dir of DIRS) {
		const files = (await fs.readdir(dir)).filter((f) =>
			f.endsWith("-icon.tsx"),
		);
		for (const f of files) {
			scanned++;
			const filePath = path.join(dir, f);
			const source = await fs.readFile(filePath, "utf8");
			const { out, changed } = transform(source);
			if (changed) {
				await fs.writeFile(filePath, out, "utf8");
				touched++;
			}
		}
	}
	console.log(`Scanned ${scanned} icons, rewrote ${touched}.`);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
