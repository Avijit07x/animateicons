"use client";

/**
 * IconLibraryPoster — editorial-style showcase block for one icon library.
 * Replaces the previous card / marquee layouts.
 *
 * Composition:
 *   - Massive library name (oversized typography, faded behind content)
 *   - Stat-first: the icon count is the visual anchor
 *   - Description as a single line of supporting copy
 *   - Compact icon row as proof
 *   - Inline CTA chip
 *
 * No card chrome, no borders, no marquee. The typography carries the
 * hierarchy.
 */

import { MoveRightIcon } from "@/icons/lucide/move-right-icon";
import Link from "next/link";

const IconCard: React.FC<IconLibraryCardData> = ({
	icons,
	description,
	title,
	count,
	href,
}) => {
	// Library name without the trailing " Icons" — feels less repetitive
	// once it's used as oversized display type.
	const displayName = title.replace(/\s*Icons$/i, "");
	const previewIcons = icons.slice(0, 10);

	return (
		<article className="group/poster relative flex flex-col gap-8 py-4">
			{/* Big watermark name behind the content */}
			<div
				aria-hidden="true"
				className="text-textPrimary/[0.04] pointer-events-none absolute inset-x-0 top-0 -z-10 truncate text-[8rem] leading-none font-bold tracking-tight uppercase select-none lg:text-[12rem]"
			>
				{displayName}
			</div>

			{/* Stat block */}
			<div className="flex items-end gap-4">
				<span className="text-textPrimary text-6xl leading-none font-bold tabular-nums lg:text-7xl">
					{count}
				</span>
				<div className="text-textSecondary pb-2 text-sm leading-tight">
					<div className="text-textPrimary text-base font-semibold">
						{displayName}
					</div>
					<div>animated icons</div>
				</div>
			</div>

			{/* Supporting copy */}
			<p className="text-textSecondary max-w-md text-sm leading-relaxed">
				{description}
			</p>

			{/* Icon proof row */}
			<div className="flex flex-wrap items-center gap-x-5 gap-y-3">
				{previewIcons.map((Icon, index) => (
					<div
						key={index}
						className="text-textSecondary hover:text-primary transition-colors"
					>
						<Icon size={24} />
					</div>
				))}
			</div>

			{/* CTA */}
			<Link
				href={href}
				aria-label={`Browse ${title}`}
				className="text-textPrimary hover:text-primary inline-flex w-fit items-center gap-1.5 text-sm font-semibold transition-colors"
			>
				Browse {displayName}
				<MoveRightIcon
					size={18}
					className="transition-transform duration-300 group-hover/poster:translate-x-1"
				/>
			</Link>
		</article>
	);
};

export default IconCard;
