import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import type { Catalog, RegistryItem } from "./types";

/** Default production registry, served from the showcase site. */
export const DEFAULT_REGISTRY_BASE = "https://animateicons.in/r";

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function isRemote(base: string): boolean {
	return /^https?:\/\//i.test(base);
}

function cacheFile(): string {
	return path.join(os.homedir(), ".animateicons", "catalog.json");
}

/**
 * Read a registry resource by file name. The base may be a remote
 * `http(s)` URL (fetched) or a local directory (read from disk). The local
 * path mode is what lets the CLI and the test-suite run fully offline against
 * the repo's own `public/r` directory.
 */
async function readResource<T>(base: string, name: string): Promise<T> {
	if (isRemote(base)) {
		const url = `${base.replace(/\/+$/, "")}/${name}`;
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(
				`Failed to fetch ${url}: ${res.status} ${res.statusText}`,
			);
		}
		return (await res.json()) as T;
	}
	const file = path.join(base, name);
	return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

export interface FetchCatalogOptions {
	/** Registry base URL or local directory. Defaults to the live site. */
	registryBase?: string;
	/** Skip the on-disk cache and always re-fetch. */
	noCache?: boolean;
}

/**
 * Fetch the icon catalog. Remote catalogs are cached under
 * `~/.animateicons/catalog.json` for an hour so repeat CLI/MCP calls are
 * instant; local-directory catalogs are read straight from disk (no cache).
 */
export async function fetchCatalog(
	opts: FetchCatalogOptions = {},
): Promise<Catalog> {
	const base = opts.registryBase ?? DEFAULT_REGISTRY_BASE;

	if (!isRemote(base)) {
		return readResource<Catalog>(base, "catalog.json");
	}

	const cf = cacheFile();
	if (!opts.noCache) {
		try {
			const stat = fs.statSync(cf);
			if (Date.now() - stat.mtimeMs < CACHE_TTL_MS) {
				return JSON.parse(fs.readFileSync(cf, "utf8")) as Catalog;
			}
		} catch {
			// no usable cache - fall through to fetch
		}
	}

	const catalog = await readResource<Catalog>(base, "catalog.json");
	try {
		fs.mkdirSync(path.dirname(cf), { recursive: true });
		fs.writeFileSync(cf, JSON.stringify(catalog), "utf8");
	} catch {
		// best-effort cache; never fail the command over it
	}
	return catalog;
}

export interface FetchItemOptions {
	registryBase?: string;
}

/** Fetch one icon's shadcn registry item (with its source content). */
export async function fetchRegistryItem(
	registryName: string,
	opts: FetchItemOptions = {},
): Promise<RegistryItem> {
	const base = opts.registryBase ?? DEFAULT_REGISTRY_BASE;
	return readResource<RegistryItem>(base, `${registryName}.json`);
}
