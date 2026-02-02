"use client";

import { differenceInDays } from "date-fns";
import Fuse from "fuse.js";
import { AnimatePresence } from "motion/react";
import React, { useMemo } from "react";

import { ICON_LIST as HUGE_ICON_LIST } from "../../../icons/huge";
import { ICON_LIST as LUCIDE_ICON_LIST } from "../../../icons/lucide";

import { useIconLibrary } from "@/hooks/useIconLibrary";
import { useIconSearch } from "../_context/IconSearchContext";
import IconsNotFound from "./IconsNotFound";
import IconTile from "./IconTile";

const ICON_LIST_MAP = {
	lucide: LUCIDE_ICON_LIST,
	huge: HUGE_ICON_LIST,
} as const;

const IconList: React.FC = () => {
	const { debouncedQuery } = useIconSearch();
	const library = useIconLibrary();

	const icons = library ? ICON_LIST_MAP[library] : [];

	const fuse = useMemo(() => {
		if (!icons.length) return null;

		return new Fuse(icons, {
			keys: [
				{ name: "name", weight: 0.7 },
				{ name: "keywords", weight: 0.3 },
			],
			threshold: 0.2,
			ignoreLocation: true,
			minMatchCharLength: 2,
		});
	}, [icons]);

	const filteredItems = useMemo(() => {
		if (!icons.length) return [];

		const items =
			debouncedQuery.trim() && fuse
				? fuse.search(debouncedQuery).map((r) => r.item)
				: icons;

		const withNewFlag = items.map((item) => ({
			item,
			isNew:
				item.addedAt &&
				differenceInDays(new Date(), new Date(item.addedAt)) <= 3,
		}));

		withNewFlag.sort((a, b) => Number(b.isNew) - Number(a.isNew));

		return withNewFlag.map((entry) => entry.item);
	}, [debouncedQuery, fuse, icons]);

	if (!library) {
		return <IconsNotFound />;
	}

	return (
		<AnimatePresence mode="popLayout">
			{filteredItems.length > 0 ? (
				<div className="mt-5 grid w-full grid-cols-1 gap-4 px-6 pb-10 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
					{filteredItems.map((item, i) => (
						<IconTile key={item.name ?? i} item={item} />
					))}
				</div>
			) : (
				<IconsNotFound />
			)}
		</AnimatePresence>
	);
};

export default IconList;
