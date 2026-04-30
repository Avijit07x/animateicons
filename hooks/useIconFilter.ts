"use client";

/**
 * useIconSearchFilter
 *
 * Filter + rank hook powering the AnimateIcons gallery search. Combines
 * a custom prefix/contains scorer (so "bell" puts "bell" before
 * "bell-ring" before "doorbell") with a Fuse.js fuzzy fallback for
 * typos. Also flags icons added in the last three days as `isNew` so
 * the gallery can decorate them.
 */

import { differenceInDays } from "date-fns";
import Fuse from "fuse.js";
import { useMemo } from "react";

type Params = {
	icons: IconListItem[];
	category: string;
	query: string;
};

export type IconFilteredItem = IconListItem & { isNew: boolean };

export const useIconSearchFilter = ({
	icons,
	category,
	query,
}: Params): IconFilteredItem[] => {
	const categoryIcons = useMemo(() => {
		if (!icons.length) return [];
		if (category === "all") return icons;

		return icons.filter((icon) => icon.category?.includes(category));
	}, [icons, category]);

	const fuse = useMemo(() => {
		if (!icons.length) return null;

		return new Fuse(icons, {
			keys: [
				{ name: "name", weight: 0.9 },
				{ name: "keywords", weight: 0.1 },
			],
			threshold: 0.25,
			ignoreLocation: true,
			minMatchCharLength: 2,
			includeScore: true,
		});
	}, [icons]);

	const filteredItems = useMemo(() => {
		if (!categoryIcons.length) return [];

		const q = query.trim().toLowerCase();
		let items = categoryIcons;

		if (q.length >= 2) {
			const exact: IconListItem[] = [];
			const startsWith: IconListItem[] = [];
			const contains: IconListItem[] = [];

			for (const icon of categoryIcons) {
				const name = icon.name.toLowerCase();
				if (name === q) {
					exact.push(icon);
				} else if (name.startsWith(q)) {
					startsWith.push(icon);
				} else if (name.includes(q)) {
					contains.push(icon);
				}
			}

			const customMatches = [...exact, ...startsWith, ...contains];
			let fuseMatches: IconListItem[] = [];

			if (fuse) {
				const isAll = category === "all";
				fuseMatches = fuse
					.search(q)
					.filter(
						(r) =>
							(r.score ?? 1) < 0.4 &&
							(isAll || categoryIcons.some((ci) => ci.name === r.item.name)),
					)
					.map((r) => r.item);
			}

			const uniqueItems = new Map<string, IconListItem>();

			for (const icon of [...customMatches, ...fuseMatches]) {
				if (!uniqueItems.has(icon.name)) {
					uniqueItems.set(icon.name, icon);
				}
			}

			items = Array.from(uniqueItems.values());
		}

		const now = new Date();

		return items
			.map((item) => ({
				...item,
				isNew: !!(
					item.addedAt && differenceInDays(now, new Date(item.addedAt)) <= 3
				),
			}))
			.sort((a, b) => Number(b.isNew) - Number(a.isNew));
	}, [query, fuse, categoryIcons]);

	return filteredItems;
};
