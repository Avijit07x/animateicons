"use client";

import { useIconLoop } from "@/hooks/useIconLoop";
import { HeartIcon } from "@/icons/huge/heart-icon";

const LOOP_MS = 3200;

const SponsorsHeader: React.FC = () => {
	const iconRef = useIconLoop(LOOP_MS);

	return (
		<div className="flex flex-col items-center text-center">
			<span className="bg-primary/10 text-primary ring-primary/5 grid size-24 place-items-center rounded-full ring-8">
				<HeartIcon ref={iconRef} size={44} />
			</span>
			<h1 className="text-textPrimary mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">
				Kept free by the community
				<span className="text-primary">.</span>
			</h1>
			<p className="text-textSecondary mt-4 max-w-xl text-sm leading-relaxed sm:text-base">
				AnimateIcons is an independent, open-source library maintained without
				ads, paid tiers, or corporate backing. The contributors below directly
				fund hosting and ongoing development, keeping every icon free.
			</p>
		</div>
	);
};

export default SponsorsHeader;
