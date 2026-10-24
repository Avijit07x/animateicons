import { familyOf, sortIconsByFamily } from "@/scripts/icon-order";
import type { IconChange, Library, LibraryGroup } from "./types";

export const LIBRARY_NAMES: Record<Library, string> = {
	lucide: "Lucide",
	huge: "Huge",
};

const LIBRARIES = Object.keys(LIBRARY_NAMES) as Library[];

const collator = new Intl.Collator("en", { numeric: true });

const familiesOf = (library: Library, changes: IconChange[]) => {
	const families = new Map<string, IconChange[]>();
	for (const change of sortIconsByFamily(changes)) {
		const family = familyOf(change.name);
		families.set(family, [...(families.get(family) ?? []), change]);
	}
	return [...families]
		.sort(([a], [b]) => collator.compare(a, b))
		.map(([family, items]) => ({ id: `${library}-${family}`, family, items }));
};

export const groupByFamily = (changes: IconChange[]): LibraryGroup[] =>
	LIBRARIES.map((library) => ({
		library,
		families: familiesOf(
			library,
			changes.filter((change) => change.library === library),
		),
	})).filter((group) => group.families.length > 0);
