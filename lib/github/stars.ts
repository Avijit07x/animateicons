/**
 * GitHub stars - server-only fetcher.
 *
 * Replaces the old `/api/stars` route + client-side SWR hook so the
 * count is rendered on the server with the page itself, not fetched
 * separately from every visitor's browser. Saves ~1 edge request per
 * page load.
 *
 * Caches via Next's fetch revalidate (1h). Falls back to null on any
 * failure so the navbar still renders without the badge.
 */

import "server-only";

const REPO_API = "https://api.github.com/repos/Avijit07x/animateicons";
const REVALIDATE_SECONDS = 60 * 60;

type RepoResponse = {
	stargazers_count: number;
};

export const fetchStars = async (): Promise<number | null> => {
	try {
		// Use the sponsors token if present - bumps the rate limit from
		// 60 req/hr (anon) to 5,000 (authenticated). No extra scope needed
		// for public repo stat reads.
		const token = process.env.GITHUB_SPONSORS_TOKEN;
		const headers: HeadersInit = token
			? { Authorization: `Bearer ${token}` }
			: {};

		const res = await fetch(REPO_API, {
			headers,
			next: { revalidate: REVALIDATE_SECONDS, tags: ["github-stars"] },
		});

		if (!res.ok) {
			console.error(`[github] stars fetch failed: ${res.status}`);
			return null;
		}

		const data = (await res.json()) as RepoResponse;
		return typeof data.stargazers_count === "number"
			? data.stargazers_count
			: null;
	} catch (err) {
		console.error("[github] stars fetch threw:", err);
		return null;
	}
};
