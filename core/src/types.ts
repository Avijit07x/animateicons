export type IconLibrary = "lucide" | "huge";
export type IconLibraryPrefix = "lu" | "hu";

/** One icon entry in `public/r/catalog.json` (see scripts/generate-catalog.ts). */
export interface CatalogIcon {
	/** Kebab base name, e.g. "bell-ring" (no library prefix, no `-icon`). */
	name: string;
	library: IconLibrary;
	prefix: IconLibraryPrefix;
	/** Globally-unique registry id, e.g. "lu-bell-ring". */
	registryName: string;
	addedAt: string | null;
	category: string[];
	keywords: string[];
	/** Absolute URL of the per-icon shadcn registry item JSON. */
	url: string;
}

export interface Catalog {
	version: number;
	registryBase: string;
	total: number;
	libraries: Record<IconLibrary, number>;
	icons: CatalogIcon[];
}

export interface RegistryFile {
	path: string;
	content: string;
	type: string;
	target?: string;
}

/** A shadcn registry item as served at `public/r/<registryName>.json`. */
export interface RegistryItem {
	$schema?: string;
	name: string;
	type: string;
	dependencies?: string[];
	registryDependencies?: string[];
	devDependencies?: string[];
	files: RegistryFile[];
}
