"use client";

/**
 * CommandSearchItem
 *
 * Single row in the Cmd+K results. The icon plays its hover variant
 * whenever the row is hovered OR keyboard-selected (parent passes
 * isSelected). Clicking the row navigates to the icon's detail page.
 */

import { cn } from "@/lib/utils";
import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import { useEffect, useRef } from "react";

export type CommandSearchIcon = {
	name: string;
	library: "lucide" | "huge";
	component: React.ElementType;
};

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

	// Keyboard-selected rows should animate their icon too — feels much
	// more alive than a static highlight.
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
				"flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
				"text-textPrimary",
				isSelected
					? "bg-primary/10 ring-primary/30 ring-1 ring-inset"
					: "hover:bg-white/[0.04]",
			)}
		>
			<span
				className={cn(
					"inline-flex size-8 items-center justify-center rounded-lg",
					"border-border/60 from-surface to-surfaceElevated border bg-gradient-to-b",
				)}
			>
				<Icon ref={iconRef} size={16} />
			</span>

			<span className="flex-1 truncate font-mono text-sm">{item.name}</span>

			<span
				className={cn(
					"text-textMuted rounded-full px-2 py-0.5 text-[10px] tracking-wide uppercase",
					"border-border/60 border",
				)}
			>
				{item.library}
			</span>
		</button>
	);
};

export default CommandSearchItem;
