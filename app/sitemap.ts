import type { MetadataRoute } from "next";
import { ICON_LIST as HUGE_ICON_LIST } from "@/icons/huge";
import { ICON_LIST as LUCIDE_ICON_LIST } from "@/icons/lucide";
import { SITE_URL } from "@/lib/site";
import { docsPages } from "./icons/docs/_lib/nav";

export const revalidate = 86400;

const latestAddedAt = (list: { addedAt: string }[]): Date => {
	if (!list.length) return new Date();
	const max = list.reduce(
		(acc, item) => (item.addedAt > acc ? item.addedAt : acc),
		list[0].addedAt,
	);
	const d = new Date(max);
	return Number.isNaN(d.getTime()) ? new Date() : d;
};

const iconEntry = (
	library: "lucide" | "huge",
	item: { name: string; addedAt: string },
): MetadataRoute.Sitemap[number] => {
	const d = new Date(item.addedAt);
	return {
		url: `${SITE_URL}/icons/${library}/${item.name}`,
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
			url: `${SITE_URL}/`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${SITE_URL}/icons/lucide`,
			lastModified: latestAddedAt(LUCIDE_ICON_LIST),
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${SITE_URL}/icons/huge`,
			lastModified: latestAddedAt(HUGE_ICON_LIST),
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${SITE_URL}/privacy`,
			lastModified: now,
			changeFrequency: "yearly",
			priority: 0.2,
		},
		...docsPages.map((page): MetadataRoute.Sitemap[number] => ({
			url: `${SITE_URL}${page.href}`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.7,
		})),
		...lucideIconEntries,
		...hugeIconEntries,
	];
}
