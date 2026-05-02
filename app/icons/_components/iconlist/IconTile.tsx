"use client";

/**
 * IconTile
 *
 * SRP: render one AnimateIcons tile in the gallery grid — the animated
 * icon, its name, and the action row. The icon area is a Link to the
 * per-icon detail page (`/icons/<library>/<name>`) so cmd-click opens
 * in a new tab and crawlers can follow it. Copy actions are delegated
 * to IconTileActions to keep this component pure with respect to
 * copy/load state.
 */

import type { IconFilteredItem } from "@/hooks/useIconFilter";
import { useIconLibrary } from "@/hooks/useIconLibrary";
import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import Link from "next/link";
import React from "react";
import IconTileActions from "./IconTileActions";

type Props = {
	item: IconFilteredItem;
};

const IconTile: React.FC<Props> = ({ item }) => {
	const { library, prefix } = useIconLibrary();
	const iconRef = React.useRef<IconHandle>(null);

	if (!library || !prefix) {
		throw new Error("useIconLibrary used outside /icons route");
	}

	const tileId = `${library}-${item.name}`;
	const IconComponent = item.icon;

	return (
		<div className="bg-surfaceElevated/65 border-border hover:bg-surfaceHover relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-md border p-4 text-sm text-white shadow-lg transition-all hover:scale-102">
			{item.isNew && (
				<span className="bg-surface text-textSecondary absolute top-0 right-0 rounded-bl-md px-2 py-1 text-xs font-medium">
					New
				</span>
			)}

			<Link
				href={`/icons/${library}/${item.name}`}
				aria-label={`View ${item.name} icon details`}
				onMouseEnter={(e) => handleHover(e, iconRef)}
				onMouseLeave={(e) => handleHover(e, iconRef)}
				className="hover:bg-surface inline-flex size-12 cursor-pointer items-center justify-center rounded-xl p-3"
			>
				<IconComponent ref={iconRef} size={23} />
			</Link>
			<p className="line-clamp-1 text-gray-300">{item.name}</p>

			<IconTileActions
				tileId={tileId}
				library={library}
				prefix={prefix}
				name={item.name}
			/>
		</div>
	);
};

export default React.memo(IconTile);
