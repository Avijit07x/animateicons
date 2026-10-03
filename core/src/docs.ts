import { DEFAULT_REGISTRY_BASE, readResource } from "./catalog";

export interface DocPage {
	slug: string;
	title: string;
	description: string;
	group: string;
	url: string;
	content: string;
}

export interface Docs {
	version: number;
	total: number;
	pages: DocPage[];
}

export interface FetchDocsOptions {
	registryBase?: string;
}

export async function fetchDocs(opts: FetchDocsOptions = {}): Promise<Docs> {
	return readResource<Docs>(
		opts.registryBase ?? DEFAULT_REGISTRY_BASE,
		"docs.json",
	);
}

const normalize = (input: string) =>
	input
		.trim()
		.toLowerCase()
		.replace(/^https?:\/\/[^/]+/, "")
		.replace(/^\/?icons\/docs\/?/, "")
		.replace(/^\/+|\/+$/g, "")
		.replace(/\s+/g, "-");

export function findDoc(docs: Docs, input: string): DocPage | undefined {
	const needle = normalize(input);
	if (!needle) return undefined;

	return (
		docs.pages.find((page) => page.slug === needle) ??
		docs.pages.find((page) => page.slug.split("/").pop() === needle) ??
		docs.pages.find((page) => normalize(page.title) === needle)
	);
}
