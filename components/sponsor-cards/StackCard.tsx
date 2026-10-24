"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { CARD_H, CARD_W, offscreenTransform } from "./geometry";
import { STACK_SIZE } from "./tips";

type Props = {
	index: number;
	name: string;
	note: string;
	faceClassName: string;
	icon?: ReactNode;
	active?: boolean;
	hidden?: boolean;
	children: ReactNode;
};

const StackCard: React.FC<Props> = ({
	index,
	name,
	note,
	faceClassName,
	icon,
	active = false,
	hidden = false,
	children,
}) => (
	<div
		data-card
		aria-hidden={!active}
		style={{
			width: CARD_W,
			height: CARD_H,
			zIndex: STACK_SIZE - index,
			transform: offscreenTransform(index),
		}}
		className={cn(
			"absolute right-0 bottom-0 origin-right",
			active && "pointer-events-auto",
			hidden && "invisible",
		)}
	>
		<div
			data-skin
			className="bg-surfaceElevated absolute inset-0 origin-bottom overflow-hidden rounded-[16px] shadow-[-10px_14px_34px_-12px_rgba(0,0,0,0.85)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07)]"
		>
			<div
				data-face
				aria-hidden="true"
				className={cn(
					"absolute inset-0 flex flex-col items-start pt-2.5 pr-3.5 pb-3 pl-2.75 whitespace-nowrap [filter:blur(0px)]",
					faceClassName,
				)}
			>
				{icon}
				<div className="mt-auto">
					<p className="text-[13px] font-medium">{name}</p>
					<p className="text-[11.5px] opacity-70">{note}</p>
				</div>
			</div>
			{children}
		</div>
	</div>
);

export default StackCard;
