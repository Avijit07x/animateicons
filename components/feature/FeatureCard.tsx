"use client";

/**
 * FeatureCard — premium glass-style card matching the NpmSection treatment.
 *
 * Composition:
 *   - Subtle bordered surface with a top-down white gradient (glass)
 *   - Icon sits in a small primary-tinted chip
 *   - 1px highlight along the top edge, like light catching a beveled surface
 *   - Hover: border tint shifts toward primary, soft primary-tinted shadow
 */

import handleHover from "@/utils/handleHover";
import { cn } from "@/lib/utils";
import type { IconHandle } from "@/types/icon";
import { motion } from "motion/react";
import { useRef } from "react";

type Props = {
	feature: FeatureItem;
};

const FeatureCard: React.FC<Props> = ({ feature }) => {
	const iconRef = useRef<IconHandle | null>(null);

	return (
		<motion.div
			variants={{
				hidden: { opacity: 0, y: 16 },
				show: {
					opacity: 1,
					y: 0,
					transition: { duration: 0.45, ease: "easeOut" },
				},
			}}
			onMouseEnter={(e) => handleHover(e, iconRef)}
			onMouseLeave={(e) => handleHover(e, iconRef)}
			className={cn(
				"group relative overflow-hidden rounded-2xl p-6",
				"border-border/60 hover:border-primary/40 border",
				"bg-gradient-to-b from-white/[0.03] to-white/[0.01]",
				"transition-all duration-300",
				"hover:shadow-[0_8px_24px_-12px_color-mix(in_oklab,var(--color-primary)_30%,transparent)]",
			)}
		>
			{/* Top edge highlight, like a glass bevel */}
			<span
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-4 top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
			/>

			<div
				className={cn(
					"text-primary mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl",
					"border-primary/20 border",
					"from-primary/15 to-primary/5 bg-gradient-to-b",
				)}
			>
				<feature.Icon ref={iconRef} size={22} />
			</div>

			<h3 className="text-textPrimary mb-2 text-sm font-semibold">
				{feature.title}
			</h3>

			<p className="text-textSecondary text-sm leading-relaxed">
				{feature.description}
			</p>
		</motion.div>
	);
};

export default FeatureCard;
