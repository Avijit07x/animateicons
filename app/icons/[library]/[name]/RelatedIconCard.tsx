"use client";

/**
 * RelatedIconCard
 *
 * One card in the "Related icons" grid on the per-icon detail page.
 * Same glass-card vocabulary as NpmHighlightCard: gradient surface,
 * top-edge bevel, hover lifts a primary-tinted shadow. The icon plays
 * its hover variant whenever the whole card is hovered (not just the
 * glyph), so the card feels alive end-to-end.
 *
 * Client component because hover-to-animate requires a ref into the
 * AnimateIcons component.
 */

import { cn } from "@/lib/utils";
import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import Link from "next/link";
import { useRef } from "react";

type Props = {
	href: string;
	name: string;
	Icon: React.ElementType;
};

const RelatedIconCard: React.FC<Props> = ({ href, name, Icon }) => {
	const iconRef = useRef<IconHandle | null>(null);
	const IconComponent = Icon as React.ComponentType<{
		size?: number;
		ref?: React.Ref<IconHandle>;
	}>;

	return (
		<Link
			href={href}
			onMouseEnter={(e) => handleHover(e, iconRef)}
			onMouseLeave={(e) => handleHover(e, iconRef)}
			className={cn(
				"group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl p-5",
				"border-border/60 hover:border-primary/40 border",
				"bg-gradient-to-b from-white/[0.03] to-white/[0.01]",
				"text-textPrimary transition-all duration-300",
				"hover:shadow-[0_8px_24px_-12px_color-mix(in_oklab,var(--color-primary)_30%,transparent)]",
			)}
		>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-4 top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
			/>

			<IconComponent ref={iconRef} size={32} />

			<span className="text-textSecondary truncate text-xs">{name}</span>
		</Link>
	);
};

export default RelatedIconCard;
