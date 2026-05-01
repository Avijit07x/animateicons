"use client";

/**
 * IconTile
 *
 * SRP: render one AnimateIcons tile in the gallery grid — the animated
 * icon, its name, and the action row. The action buttons are delegated
 * to IconTileActions so this component stays pure with respect to
 * copy/load state. With React.memo, this means the heavy AnimateIcons
 * component (with its motion/react variants and SVG paths) only
 * re-renders when its own props change, even when other tiles fire
 * copy actions.
 */

import type { IconFilteredItem } from "@/hooks/useIconFilter";
import { useIconLibrary } from "@/hooks/useIconLibrary";
import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import React from "react";
import {
	iconNameToComponent,
	usePlayground,
} from "../../_contexts/PlaygroundContext";
import IconTileActions from "./IconTileActions";

type Props = {
	item: IconFilteredItem;
};

const IconTile: React.FC<Props> = ({ item }) => {
	const { library, prefix } = useIconLibrary();
	const { openPlayground } = usePlayground();
	const iconRef = React.useRef<IconHandle>(null);

	if (!library || !prefix) {
		throw new Error("useIconLibrary used outside /icons route");
	}

	const tileId = `${library}-${item.name}`;
	const IconComponent = item.icon;

	const handleOpen = () =>
		openPlayground({
			name: item.name,
			Component: IconComponent,
			componentName: iconNameToComponent(item.name),
		});

	return (
		<div className="bg-surfaceElevated/65 border-border hover:bg-surfaceHover relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-md border p-4 text-sm text-white shadow-lg transition-all hover:scale-102">
			{item.isNew && (
				<span className="bg-surface text-textSecondary absolute top-0 right-0 rounded-bl-md px-2 py-1 text-xs font-medium">
					New
				</span>
			)}

			<div
				role="button"
				tabIndex={0}
				aria-label={`Open ${item.name} in playground`}
				onClick={handleOpen}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						handleOpen();
					}
				}}
				onMouseEnter={(e) => handleHover(e, iconRef)}
				onMouseLeave={(e) => handleHover(e, iconRef)}
				className="hover:bg-surface inline-block size-12 cursor-pointer items-center justify-center rounded-xl p-3"
			>
				<IconComponent ref={iconRef} size={23} />
			</div>
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
