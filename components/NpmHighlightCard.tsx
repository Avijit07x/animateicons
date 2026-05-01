"use client";

/**
 * NpmHighlightCard — single feature tile inside NpmSection.
 *
 * Why a separate client component: NpmSection is a server component
 * (it awaits shiki for code highlighting). Hover-to-animate requires
 * client-side refs + handlers, so the four highlight tiles are
 * extracted here.
 *
 * Hovering anywhere on the card triggers the icon's startAnimation()
 * via handleHover — same pattern as FeatureCard. The AnimateIcons
 * component animates even when the cursor isn't directly on it.
 */

import { cn } from "@/lib/utils";
import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import { useRef } from "react";

type AnimatedIcon = React.ComponentType<{
	size?: number;
	className?: string;
	ref?: React.Ref<IconHandle>;
}>;

type Props = {
	Icon: AnimatedIcon;
	title: string;
	body: string;
};

const NpmHighlightCard: React.FC<Props> = ({ Icon, title, body }) => {
	const iconRef = useRef<IconHandle | null>(null);

	return (
		<li
			onMouseEnter={(e) => handleHover(e, iconRef)}
			onMouseLeave={(e) => handleHover(e, iconRef)}
			className={cn(
				"group relative flex flex-col gap-3 overflow-hidden rounded-2xl p-5",
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
					"text-primary inline-flex size-10 items-center justify-center rounded-xl",
					"border-primary/20 border",
					"from-primary/15 to-primary/5 bg-gradient-to-b",
				)}
			>
				<Icon ref={iconRef} size={20} />
			</div>
			<h3 className="text-textPrimary text-sm font-semibold">{title}</h3>
			<p className="text-textSecondary text-xs leading-relaxed">{body}</p>
		</li>
	);
};

export default NpmHighlightCard;
