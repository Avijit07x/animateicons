import fs from "node:fs/promises";
import path from "node:path";
import type { ExtractedIcon } from "./icon-data/extract";
import { ICON_LIBRARIES, loadIconExtractor, ROOT } from "./icon-data/load";

const OUTPUT = path.join(ROOT, "vanilla", "src", "generated");
const INFINITY = "__animateicons_infinity__";

const serialize = (value: unknown) =>
	JSON.stringify(value, (_, item) => {
		if (typeof item === "number" && !Number.isFinite(item)) {
			if (item === Infinity) return INFINITY;
			throw new Error(`Cannot serialize ${item} in icon data`);
		}
		return item;
	}).replaceAll(`"${INFINITY}"`, "Infinity");

const iconModule = ({ exportName, data }: ExtractedIcon) =>
	`import type { IconData } from "../../types";\n\nexport const ${exportName}: IconData = ${serialize(data)};\n`;

const barrelModule = (icons: ExtractedIcon[]) =>
	icons
		.map(
			({ library, name, exportName }) =>
				`export { ${exportName} } from "./${library}/${name}";\n`,
		)
		.join("");

async function main() {
	const { sources, extractIcons } = await loadIconExtractor();
	const { icons, errors } = extractIcons(sources);

	if (errors.length) {
		console.error(`❌ ${errors.length} icons cannot be turned into data:`);
		for (const error of errors) console.error(`   ${error}`);
		process.exit(1);
	}

	const still = icons.filter((icon) => icon.stillParts.length);
	if (still.length) {
		console.warn(
			`⚠️ ${still.length} icons have parts that never move in React, because they set their own initial without animate:`,
		);
		for (const icon of still) {
			console.warn(
				`   ${icon.library}/${icon.name}: ${icon.stillParts.length} parts`,
			);
		}
	}

	await fs.rm(OUTPUT, { recursive: true, force: true });
	for (const library of ICON_LIBRARIES) {
		const libraryIcons = icons.filter((icon) => icon.library === library);
		await fs.mkdir(path.join(OUTPUT, library), { recursive: true });
		await Promise.all(
			libraryIcons.map((icon) =>
				fs.writeFile(
					path.join(OUTPUT, library, `${icon.name}.ts`),
					iconModule(icon),
				),
			),
		);
		await fs.writeFile(
			path.join(OUTPUT, `${library}.ts`),
			barrelModule(libraryIcons),
		);
	}
	await fs.writeFile(
		path.join(OUTPUT, "manifest.json"),
		`${JSON.stringify(
			icons.map(({ library, name, exportName }) => ({
				library,
				name,
				exportName,
			})),
			null,
			"\t",
		)}\n`,
	);

	console.log(
		`✅ Icon data for ${icons.length} icons -> vanilla/src/generated`,
	);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
