"use client";

import { AnimatePresence, MotionConfig } from "motion/react";
import React, { useEffect, useState } from "react";

import { useCoarsePointer } from "@/hooks/useCoarsePointer";
import { useIconLibrary } from "@/hooks/useIconLibrary";
import { useCategory } from "../../_contexts/CategoryContext";
import { useIconSearchResult } from "../../_contexts/IconSearchContext";

import { useIconSearchFilter } from "@/hooks/useIconFilter";
import { IconTileProvider } from "../../_contexts/IconTileContext";
import { ICON_GRID_CLASS } from "./iconGrid";
import IconLibraryEmptyState from "./IconLibraryEmptyState";
import IconListSkeleton from "./IconListSkeleton";
import IconsNotFound from "./IconsNotFound";
import IconTile from "./IconTile";

const IconList: React.FC = () => {
	const { debouncedQuery } = useIconSearchResult();
	const { library } = useIconLibrary();
	const { category } = useCategory();
	const coarse = useCoarsePointer();

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
			<MotionConfig reducedMotion="user">
				<AnimatePresence>
					{filteredItems.length > 0 ? (
						<>
							<div className={ICON_GRID_CLASS}>
								{filteredItems.map((item) => (
									<IconTile
										key={item.name}
										item={item}
										getIcon={active.getIcon}
										alwaysShowActions={coarse}
									/>
								))}
							</div>

							{!debouncedQuery && (
								<div className="py-4 text-center">
									<p className="text-textPrimary text-sm font-medium">
										The collection is continuously expanding
									</p>
									<p className="text-textMuted mt-1 text-xs">
										New animated icons are added on a regular basis.
									</p>
								</div>
							)}
						</>
					) : (
						<IconsNotFound />
					)}
				</AnimatePresence>
			</MotionConfig>
		</IconTileProvider>
	);
};

export default React.memo(IconList);
