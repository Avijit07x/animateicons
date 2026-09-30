"use client";

import type { IconSearchEntry } from "@/lib/icon-search";
import { cn } from "@/lib/utils";
import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import { Suspense, useEffect, useRef } from "react";

export type CommandSearchIcon = IconSearchEntry;

type Props = {
	item: CommandSearchIcon;
	isSelected: boolean;
	onSelect: () => void;
	onHover: () => void;
};

const CommandSearchItem: React.FC<Props> = ({
	item,
	isSelected,
	onSelect,
	onHover,
}) => {
	const iconRef = useRef<IconHandle | null>(null);
	const rowRef = useRef<HTMLButtonElement | null>(null);
	const Icon = item.component as React.ComponentType<{
		size?: number;
		ref?: React.Ref<IconHandle>;
	}>;

	useEffect(() => {
		if (isSelected) {
			iconRef.current?.startAnimation();
			rowRef.current?.scrollIntoView({ block: "nearest" });
		} else {
			iconRef.current?.stopAnimation();
		}
	}, [isSelected]);

	return (
		<button
			ref={rowRef}
			type="button"
			role="option"
			aria-selected={isSelected}
			onMouseEnter={(e) => {
				onHover();
				handleHover(e, iconRef);
			}}
			onMouseLeave={(e) => handleHover(e, iconRef)}
			onClick={onSelect}
			className={cn(
				"text-textPrimary flex w-full items-center gap-3 rounded-full py-1 pr-3 pl-1 text-left transition-colors",
				isSelected && "bg-surfaceElevated",
			)}
		>
			<span
				className={cn(
					"inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
					isSelected
						? "bg-primary text-white"
						: "bg-surfaceElevated text-textSecondary",
				)}
			>
				<Suspense fallback={null}>
					<Icon ref={iconRef} size={17} />
				</Suspense>
			</span>

			<span className="flex-1 truncate text-[13px] font-medium">
				{item.name}
			</span>

			<span
				className={cn(
					"text-textMuted rounded-full px-2 py-0.5 text-[10px] font-medium capitalize transition-colors",
					isSelected ? "bg-surfaceActive" : "bg-surfaceElevated",
				)}
			>
				{item.library}
			</span>
		</button>
	);
};

export default CommandSearchItem;
