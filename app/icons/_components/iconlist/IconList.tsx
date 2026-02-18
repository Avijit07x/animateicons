"use client";

import { AnimatePresence } from "motion/react";
import React from "react";

import { ICON_LIST as FONTFAWESOME_ICON_LIST } from "@/icons/fontawesome";
import { ICON_LIST as HUGE_ICON_LIST } from "@/icons/huge";
import { ICON_LIST as LUCIDE_ICON_LIST } from "@/icons/lucide";

import { useIconLibrary } from "@/hooks/useIconLibrary";
import { useCategory } from "../../_contexts/CategoryContext";
import { useIconSearch } from "../../_contexts/IconSearchContext";

import { useIconSearchFilter } from "@/hooks/useIconFilter";
import IconLibraryEmptyState from "./IconLibraryEmptyState";
import IconsNotFound from "./IconsNotFound";
import IconTile from "./IconTile";

const ICON_LIST_MAP = {
	lucide: LUCIDE_ICON_LIST,
	huge: HUGE_ICON_LIST,
	fontawesome: FONTFAWESOME_ICON_LIST,
} as const;

const IconList: React.FC = () => {
	const { debouncedQuery } = useIconSearch();
	const { library } = useIconLibrary();
	const { category } = useCategory();

	const baseIcons: IconListItem[] = library ? ICON_LIST_MAP[library] : [];

	const filteredItems = useIconSearchFilter({
		icons: baseIcons,
		category,
		query: debouncedQuery,
	});

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

					{!debouncedQuery && (
						<div className="py-4 text-center">
							<p className="text-textPrimary text-sm font-medium">
								More icons coming soon
							</p>
							<p className="text-textMuted mt-1 text-xs">
								New animated icons are added regularly.
							</p>
						</div>
					)}
				</>
			) : (
				<IconsNotFound />
			)}
		</AnimatePresence>
	);
};

export default React.memo(IconList);
