import type { MetadataRoute } from "next";
import { ICON_LIST as HUGE_ICON_LIST } from "@/icons/huge";
import { ICON_LIST as LUCIDE_ICON_LIST } from "@/icons/lucide";

const baseUrl = "https://animateicons.in";

/**
 * Pick the most recent `addedAt` from an AnimateIcons ICON_LIST. Used
 * as the lastModified for the Lucide / Huge library landing pages so
 * search engines re-crawl when new AnimateIcons ship.
 */
const latestAddedAt = (list: { addedAt: string }[]): Date => {
	if (!list.length) return new Date();
	const max = list.reduce(
		(acc, item) => (item.addedAt > acc ? item.addedAt : acc),
		list[0].addedAt,
	);
	const d = new Date(max);
	return Number.isNaN(d.getTime()) ? new Date() : d;
};

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();

	return [
		{
			url: `${baseUrl}/`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${baseUrl}/icons/lucide`,
			lastModified: latestAddedAt(LUCIDE_ICON_LIST),
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/icons/huge`,
			lastModified: latestAddedAt(HUGE_ICON_LIST),
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/icons/docs`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.7,
		},
	];
}
