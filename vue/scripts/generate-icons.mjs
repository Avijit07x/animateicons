import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = path.join(
	ROOT,
	"..",
	"vanilla",
	"src",
	"generated",
	"manifest.json",
);
const OUTPUT = path.join(ROOT, "src", "generated");
const LIBRARIES = ["lucide", "huge"];

const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));

const iconModule = ({ library, name, exportName }) =>
	[
		`import { ${exportName} } from "@animateicons/vanilla/${library}/${name}";`,
		`import { defineIcon } from "../../components";`,
		"",
		`export const ${exportName}Icon = defineIcon(${exportName});`,
		"",
	].join("\n");

const barrelModule = (library, icons) =>
	[
		`export * from "@animateicons/vanilla/${library}";`,
		...icons.map(
			({ name, exportName }) =>
				`export { ${exportName}Icon } from "./${library}/${name}";`,
		),
		"",
	].join("\n");

await fs.rm(OUTPUT, { recursive: true, force: true });
for (const library of LIBRARIES) {
	const icons = manifest.filter((icon) => icon.library === library);
	await fs.mkdir(path.join(OUTPUT, library), { recursive: true });
	await Promise.all(
		icons.map((icon) =>
			fs.writeFile(
				path.join(OUTPUT, library, `${icon.name}.ts`),
				iconModule(icon),
			),
		),
	);
	await fs.writeFile(
		path.join(OUTPUT, `${library}.ts`),
		barrelModule(library, icons),
	);
}
await fs.copyFile(MANIFEST, path.join(OUTPUT, "manifest.json"));

console.log(`Wrote ${manifest.length} Vue icon components.`);
