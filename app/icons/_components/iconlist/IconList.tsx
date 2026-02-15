"use client";

import { differenceInDays } from "date-fns";
import Fuse from "fuse.js";
import { AnimatePresence } from "motion/react";
import React, { useMemo } from "react";

import { ICON_LIST as HUGE_ICON_LIST } from "@/icons/huge";
import { ICON_LIST as LUCIDE_ICON_LIST } from "@/icons/lucide";

import { useIconLibrary } from "@/hooks/useIconLibrary";
import { useCategory } from "../../_contexts/CategoryContext";
import { useIconSearch } from "../../_contexts/IconSearchContext";
import IconLibraryEmptyState from "./IconLibraryEmptyState";
import IconsNotFound from "./IconsNotFound";
import IconTile from "./IconTile";

const ICON_LIST_MAP = {
	lucide: LUCIDE_ICON_LIST,
	huge: HUGE_ICON_LIST,
} as const;

const IconList: React.FC = () => {
	const { debouncedQuery } = useIconSearch();
	const { library } = useIconLibrary();
	const { category } = useCategory();

	const baseIcons = library ? ICON_LIST_MAP[library] : [];

	const categoryIcons = useMemo(() => {
		if (!baseIcons.length) return [];
		if (category === "all") return baseIcons;

		return baseIcons.filter((icon) => icon.category?.includes(category));
	}, [baseIcons, category]);

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

		const query = debouncedQuery.trim().toLowerCase();
		let items = categoryIcons;

		if (query.length >= 2) {
			const exactMatches = categoryIcons.filter(
				(icon) => icon.name.toLowerCase() === query,
			);

			if (exactMatches.length > 0) {
				items = exactMatches;
			} else {
				const startsWithMatches = categoryIcons.filter((icon) =>
					icon.name.toLowerCase().startsWith(query),
				);

				const containsMatches = categoryIcons.filter((icon) =>
					icon.name.toLowerCase().includes(query),
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
					const results = fuse.search(query);

					items = results
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
	}, [debouncedQuery, fuse, categoryIcons]);

	if (!library) {
		return <IconLibraryEmptyState />;
	}

	return (
		<AnimatePresence mode="popLayout">
			{filteredItems.length > 0 ? (
				<>
					<div className="576:grid-cols-2 900:grid-cols-3 mt-3 grid w-full grid-cols-1 gap-4 pb-10 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
						{filteredItems.map((item) => (
							<IconTile key={item.name} item={item} />
						))}
					</div>
					{!debouncedQuery ? (
						<div className="py-4 text-center">
							<p className="text-textPrimary text-sm font-medium">
								More icons coming soon
							</p>
							<p className="text-textMuted mt-1 text-xs">
								New animated icons are added regularly.
							</p>
						</div>
					) : null}
				</>
			) : (
				<IconsNotFound />
			)}
		</AnimatePresence>
	);
};

export default IconList;
