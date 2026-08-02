"use client";

import { AnimatePresence } from "motion/react";
import React, { useEffect, useState } from "react";

import { useIconLibrary } from "@/hooks/useIconLibrary";
import { useCategory } from "../../_contexts/CategoryContext";
import { useIconSearchResult } from "../../_contexts/IconSearchContext";

import { useIconSearchFilter } from "@/hooks/useIconFilter";
import { IconTileProvider } from "../../_contexts/IconTileContext";
import IconLibraryEmptyState from "./IconLibraryEmptyState";
import IconListSkeleton from "./IconListSkeleton";
import IconsNotFound from "./IconsNotFound";
import IconTile from "./IconTile";

const IconList: React.FC = () => {
	const { debouncedQuery } = useIconSearchResult();
	const { library } = useIconLibrary();
	const { category } = useCategory();

	const [loaded, setLoaded] = useState<{
		library: string;
		icons: IconMeta[];
		getIcon: (name: string) => React.ElementType;
	} | null>(null);

	useEffect(() => {
		if (!library) return;
		let alive = true;
		const load =
			library === "huge"
				? import("@/icons/huge/meta")
				: import("@/icons/lucide/meta");
		load.then((m) => {
			if (alive) setLoaded({ library, icons: m.ICON_META, getIcon: m.getIcon });
		});
		return () => {
			alive = false;
		};
	}, [library]);

	const active = loaded && loaded.library === library ? loaded : null;
	const baseIcons = active ? active.icons : null;

	const filteredItems = useIconSearchFilter({
		icons: baseIcons ?? [],
		category,
		query: debouncedQuery,
	});

	if (!library) {
		return <IconLibraryEmptyState />;
	}

	if (baseIcons === null || active === null) {
		return <IconListSkeleton />;
	}

	return (
		<IconTileProvider>
			<AnimatePresence>
				{filteredItems.length > 0 ? (
					<>
						<div className="576:grid-cols-2 900:grid-cols-3 mt-3 grid w-full grid-cols-1 gap-4 pb-10 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
							{filteredItems.map((item) => (
								<IconTile
									key={item.name}
									item={item}
									getIcon={active.getIcon}
								/>
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
		</IconTileProvider>
	);
};

export default React.memo(IconList);
