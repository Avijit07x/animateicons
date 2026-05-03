/**
 * Codemod: replace `extends HTMLMotionProps<"div">` with React-native
 * `Omit<HTMLAttributes<HTMLDivElement>, "color">` across every icon source.
 *
 * Why: motion/react's types only resolve in the consumer's project if motion
 * is installed there. We bundle motion into dist, so consumers don't install
 * it — which makes HTMLMotionProps resolve to `never` in their IDE, killing
 * className / style / standard event prop autocomplete.
 *
 * React.HTMLAttributes is always resolvable, gives consumers every prop they
 * actually need, and motion.div internally accepts the same props (it extends
 * standard div), so the ...props spread inside the icon stays valid.
 *
 * Run: node scripts/codemod-html-attrs.mjs
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

	// 1. Drop HTMLMotionProps from the motion/react type import.
	//    `import type { HTMLMotionProps, Variants } from "motion/react";`
	//      → `import type { Variants } from "motion/react";`
	//    `import type { HTMLMotionProps } from "motion/react";`
	//      → (line removed)
	const motionImportRe =
		/^import\s+type\s*\{([^}]*)\}\s*from\s*["']motion\/react["'];?\s*$/m;
	const motionMatch = out.match(motionImportRe);
	if (motionMatch) {
		const inner = motionMatch[1]
			.split(",")
			.map((s) => s.trim())
			.filter((s) => s && s !== "HTMLMotionProps");
		if (inner.length === 0) {
			out = out.replace(motionImportRe, "");
			changed = true;
		} else if (inner.length !== motionMatch[1].split(",").length) {
			out = out.replace(
				motionImportRe,
				`import type { ${inner.join(", ")} } from "motion/react";`,
			);
			changed = true;
		}
	}

	// 2. Replace the interface extends.
	//    `extends HTMLMotionProps<"div">`
	//      → `extends Omit<HTMLAttributes<HTMLDivElement>, "color">`
	if (out.includes('extends HTMLMotionProps<"div">')) {
		out = out.replace(
			/extends HTMLMotionProps<"div">/g,
			'extends Omit<HTMLAttributes<HTMLDivElement>, "color">',
		);
		changed = true;
	}

	// 3. Make sure HTMLAttributes is imported from react. Append to the
	//    existing `from "react"` import if present, else add a new line.
	if (changed && /HTMLAttributes<HTMLDivElement>/.test(out)) {
		const reactValueImportRe =
			/^import\s*\{([^}]*)\}\s*from\s*["']react["'];?\s*$/m;
		const reactTypeImportRe =
			/^import\s+type\s*\{([^}]*)\}\s*from\s*["']react["'];?\s*$/m;

		if (reactTypeImportRe.test(out)) {
			out = out.replace(reactTypeImportRe, (line, inner) => {
				const names = inner
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean);
				if (!names.includes("HTMLAttributes")) names.push("HTMLAttributes");
				return `import type { ${names.join(", ")} } from "react";`;
			});
		} else if (reactValueImportRe.test(out)) {
			// Add a parallel `import type { HTMLAttributes } from "react"` right after
			// the existing react value import.
			out = out.replace(
				reactValueImportRe,
				(line) => `${line}\nimport type { HTMLAttributes } from "react";`,
			);
		} else {
			out = `import type { HTMLAttributes } from "react";\n${out}`;
		}
	}

	return { out, changed };
};

const main = async () => {
	let touched = 0;
	let scanned = 0;

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
