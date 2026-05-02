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

/** Build a per-icon sitemap entry. Each detail page gets its own URL
 *  with `addedAt` driving lastModified so freshly-added icons signal
 *  themselves to crawlers. */
const iconEntry = (
	library: "lucide" | "huge",
	item: { name: string; addedAt: string },
): MetadataRoute.Sitemap[number] => {
	const d = new Date(item.addedAt);
	return {
		url: `${baseUrl}/icons/${library}/${item.name}`,
		lastModified: Number.isNaN(d.getTime()) ? new Date() : d,
		changeFrequency: "monthly",
		priority: 0.6,
	};
};

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();

	const lucideIconEntries = LUCIDE_ICON_LIST.map((i) => iconEntry("lucide", i));
	const hugeIconEntries = HUGE_ICON_LIST.map((i) => iconEntry("huge", i));

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
		...lucideIconEntries,
		...hugeIconEntries,
	];
}
