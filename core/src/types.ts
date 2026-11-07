export type IconLibrary = "lucide" | "huge";
export type IconLibraryPrefix = "lu" | "hu";

export interface CatalogIcon {
	name: string;
	library: IconLibrary;
	prefix: IconLibraryPrefix;
	registryName: string;
	addedAt: string | null;
	category: string[];
	keywords: string[];
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

export interface RegistryItem {
	$schema?: string;
	name: string;
	type: string;
	dependencies?: string[];
	registryDependencies?: string[];
	devDependencies?: string[];
	files: RegistryFile[];
}
