/**
 * GitHub Sponsors - server-only fetcher.
 *
 * Hits the GraphQL endpoint with `GITHUB_SPONSORS_TOKEN` (a fine-grained
 * PAT with `read:user` scope is enough for public sponsors data) and
 * returns the unified `Supporter[]` shape. Cached via Next's fetch
 * revalidate so we don't burn the GraphQL rate limit.
 *
 * Token: https://github.com/settings/tokens (classic) or fine-grained.
 */

import "server-only";

import type { Supporter } from "@/lib/supporters/types";
import type { GhSponsorNode, GhSponsorsResponse } from "./types";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";
const GITHUB_LOGIN = "Avijit07x";
const REVALIDATE_SECONDS = 60 * 60;

const QUERY = /* GraphQL */ `
	query Sponsors($login: String!) {
		user(login: $login) {
			sponsors(first: 100) {
				totalCount
				nodes {
					__typename
					... on User {
						login
						name
						avatarUrl
						url
					}
					... on Organization {
						login
						name
						avatarUrl
						url
					}
				}
			}
		}
	}
`;

const mapSponsor = (node: GhSponsorNode): Supporter => ({
	id: `github:${node.login}`,
	source: "github",
	name: node.name?.trim() || node.login,
	avatarUrl: node.avatarUrl,
	message: null,
	amount: null,
	currency: null,
	createdAt: null,
	url: node.url,
});

export const fetchGithubSponsors = async (): Promise<Supporter[]> => {
	const token = process.env.GITHUB_SPONSORS_TOKEN;
	if (!token) return [];

	try {
		const res = await fetch(GITHUB_GRAPHQL, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
				"User-Agent": "animateicons-site",
			},
			body: JSON.stringify({
				query: QUERY,
				variables: { login: GITHUB_LOGIN },
			}),
			next: { revalidate: REVALIDATE_SECONDS, tags: ["github-sponsors"] },
		});

		if (!res.ok) {
			console.error(`[github] sponsors fetch failed: ${res.status}`);
			return [];
		}

		const json = (await res.json()) as GhSponsorsResponse;
		if (json.errors?.length) {
			console.error("[github] sponsors graphql errors:", json.errors);
			return [];
		}

		const nodes = json.data?.user?.sponsors.nodes ?? [];
		return nodes.map(mapSponsor);
	} catch (err) {
		console.error("[github] sponsors fetch threw:", err);
		return [];
	}
};
