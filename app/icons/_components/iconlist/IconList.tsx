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
import { useWindowedGrid } from "./useWindowedGrid";

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
				? Promise.all([import("@/icons/huge/meta"), import("@/icons/huge")])
				: Promise.all([
						import("@/icons/lucide/meta"),
						import("@/icons/lucide"),
					]);
		load.then(([meta, all]) => {
			if (!alive) return;
			const byName = new Map<string, React.ElementType>(
				all.ICON_LIST.map((entry) => [entry.name, entry.icon]),
			);
			setLoaded({
				library,
				icons: meta.ICON_META,
				getIcon: (name) => byName.get(name) as React.ElementType,
			});
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

	const {
		setGrid,
		slice,
		topSpacer,
		bottomSpacer,
		onFocusCapture,
		onBlurCapture,
	} = useWindowedGrid(filteredItems);

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
							<div
								ref={setGrid}
								className={ICON_GRID_CLASS}
								onFocusCapture={onFocusCapture}
								onBlurCapture={onBlurCapture}
							>
								{topSpacer > 0 && (
									<div
										aria-hidden="true"
										className="col-span-full"
										style={{ height: topSpacer }}
									/>
								)}
								{slice.map((item) => (
									<IconTile
										key={item.name}
										item={item}
										getIcon={active.getIcon}
										alwaysShowActions={coarse}
									/>
								))}
								{bottomSpacer > 0 && (
									<div
										aria-hidden="true"
										className="col-span-full"
										style={{ height: bottomSpacer }}
									/>
								)}
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
