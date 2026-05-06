/**
 * Buy Me a Coffee — server-only fetcher.
 *
 * Hits `/api/v1/supporters` with the personal access token from
 * `BMC_ACCESS_TOKEN` and walks BMC's Laravel-style pagination so we
 * don't silently truncate at 25 supporters. Each page is cached
 * separately under the same revalidate window. Server components only,
 * the token never crosses the network to the client.
 *
 * Token: https://developers.buymeacoffee.com/dashboard
 */

import "server-only";

import type { Supporter } from "@/lib/supporters/types";
import { mapBmcSupporter } from "./mapper";
import type { BmcSupportersResponse } from "./types";

const BMC_API = "https://developers.buymeacoffee.com/api/v1/supporters";

// Refresh hourly. Supporters trickle in, no need to fetch on every request.
const REVALIDATE_SECONDS = 60 * 60;

// Hard cap so a misconfigured account doesn't loop forever.
const MAX_PAGES = 20;

const fetchPage = async (
	page: number,
	token: string,
): Promise<BmcSupportersResponse | null> => {
	const url = `${BMC_API}?page=${page}`;
	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${token}` },
		next: { revalidate: REVALIDATE_SECONDS, tags: ["bmc-supporters"] },
	});

	if (!res.ok) {
		console.error(`[bmc] page ${page} failed: ${res.status}`);
		return null;
	}

	return (await res.json()) as BmcSupportersResponse;
};

/**
 * Returns the full supporter list across all pages, filtering out
 * anonymous/hidden tips. Falls back to whatever pages did succeed
 * (or `[]`) if BMC has a bad day. Errors are logged for Vercel,
 * never thrown — the page must still render.
 */
export const fetchSupporters = async (): Promise<Supporter[]> => {
	const token = process.env.BMC_ACCESS_TOKEN;
	if (!token) return [];

	try {
		const supporters: Supporter[] = [];
		let page = 1;

		while (page <= MAX_PAGES) {
			const json = await fetchPage(page, token);
			if (!json || !Array.isArray(json.data)) break;

			for (const raw of json.data) {
				if (raw.support_visibility !== 1) continue;
				supporters.push(mapBmcSupporter(raw));
			}

			if (page >= (json.last_page ?? page)) break;
			page += 1;
		}

		return supporters;
	} catch (err) {
		console.error("[bmc] supporters fetch threw:", err);
		return [];
	}
};
