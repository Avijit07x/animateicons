export type Library = "lucide" | "huge";

export type IconChange = {
	library: Library;
	name: string;
	isNew: boolean;
	staged: boolean;
	unstaged: boolean;
};

export type Filters = {
	status: "all" | "staged" | "unstaged";
	library: "all" | Library;
	kind: "all" | "new" | "changed";
	query: string;
};

export type FilterKey = keyof Filters;

export type SetFilter = <K extends FilterKey>(
	key: K,
	value: Filters[K],
) => void;

export type CountFilter = <K extends FilterKey>(
	key: K,
	value: Filters[K],
) => number;

export type PreviewSize = "24" | "32" | "48";

export type FamilyGroup = {
	id: string;
	family: string;
	items: IconChange[];
};

export type LibraryGroup = {
	library: Library;
	families: FamilyGroup[];
};
