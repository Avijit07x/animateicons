"use client";

import { ArrowRight02Icon } from "@/icons/huge/arrow-right-0-2-icon";
import { ArrowUpRight01Icon } from "@/icons/huge/arrow-up-right-0-1-icon";
import { CheckIcon, type CheckIconHandle } from "@/icons/huge/check-icon";
import { CopyIcon, type CopyIconHandle } from "@/icons/huge/copy-icon";
import { useCopy } from "@/hooks/useCopy";
import { ICON_COUNTS } from "@/lib/icon-count.generated";
import { motion, Variants } from "motion/react";
import React, { useEffect, useRef } from "react";
import FloatingIcons from "./FloatingIcons";
import IconLink from "./IconLink";
import { SHOWCASE } from "./home/showcase-icons";

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
	const { copied, copy } = useCopy();
	const copyRef = useRef<CopyIconHandle | null>(null);
	const checkRef = useRef<CheckIconHandle | null>(null);

	useEffect(() => {
		if (!copied) return;
		const id = requestAnimationFrame(() => checkRef.current?.startAnimation());
		return () => cancelAnimationFrame(id);
	}, [copied]);

	return (
		<section className="relative flex min-h-[calc(100dvh-4rem)] flex-col overflow-hidden pb-12 lg:pb-16">
			<div
				aria-hidden="true"
				className="bg-plus-grid pointer-events-none absolute inset-0"
			/>

			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-6 pt-12 text-center lg:pt-16"
			>
				<motion.h1
					variants={item}
					className="text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl lg:text-6xl"
				>
					<span className="text-textPrimary">
						Make Every <br className="hidden max-sm:block" />
						Icon{" "}
					</span>
					<span className="text-primary">Move</span>
					<br />
					<span className="text-textPrimary font-medium">
						with AnimateIcons
					</span>
				</motion.h1>

				<motion.p
					variants={item}
					className="text-textSecondary max-w-2xl text-sm leading-relaxed text-balance sm:text-base"
				>
					{ICON_COUNTS.total} open-source animated SVG icons for React, in
					Lucide and Huge styles. Drop-in components that animate on hover,
					focus, or your own code.
				</motion.p>

				<motion.button
					type="button"
					onClick={() => copy(INSTALL)}
					onMouseEnter={() => copyRef.current?.startAnimation()}
					onMouseLeave={() => copyRef.current?.stopAnimation()}
					variants={item}
					aria-label="Copy install command"
					className="group bg-surfaceElevated focus-visible:ring-primary/40 hover:bg-surfaceActive flex max-w-full cursor-pointer items-center gap-4 rounded-full py-2.5 pr-4 pl-5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 active:scale-[0.98]"
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
					className="flex flex-wrap items-center justify-center gap-3"
				>
					<IconLink
						href="/icons/lucide"
						prefetch={false}
						icon={ArrowRight02Icon}
						variant="default"
						size="pill"
					>
						Browse {ICON_COUNTS.total} icons
					</IconLink>
					<IconLink
						href="/icons/docs"
						icon={ArrowUpRight01Icon}
						variant="secondary"
						size="pill"
					>
						Documentation
					</IconLink>
				</motion.div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5, duration: 0.8 }}
				className="relative z-10 mt-11 min-h-[300px] flex-1"
			>
				<FloatingIcons
					items={SHOWCASE}
					cols={10}
					rows={3}
					thinOnPhone
					className="[mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
				/>
			</motion.div>
		</section>
	);
};

export default HeroSection;
