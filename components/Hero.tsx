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
						className="flex items-center justify-center gap-1.5 rounded-full bg-(--cta-bg) px-6 py-2.5 text-sm font-semibold text-(--cta-text) transition-colors duration-200 hover:bg-(--cta-bg-hover)"
					>
						<span>Browse icons</span>
						<ArrowRight className="size-4.5" aria-hidden="true" />
					</Link>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default HeroSection;
