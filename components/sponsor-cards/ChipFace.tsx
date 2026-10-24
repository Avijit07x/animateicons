"use client";

import type { Tip } from "./types";

const ChipFace: React.FC<{ tip: Tip }> = ({ tip }) => {
	const Icon = tip.icon;

	return (
		<div
			data-chip-face
			aria-hidden="true"
			className="text-textPrimary absolute inset-0 flex items-center justify-center gap-1.5 text-[13px] whitespace-nowrap opacity-0"
		>
			<Icon size={14} color={tip.color} />
			{tip.chip}
		</div>
	);
};

export default ChipFace;
