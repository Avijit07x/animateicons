/**
 * CI guard: every icon source must follow the canonical naming pattern.
 *
 * For `icons/<lib>/<stem>-icon.tsx`:
 *   - component must be `<Stem>Icon` (PascalCase of stem + "Icon")
 *   - the first Handle interface must be `<Stem>IconHandle`
 *   - the first Props interface must be `<Stem>IconProps`
 *   - the file's basename must derive from the component name
 *     (kebab-case of `<Stem>Icon` minus the `-icon` suffix)
 *
 * Exits with code 1 and prints a table of every violation.
 *
 * Run with:  pnpm check:naming
 *
 * To auto-fix: pnpm normalize  (then re-run this).
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
const HANDLE_RE =
	/(?:^|\s)(?:export\s+)?(?:interface|type)\s+([A-Z][A-Za-z0-9]*Handle)\b/m;
const PROPS_RE =
	/(?:^|\s)(?:export\s+)?(?:interface|type)\s+([A-Z][A-Za-z0-9]*Props)\b/m;

/** "bell-ring" -> "BellRingIcon" */
const stemToComponent = (stem) =>
	`${stem
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("")}Icon`;

const checkFile = async (dir, file) => {
	const stem = file.replace(/-icon\.tsx$/, "");
	const expectedComponent = stemToComponent(stem);
	const source = await fs.readFile(path.join(dir, file), "utf8");

	const violations = [];

	const componentMatch = source.match(COMPONENT_RE);
	if (!componentMatch) {
		violations.push({
			kind: "component",
			expected: expectedComponent,
			actual: "(none found)",
		});
	} else if (componentMatch[1] !== expectedComponent) {
		violations.push({
			kind: "component",
			expected: expectedComponent,
			actual: componentMatch[1],
		});
	}

	const componentName = componentMatch?.[1] ?? expectedComponent;

	const handleMatch = source.match(HANDLE_RE);
	if (handleMatch && handleMatch[1] !== `${componentName}Handle`) {
		violations.push({
			kind: "handle",
			expected: `${componentName}Handle`,
			actual: handleMatch[1],
		});
	}

	const propsMatch = source.match(PROPS_RE);
	if (propsMatch && propsMatch[1] !== `${componentName}Props`) {
		violations.push({
			kind: "props",
			expected: `${componentName}Props`,
			actual: propsMatch[1],
		});
	}

	return violations.length
		? { file: path.relative(REPO_ROOT, path.join(dir, file)), violations }
		: null;
};

const main = async () => {
	const offenders = [];
	let totalChecked = 0;

	for (const dir of ICONS_DIRS) {
		const files = (await fs.readdir(dir))
			.filter((f) => f.endsWith("-icon.tsx"))
			.sort();
		for (const file of files) {
			totalChecked++;
			const result = await checkFile(dir, file);
			if (result) offenders.push(result);
		}
	}

	if (!offenders.length) {
		console.log(`Icon naming OK: ${totalChecked} files, 0 violations.`);
		return;
	}

	console.error(
		`Icon naming check failed: ${offenders.length}/${totalChecked} file(s) violate the canonical pattern.\n`,
	);
	console.error("file | kind | expected | actual");
	console.error("---- | ---- | -------- | ------");
	for (const o of offenders) {
		for (const v of o.violations) {
			console.error(`${o.file} | ${v.kind} | ${v.expected} | ${v.actual}`);
		}
	}
	console.error("\nFix with:  pnpm normalize");
	process.exit(1);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
