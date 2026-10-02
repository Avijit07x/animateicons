import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");

const ENTRY_BASES = ["index", "lucide", "huge"];
const EXTENSIONS = [".js", ".cjs"];

const BANNER = '"use client";\n';

const hasBanner = (source) => /^\s*["']use client["']/.test(source);

const inject = async (file) => {
	const source = await fs.readFile(file, "utf8");
	if (hasBanner(source)) return false;

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
