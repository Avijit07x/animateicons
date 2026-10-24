"use client";

import { Button } from "@/components/ui/button";
import { PlayIcon } from "@/icons/lucide/play-icon";
import { useState } from "react";
import { useReview } from "../_contexts/ReviewContext";
import type { FamilyGroup } from "../_lib/types";
import IconCard from "./IconCard";

export const CARD_GRID_CLASS =
	"grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-3";

const summarize = (group: FamilyGroup) => {
	const fresh = group.items.filter((item) => item.isNew).length;
	const edited = group.items.length - fresh;
	return [fresh && `${fresh} new`, edited && `${edited} changed`]
		.filter(Boolean)
		.join(" · ");
};

const FamilySection: React.FC<{ group: FamilyGroup }> = ({ group }) => {
	const { playToken, getIcon } = useReview();
	const [familyToken, setFamilyToken] = useState(0);

	return (
		<section
			id={group.id}
			aria-label={group.family}
			className="flex scroll-mt-24 flex-col gap-3"
		>
			<div className="flex items-center justify-between gap-3 px-1">
				<div className="flex items-center gap-2.5">
					<h3 className="text-textPrimary text-[15px] font-medium capitalize">
						{group.family}
					</h3>
					<span className="text-textMuted text-xs tabular-nums">
						{summarize(group)}
					</span>
				</div>
				<Button
					variant="secondary"
					size="xs"
					onClick={() => setFamilyToken((n) => n + 1)}
				>
					<PlayIcon size={12} />
					Play family
				</Button>
			</div>

			<div className={CARD_GRID_CLASS}>
				{group.items.map((item) => (
					<IconCard
						key={`${item.library}-${item.name}`}
						item={item}
						family={group.family}
						Icon={getIcon(item.library, item.name)}
						play={playToken + familyToken}
					/>
				))}
			</div>
		</section>
	);
};

export default FamilySection;
