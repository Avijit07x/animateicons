import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

const manifest = JSON.parse(
	await fs.readFile(
		path.join(ROOT, "src", "generated", "manifest.json"),
		"utf8",
	),
);

await Promise.all(
	manifest.map(async ({ library, name, exportName }) => {
		const js = path.join(DIST, library, `${name}.js`);
		await fs.access(js).catch(() => {
			throw new Error(
				`${js} is missing. The manifest and dist/ are out of sync.`,
			);
		});
		await fs.writeFile(
			path.join(DIST, library, `${name}.d.ts`),
			`export { ${exportName}Icon } from "../${library}.js";\n`,
		);
	}),
);

console.log(`Wrote ${manifest.length} Vue per-icon type files.`);
