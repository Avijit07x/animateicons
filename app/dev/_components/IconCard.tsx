"use client";

import { ArrowUpRight01Icon } from "@/icons/huge/arrow-up-right-0-1-icon";
import { cn } from "@/lib/utils";
import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import { useEffect } from "react";
import { useReview } from "../_contexts/ReviewContext";
import type { IconComponent } from "../_lib/registry";
import type { IconChange } from "../_lib/types";

const stageOf = (change: IconChange) =>
	change.staged && change.unstaged
		? { label: "Staged, edited again", className: "bg-info" }
		: change.staged
			? { label: "Staged", className: "bg-success" }
			: { label: "Not staged", className: "bg-warning" };

type Props = {
	item: IconChange;
	family: string;
	Icon?: IconComponent;
	play: number;
};

const IconCard: React.FC<Props> = ({ item, family, Icon, play }) => {
	const { size } = useReview();
	const { ref, triggerProps } = useIconHover();
	const stage = stageOf(item);
	const prefix = item.name.startsWith(`${family}-`) ? `${family}-` : "";

	useEffect(() => {
		if (play) ref.current?.startAnimation();
	}, [play, ref]);

	return (
		<div
			{...triggerProps}
			className="group bg-surface hover:bg-surfaceElevated flex flex-col rounded-3xl p-1.5 transition-colors duration-300"
		>
			<div className="bg-bgDark/60 text-textPrimary group-hover:text-primary relative grid h-28 place-items-center rounded-[7px] transition-colors duration-300">
				{Icon ? (
					<Icon ref={ref} size={Number(size)} />
				) : (
					<span className="text-textMuted text-xs">Run pnpm gen:icons</span>
				)}

				<a
					href={`/icons/${item.library}/${item.name}`}
					target="_blank"
					rel="noreferrer"
					aria-label={`Open ${item.name} in the gallery`}
					className="text-textSecondary focus-visible:ring-primary/60 absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-white/8 opacity-0 transition group-hover:opacity-100 hover:bg-white/15 hover:text-white focus-visible:opacity-100 focus-visible:ring-2 focus-visible:outline-none"
				>
					<ArrowUpRight01Icon size={14} />
				</a>
			</div>

			<div className="flex min-w-0 flex-1 flex-col gap-1 px-2 pt-2.5 pb-1.5">
				<p title={item.name} className="text-[13px] font-medium">
					<span className="text-textMuted">{prefix}</span>
					<span className="text-textPrimary">
						{item.name.slice(prefix.length)}
					</span>
				</p>
				<p className="text-textMuted mt-auto flex items-center gap-1.5 text-xs">
					<span
						aria-hidden
						className={cn("size-1.5 shrink-0 rounded-full", stage.className)}
					/>
					<span className="truncate">
						{item.isNew ? "New" : "Changed"} · {stage.label}
					</span>
				</p>
			</div>
		</div>
	);
};

export default IconCard;
