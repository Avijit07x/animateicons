"use client";

/**
 * IconLibrariesSection — premium tabbed showcase.
 *
 * Visual treatment:
 *   - Radial spotlight behind the grid suggests depth without a literal frame.
 *   - Tiles use a glass-style treatment: subtle semi-transparent border,
 *     low-opacity gradient fill, soft inner highlight on the top edge.
 *   - Hover state introduces a primary-tinted ring + faint glow rather than
 *     a flat color swap.
 *   - Tab pill uses a gradient fill + ring for the active state.
 */

import { MoveRightIcon } from "@/icons/lucide/move-right-icon";
import Section from "@/components/section/Section";
import SectionHeader from "@/components/section/SectionHeader";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, type Variants } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { iconLibraries } from "./data";

const gridVariants: Variants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			duration: 0.25,
			ease: "easeOut",
			staggerChildren: 0.012,
		},
	},
	exit: { opacity: 0, transition: { duration: 0.15 } },
};

const iconVariants: Variants = {
	hidden: { opacity: 0, y: 6, scale: 0.94 },
	show: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { duration: 0.25, ease: "easeOut" },
	},
};

const IconLibrariesSection: React.FC = () => {
	const [activeId, setActiveId] = useState(iconLibraries[0]?.id ?? "lucide");
	const active =
		iconLibraries.find((l) => l.id === activeId) ?? iconLibraries[0];

	if (!active) return null;

	return (
		<Section className="relative overflow-hidden">
			{/* Premium backdrop: faint grid pattern only — no colored wash */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10"
			>
				<div
					className="absolute inset-0 opacity-[0.05]"
					style={{
						backgroundImage:
							"linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
						backgroundSize: "32px 32px",
						maskImage:
							"radial-gradient(50% 60% at 50% 50%, black, transparent 80%)",
						WebkitMaskImage:
							"radial-gradient(50% 60% at 50% 50%, black, transparent 80%)",
					}}
				/>
			</div>

			<SectionHeader
				title="Two libraries, one motion system"
				subtitle="Pick the visual style that fits — both ship the same animations and props."
				spacing="tight"
			/>

			{/* Tab pill */}
			<div className="mb-5 flex justify-center">
				<div
					role="tablist"
					aria-label="Icon library"
					className="border-border/80 from-surface to-surfaceElevated inline-flex items-center rounded-full border bg-gradient-to-b p-1 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_8px_24px_-12px_rgba(0,0,0,0.6)] backdrop-blur"
				>
					{iconLibraries.map((lib) => {
						const isActive = lib.id === activeId;
						return (
							<button
								key={lib.id}
								role="tab"
								type="button"
								aria-selected={isActive}
								onClick={() => setActiveId(lib.id ?? "lucide")}
								className={cn(
									"relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors",
									isActive
										? "text-primary"
										: "text-textSecondary hover:text-textPrimary",
								)}
							>
								{isActive && (
									<motion.span
										layoutId="library-tab-pill"
										className="ring-primary/30 absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-white/[0.06] to-transparent ring-1 ring-inset"
										transition={{
											type: "spring",
											stiffness: 380,
											damping: 32,
										}}
									/>
								)}
								<span>{lib.title.replace(" Icons", "")}</span>
								<span
									className={cn(
										"text-[11px] tabular-nums",
										isActive ? "text-primary/70" : "text-textMuted",
									)}
								>
									{lib.count}
								</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* Description */}
			<p className="text-textSecondary mx-auto mb-12 max-w-xl text-center text-sm leading-relaxed">
				{active.description}
			</p>

			{/* Icon grid — glass tiles, no outer frame */}
			<div className="mx-auto max-w-3xl">
				<AnimatePresence mode="wait">
					<motion.div
						key={active.id}
						variants={gridVariants}
						initial="hidden"
						animate="show"
						exit="exit"
						className="grid grid-cols-6 gap-2.5 sm:grid-cols-8 sm:gap-3 lg:grid-cols-10"
					>
						{active.icons.slice(0, 30).map((Icon, index) => (
							<motion.div
								key={`${active.id}-${index}`}
								variants={iconVariants}
								className={cn(
									"group/tile relative flex aspect-square items-center justify-center rounded-2xl",
									"border-border/60 hover:border-primary/40 border",
									"bg-gradient-to-b from-white/[0.03] to-white/[0.01]",
									"text-textSecondary hover:text-primary",
									"transition-all duration-200",
									"hover:shadow-[0_8px_24px_-12px_color-mix(in_oklab,var(--color-primary)_40%,transparent)]",
								)}
							>
								{/* Subtle inner top highlight, like a glass edge */}
								<span
									aria-hidden="true"
									className="pointer-events-none absolute inset-x-2 top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
								/>
								<Icon size={22} />
							</motion.div>
						))}
					</motion.div>
				</AnimatePresence>
			</div>

			{/* CTA */}
			<div className="mt-12 flex justify-center">
				<Link
					href={active.href}
					className={cn(
						"group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold",
						"border-border/60 hover:border-primary/40 border",
						"from-surface to-surfaceElevated bg-gradient-to-b",
						"text-textPrimary hover:text-primary",
						"shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_8px_24px_-12px_rgba(0,0,0,0.5)]",
						"transition-all duration-200",
					)}
					aria-label={`Browse all ${active.count} ${active.title}`}
				>
					Browse all {active.count} {active.title.replace(" Icons", "")} icons
					<MoveRightIcon
						size={16}
						className="transition-transform duration-300 group-hover:translate-x-1"
					/>
				</Link>
			</div>
		</Section>
	);
};

export default IconLibrariesSection;
