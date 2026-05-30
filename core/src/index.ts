export type {
	Catalog,
	CatalogIcon,
	IconLibrary,
	IconLibraryPrefix,
	RegistryFile,
	RegistryItem,
} from "./types";

export {
	DEFAULT_REGISTRY_BASE,
	fetchCatalog,
	fetchRegistryItem,
	type FetchCatalogOptions,
	type FetchItemOptions,
} from "./catalog";

export { searchIcons, type SearchOptions } from "./search";

export { resolveIcon, type ResolveResult } from "./resolve";

export {
	MINIMAL_CN_SOURCE,
	renderIconContent,
	writeIcon,
	type RenderOptions,
	type WriteOptions,
	type WriteResult,
} from "./writeIcon";
