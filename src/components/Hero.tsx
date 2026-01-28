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
		<div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden">
			<div
				className="pointer-events-none absolute inset-0 z-0"
				style={{
					backgroundImage: `
						repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(75, 85, 99, 0.08) 20px, rgba(75, 85, 99, 0.08) 21px),
						repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(107, 114, 128, 0.06) 30px, rgba(107, 114, 128, 0.06) 31px),
						repeating-linear-gradient(60deg, transparent, transparent 40px, rgba(55, 65, 81, 0.05) 40px, rgba(55, 65, 81, 0.05) 41px),
						repeating-linear-gradient(150deg, transparent, transparent 35px, rgba(31, 41, 55, 0.04) 35px, rgba(31, 41, 55, 0.04) 36px)`,
				}}
			/>

			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{
					duration: 1,
					delay: 0.2,
					repeat: Infinity,
					repeatType: "reverse",
				}}
				className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-primary)]/5 blur-3xl"
			/>

			<div className="relative z-10 mx-auto w-full max-w-3xl px-4 text-center">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="show"
					className="flex flex-col items-center gap-8"
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
						</motion.div>
					</Link>

					<motion.h1
						variants={itemVariants}
						className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
					>
						<span className="text-[var(--color-primary)]">
							Make Every Icon Move
						</span>
						<br />
						<span className="font-medium text-[var(--color-textPrimary)]">
							with AnimateIcons
						</span>
					</motion.h1>

					<motion.div
						variants={itemVariants}
						className="max-w-xl space-y-2 text-sm leading-relaxed text-zinc-300"
					>
						<p>
							Free and open-source animated SVG icons for React with smooth
							micro-interactions and lightweight performance.
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
							className="border-border text-textPrimary bg-primaryHover hover:bg-primaryHover/90 flex items-center justify-center gap-1.5 rounded-full border px-6 py-2.5 text-sm font-semibold transition-all duration-300"
						>
							<span>Browse icons</span>
							<ArrowRight className="size-4.5" />
						</Link>
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
};

export default HeroSection;
