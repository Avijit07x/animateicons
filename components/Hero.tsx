"use client";

import { CheckIcon, type CheckIconHandle } from "@/icons/lucide/check-icon";
import { CopyIcon, type CopyIconHandle } from "@/icons/lucide/copy-icon";
import { ICON_COUNTS } from "@/lib/icon-count.generated";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, Variants } from "motion/react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import HeroSpecimen from "./hero/HeroSpecimen";

const container: Variants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.08, delayChildren: 0.05 },
	},
};

const item: Variants = {
	hidden: { opacity: 0, y: 18 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
	},
};

const INSTALL = "npm i @animateicons/react";

const HeroSection: React.FC = () => {
	const [copied, setCopied] = useState(false);
	const copyRef = useRef<CopyIconHandle | null>(null);
	const checkRef = useRef<CheckIconHandle | null>(null);

	useEffect(() => {
		if (!copied) return;
		const id = requestAnimationFrame(() => checkRef.current?.startAnimation());
		return () => cancelAnimationFrame(id);
	}, [copied]);

	const copy = () => {
		navigator.clipboard?.writeText(INSTALL).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1600);
		});
	};

	return (
		<section className="relative min-h-[calc(100dvh-4rem)] overflow-hidden">
			<div
				aria-hidden="true"
				className="bg-plus-grid pointer-events-none absolute inset-0"
			/>

			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="relative z-10 mx-auto flex min-h-[calc(100dvh-4rem)] max-w-7xl flex-col px-6"
			>
				<div className="grid flex-1 items-center gap-y-12 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-x-10">
					<div className="flex flex-col items-start gap-7">
						<motion.p
							variants={item}
							className="text-textMuted font-mono text-[11px] tracking-[0.25em] uppercase"
						>
							<span className="text-primary">01</span> / Animated icon library
							for React
						</motion.p>

						<motion.h1
							variants={item}
							className="text-[clamp(2.75rem,8vw,6.25rem)] leading-[0.9] font-semibold tracking-tight"
						>
							<span className="text-textPrimary">Make every</span>
							<br />
							<span className="text-textPrimary">icon </span>
							<span className="text-primary">move.</span>
						</motion.h1>

						<motion.p
							variants={item}
							className="text-textSecondary max-w-md text-sm leading-relaxed sm:text-base"
						>
							{ICON_COUNTS.total} open-source SVG icons that animate at the path
							level, driven by hover, focus, or your own code. One motion
							system, two libraries.
						</motion.p>

						<motion.button
							type="button"
							onClick={copy}
							onMouseEnter={() => copyRef.current?.startAnimation()}
							onMouseLeave={() => copyRef.current?.stopAnimation()}
							variants={item}
							aria-label="Copy install command"
							className="group border-border bg-surface/60 hover:border-primary/70 hover:bg-surfaceElevated focus-visible:border-primary/70 focus-visible:ring-primary/40 flex w-full max-w-sm cursor-pointer items-center justify-between gap-3 rounded-md border px-4 py-2.5 text-left transition-all duration-200 hover:shadow-[0_0_24px_-6px_var(--color-primaryGlow)] focus:outline-none focus-visible:ring-2"
						>
							<code className="text-textPrimary font-mono text-sm">
								<span className="text-textMuted select-none">$ </span>
								{INSTALL}
							</code>
							<span className="text-textMuted group-hover:text-primary flex items-center transition-colors">
								{copied ? (
									<CheckIcon
										ref={checkRef}
										size={16}
										color="var(--color-success)"
									/>
								) : (
									<CopyIcon ref={copyRef} size={16} />
								)}
							</span>
						</motion.button>

						<motion.div
							variants={item}
							className="flex flex-wrap items-center gap-3 pt-1"
						>
							<Link
								href="/icons/lucide"
								prefetch={false}
								className="group bg-primary hover:bg-primaryHover inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-(--cta-text) transition-colors"
							>
								Browse {ICON_COUNTS.total} icons
								<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
							</Link>
							<Link
								href="/icons/docs"
								className="group border-border text-textPrimary hover:border-primary/50 hover:bg-surface inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
							>
								Documentation
								<ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</Link>
						</motion.div>
					</div>

					<motion.div variants={item} className="w-full">
						<HeroSpecimen />
					</motion.div>
				</div>
			</motion.div>
		</section>
	);
};

export default HeroSection;
