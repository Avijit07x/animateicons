import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST_MANIFEST = path.join(ROOT, "dist", "package.json");
const WORKSPACE_PROTOCOL = "workspace:";

const readJson = async (file) => JSON.parse(await fs.readFile(file, "utf8"));

const manifest = await readJson(DIST_MANIFEST);

for (const [name, range] of Object.entries(manifest.dependencies ?? {})) {
	if (!range.startsWith(WORKSPACE_PROTOCOL)) continue;
	const directory = name.replace("@animateicons/", "");
	const { version } = await readJson(
		path.join(ROOT, "..", directory, "package.json"),
	);
	const prefix = range.slice(WORKSPACE_PROTOCOL.length);
	manifest.dependencies[name] =
		prefix === "*" ? version : `${prefix}${version}`;
}

delete manifest.devDependencies;
delete manifest.scripts;
delete manifest["size-limit"];

await fs.writeFile(DIST_MANIFEST, `${JSON.stringify(manifest, null, "\t")}\n`);
console.log("Finalized dist/package.json for publishing.");
