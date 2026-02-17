"use client";

import { differenceInDays } from "date-fns";
import Fuse from "fuse.js";
import { useMemo } from "react";

type Params = {
	icons: IconListItem[];
	category: string;
	query: string;
};

export const useIconSearchFilter = ({
	icons,
	category,
	query,
}: Params): IconListItem[] => {
	const categoryIcons = useMemo(() => {
		if (!icons.length) return [];
		if (category === "all") return icons;

		return icons.filter((icon) => icon.category?.includes(category));
	}, [icons, category]);

	const fuse = useMemo(() => {
		if (!categoryIcons.length) return null;

		return new Fuse(categoryIcons, {
			keys: [
				{ name: "name", weight: 0.9 },
				{ name: "keywords", weight: 0.1 },
			],
			threshold: 0.25,
			ignoreLocation: true,
			minMatchCharLength: 2,
			includeScore: true,
		});
	}, [categoryIcons]);

	const filteredItems = useMemo(() => {
		if (!categoryIcons.length) return [];

		const q = query.trim().toLowerCase();
		let items = categoryIcons;

		if (q.length >= 2) {
			const exactMatches = categoryIcons.filter(
				(icon) => icon.name.toLowerCase() === q,
			);

			if (exactMatches.length > 0) {
				items = exactMatches;
			} else {
				const startsWithMatches = categoryIcons.filter((icon) =>
					icon.name.toLowerCase().startsWith(q),
				);

				const containsMatches = categoryIcons.filter((icon) =>
					icon.name.toLowerCase().includes(q),
				);

				const combined = [
					...startsWithMatches,
					...containsMatches.filter(
						(item) => !startsWithMatches.some((s) => s.name === item.name),
					),
				];

				if (combined.length > 0) {
					items = combined;
				} else if (fuse) {
					items = fuse
						.search(q)
						.filter((r) => (r.score ?? 1) < 0.4)
						.map((r) => r.item);
				}
			}
		}

		const now = new Date();

		return items
			.map((item) => ({
				item,
				isNew:
					item.addedAt && differenceInDays(now, new Date(item.addedAt)) <= 3,
			}))
			.sort((a, b) => Number(b.isNew) - Number(a.isNew))
			.map((entry) => entry.item);
	}, [query, fuse, categoryIcons]);

	return filteredItems;
};
