import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import type { Catalog, RegistryItem } from "./types";

export const DEFAULT_REGISTRY_BASE = "https://animateicons.in/r";

const CACHE_TTL_MS = 60 * 60 * 1000;

function isRemote(base: string): boolean {
	return /^https?:\/\//i.test(base);
}

function cacheFile(): string {
	return path.join(os.homedir(), ".animateicons", "catalog.json");
}

export async function readResource<T>(base: string, name: string): Promise<T> {
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
	registryBase?: string;
	noCache?: boolean;
}

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
		} catch {}
	}

	const catalog = await readResource<Catalog>(base, "catalog.json");
	try {
		fs.mkdirSync(path.dirname(cf), { recursive: true });
		fs.writeFileSync(cf, JSON.stringify(catalog), "utf8");
	} catch {}
	return catalog;
}

export interface FetchItemOptions {
	registryBase?: string;
}

export async function fetchRegistryItem(
	registryName: string,
	opts: FetchItemOptions = {},
): Promise<RegistryItem> {
	const base = opts.registryBase ?? DEFAULT_REGISTRY_BASE;
	return readResource<RegistryItem>(base, `${registryName}.json`);
}
