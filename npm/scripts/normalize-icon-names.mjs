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

const escapeForRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const renameWholeWord = (source, from, to) => {
	if (from === to) return source;
	const re = new RegExp(`\\b${escapeForRegex(from)}\\b`, "g");
	return source.replace(re, to);
};

const normalizeFile = async (dir, file) => {
	const full = path.join(dir, file);
	const source = await fs.readFile(full, "utf8");

	const componentMatch = source.match(COMPONENT_RE);
	if (!componentMatch) return null;
	const componentName = componentMatch[1];

	const handleMatch = source.match(HANDLE_RE);
	const propsMatch = source.match(PROPS_RE);

	const renames = [];
	let next = source;

	if (handleMatch) {
		const current = handleMatch[1];
		const canonical = `${componentName}Handle`;
		if (current !== canonical) {
			next = renameWholeWord(next, current, canonical);
			renames.push({ kind: "handle", from: current, to: canonical });
		}
	}

	if (propsMatch) {
		const current = propsMatch[1];
		const canonical = `${componentName}Props`;
		if (current !== canonical) {
			next = renameWholeWord(next, current, canonical);
			renames.push({ kind: "props", from: current, to: canonical });
		}
	}

	if (!renames.length || next === source) return null;

	await fs.writeFile(full, next, "utf8");
	return {
		file: path.relative(REPO_ROOT, full),
		renames,
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
		console.log("All icon names already canonical.");
		return;
	}

	console.log(`Renamed interfaces in ${results.length} file(s):`);
	for (const r of results) {
		for (const rename of r.renames) {
			console.log(`  ${r.file}: ${rename.kind} ${rename.from} -> ${rename.to}`);
		}
	}
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
