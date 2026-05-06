/**
 * Supporters aggregator.
 *
 * Single entry point for the /sponsors page. Fetches BMC + GitHub in
 * parallel, then sorts via the pure `compareSupporters` comparator.
 * Sources fail soft (each fetcher returns [] on error) so one outage
 * doesn't blank the page.
 */

import "server-only";

import { fetchSupporters as fetchBmcSupporters } from "@/lib/bmc/client";
import { fetchGithubSponsors } from "@/lib/github/sponsors";
import { compareSupporters } from "./sort";
import type { Supporter } from "./types";

export const getAllSupporters = async (): Promise<Supporter[]> => {
	const [bmc, github] = await Promise.all([
		fetchBmcSupporters(),
		fetchGithubSponsors(),
	]);
	return [...bmc, ...github].sort(compareSupporters);
};

export type { Supporter, SupporterSource } from "./types";
