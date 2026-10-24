"use client";

import { StarIcon } from "@/icons/huge/star-icon";
import { use } from "react";

const StarProof: React.FC<{ stars: Promise<number | null> }> = ({ stars }) => {
	const count = use(stars);
	if (!count) return null;

	return (
		<div
			data-item
			className="text-textMuted mb-3.5 flex items-center gap-2 text-[12.5px]"
		>
			<StarIcon size={14} color="var(--color-warning)" />
			<span>
				Starred by{" "}
				<b className="text-textPrimary font-medium">
					{count.toLocaleString("en-US")} developers
				</b>{" "}
				on GitHub
			</span>
		</div>
	);
};

export default StarProof;
