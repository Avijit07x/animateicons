"use client";

import { ArrowRight } from "lucide-react";
import { motion, Variants } from "motion/react";
import Link from "next/link";
import React from "react";
import CmdSection from "./CmdSection";
import { GitHub } from "./icons/Github";

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.12,
			delayChildren: 0.1,
		},
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: "easeOut",
		},
	},
};

const HeroSection: React.FC = () => {
	return (
		<div className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden">
			<div className="bg-grid pointer-events-none absolute inset-0 z-0" />

			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="show"
				className="relative z-10 mx-auto flex min-h-[calc(100dvh-14rem)] w-full max-w-3xl flex-col items-center justify-center gap-8 px-4 text-center"
			>
				<Link
					href={"https://github.com/Avijit07x/animateicons"}
					target="_blank"
					aria-label="View AnimateIcons GitHub repository"
					rel="noopener noreferrer"
				>
					<motion.div
						variants={itemVariants}
						className="border-border bg-surface text-textPrimary hover:bg-surfaceHover -mb-2 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs"
					>
						<GitHub className="size-4.5" />
						<span className="font-medium">Open Source</span>
						<span className="border-border text-textSecondary rounded-full border px-2 py-0.5 text-[10px]">
							MIT
						</span>
					</motion.div>
				</Link>

				<motion.h1
					variants={itemVariants}
					className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
				>
					<span className="text-primary">Make Every Icon Move</span>
					<br />
					<span className="text-textPrimary font-medium">
						with AnimateIcons
					</span>
				</motion.h1>

				<motion.div
					variants={itemVariants}
					className="max-w-xl space-y-2 text-sm leading-relaxed text-zinc-300"
				>
					<p>
						Free and open-source animated SVG icons for React with smooth
						micro-interactions and lightweight performance, built with{" "}
						<Link
							href={"https://motion.dev/"}
							className="underline"
							target="_blank"
						>
							Motion
						</Link>
					</p>
				</motion.div>

				<motion.div
					variants={itemVariants}
					className="flex w-full items-center justify-center"
				>
					<CmdSection />
				</motion.div>

				<motion.div variants={itemVariants}>
					<Link
						href="/icons/lucide"
						aria-label="Browse Lucide animated icons"
						className="group from-primary to-primary/85 ring-primary-foreground/15 relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-b px-6 py-2.5 text-sm font-semibold text-(--cta-text) shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_10px_28px_-8px_color-mix(in_oklab,var(--color-primary)_55%,transparent)] ring-1 transition-all duration-200 ring-inset hover:shadow-[0_1px_0_rgba(255,255,255,0.22)_inset,0_14px_36px_-8px_color-mix(in_oklab,var(--color-primary)_70%,transparent)] hover:brightness-110 active:scale-[0.98]"
					>
						{/* Subtle top-edge highlight, like a glass bevel */}
						<span
							aria-hidden="true"
							className="pointer-events-none absolute inset-x-6 top-px h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
						/>
						<span>Browse icons</span>
						<ArrowRight
							className="size-4.5 transition-transform duration-300 group-hover:translate-x-0.5"
							aria-hidden="true"
						/>
					</Link>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default HeroSection;
