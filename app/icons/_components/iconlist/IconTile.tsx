"use client";

/**
 * IconTile
 *
 * SRP: render one AnimateIcons tile in the gallery grid - the animated
 * icon, its name, and the action row. Clicking the cell opens the
 * playground sheet via PlaygroundContext, so users explore without
 * leaving the gallery. Per-icon detail pages still exist at
 * `/icons/<library>/<name>` for SEO / direct shares / OG images, but
 * the gallery itself doesn't link to them - they're crawler-only.
 */

import type { IconFilteredItem } from "@/hooks/useIconFilter";
import { useIconLibrary } from "@/hooks/useIconLibrary";
import { ArrowUpRight01Icon } from "@/icons/huge/arrow-up-right-0-1-icon";
import { cn } from "@/lib/utils";
import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import { iconNameToComponent } from "@/utils/iconNameToComponent";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { usePlayground } from "../../_contexts/PlaygroundContext";
import IconTileActions from "./IconTileActions";

type Props = {
	item: IconFilteredItem;
	getIcon: (name: string) => React.ElementType;
	alwaysShowActions?: boolean;
};

const POP = { type: "spring", stiffness: 520, damping: 28 } as const;

const IconTile: React.FC<Props> = ({
	item,
	getIcon,
	alwaysShowActions = false,
}) => {
	const { library, prefix } = useIconLibrary();
	const { openPlayground } = usePlayground();
	const iconRef = React.useRef<IconHandle>(null);
	const [hovered, setHovered] = React.useState(false);
	const [focused, setFocused] = React.useState(false);
	const revealed = hovered || focused || alwaysShowActions;

	if (!library || !prefix) {
		throw new Error("useIconLibrary used outside /icons route");
	}

	const tileId = `${library}-${item.name}`;
	const IconComponent = getIcon(item.name) as React.ComponentType<{
		size?: number;
		ref?: React.Ref<IconHandle>;
	}>;

	const handleOpen = () =>
		openPlayground({
			name: item.name,
			library,
			prefix,
			Component: IconComponent,
			componentName: iconNameToComponent(item.name),
		});

	return (
		<div
			tabIndex={0}
			role="group"
			aria-label={item.name}
			onClick={handleOpen}
			onKeyDown={(e) => {
				if (e.target !== e.currentTarget) return;
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					handleOpen();
				}
			}}
			onMouseEnter={(e) => {
				setHovered(true);
				handleHover(e, iconRef);
			}}
			onMouseMove={() => {
				if (hovered) return;
				setHovered(true);
				iconRef.current?.startAnimation();
			}}
			onMouseLeave={(e) => {
				setHovered(false);
				handleHover(e, iconRef);
			}}
			onFocus={() => setFocused(true)}
			onBlur={(e) => {
				if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
			}}
			className="group text-textPrimary bg-surface hover:bg-surfaceElevated focus-visible:bg-surfaceElevated relative flex h-38 w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl p-3 text-sm transition-colors duration-300 outline-none pointer-coarse:h-50 pointer-coarse:pb-16"
		>
			<AnimatePresence>
				{revealed && (item.isNew || item.isUpdated) && (
					<motion.span
						key="badge"
						initial={{ opacity: 0, scale: 0.7 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.12 } }}
						transition={POP}
						className={cn(
							"pointer-events-none absolute top-3 left-3 origin-left rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold",
							item.isNew
								? "bg-primary/12 text-primary"
								: "bg-info/12 text-info",
						)}
					>
						{item.isNew ? "New" : "Update"}
					</motion.span>
				)}

				{revealed && (
					<motion.button
						key="open"
						type="button"
						aria-label={`Open ${item.name} in playground`}
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.12 } }}
						transition={POP}
						onClick={(e) => {
							e.stopPropagation();
							handleOpen();
						}}
						className="text-textSecondary absolute top-3 right-3 grid size-7 place-items-center rounded-full bg-white/8 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none"
					>
						<ArrowUpRight01Icon size={14} />
					</motion.button>
				)}

				{revealed && (
					<IconTileActions
						key="actions"
						tileId={tileId}
						library={library}
						prefix={prefix}
						name={item.name}
					/>
				)}
			</AnimatePresence>

			<div className="group-hover:text-primary inline-flex size-12 items-center justify-center transition-colors duration-300 pointer-coarse:size-14 pointer-coarse:[&>*]:scale-[1.4]">
				<IconComponent ref={iconRef} size={32} />
			</div>
			<p
				className={cn(
					"text-textMuted line-clamp-1 font-mono text-[13px] transition-opacity duration-300 pointer-coarse:opacity-100!",
					(hovered || focused) && "opacity-0 duration-150",
				)}
			>
				{item.name}
			</p>
		</div>
	);
};

export default React.memo(IconTile);
