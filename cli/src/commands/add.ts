import {
	fetchCatalog,
	fetchRegistryItem,
	resolveIcon,
	writeIcon,
} from "@animateicons/core";

export interface AddOptions {
	cwd: string;
	dir: string;
	registryBase?: string;
	overwrite?: boolean;
	utilsImport?: string;
}

interface AddedIcon {
	registryName: string;
	file: string;
	skipped: boolean;
}

export interface AddOutcome {
	added: AddedIcon[];
	ambiguous: { input: string; options: string[] }[];
	notFound: { input: string; suggestions: string[] }[];
}

export async function runAdd(
	names: string[],
	opts: AddOptions,
): Promise<AddOutcome> {
	const catalog = await fetchCatalog({ registryBase: opts.registryBase });
	const outcome: AddOutcome = { added: [], ambiguous: [], notFound: [] };

	for (const name of names) {
		const res = resolveIcon(catalog, name);

		if (res.match) {
			const item = await fetchRegistryItem(res.match.registryName, {
				registryBase: opts.registryBase,
			});
			const written = writeIcon(item, {
				cwd: opts.cwd,
				targetDir: opts.dir,
				fileName: `${res.match.name}.tsx`,
				overwrite: opts.overwrite,
				utilsImport: opts.utilsImport,
			});
			outcome.added.push({
				registryName: res.match.registryName,
				file: written.file,
				skipped: written.skipped,
			});
		} else if (res.ambiguous.length > 0) {
			outcome.ambiguous.push({
				input: name,
				options: res.ambiguous.map((i) => i.registryName),
			});
		} else {
			outcome.notFound.push({
				input: name,
				suggestions: res.suggestions.map((i) => i.registryName),
			});
		}
	}

	return outcome;
}
