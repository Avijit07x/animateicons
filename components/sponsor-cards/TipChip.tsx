"use client";

import { cn } from "@/lib/utils";
import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import type { Tip } from "./types";

type Props = {
	tip: Tip;
	visible: boolean;
	expanded: boolean;
	onToggle: () => void;
};

const TipChip: React.FC<Props> = ({ tip, visible, expanded, onToggle }) => {
	const { ref, triggerProps } = useIconHover();
	const Icon = tip.icon;
	const className = cn(
		"text-textPrimary flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full bg-white/6 px-2.5 text-[13px] whitespace-nowrap shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07)] transition-[background-color,scale] duration-150 hover:bg-white/10 active:scale-96",
		!visible && "opacity-0",
		expanded && "bg-white/12",
	);
	const content = (
		<>
			<Icon ref={ref} size={14} color={tip.color} />
			{tip.chip}
		</>
	);

	if (tip.kind === "link") {
		return (
			<a
				data-chip
				href={tip.href}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={tip.label}
				{...triggerProps}
				className={className}
			>
				{content}
			</a>
		);
	}

	return (
		<button
			data-chip
			type="button"
			aria-label="Show UPI QR code"
			aria-expanded={expanded}
			onClick={onToggle}
			{...triggerProps}
			className={className}
		>
			{content}
		</button>
	);
};

export default TipChip;
