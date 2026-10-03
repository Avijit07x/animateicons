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

export {
	fetchDocs,
	findDoc,
	type DocPage,
	type Docs,
	type FetchDocsOptions,
} from "./docs";

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
