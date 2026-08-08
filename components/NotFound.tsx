"use client";

import SpecimenFrame from "@/components/home/SpecimenFrame";
import { CompassIcon } from "@/icons/lucide/compass-icon";
import type { IconHandle } from "@/types/icon";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";

/**
 * 404 - the "Motion Specimen" treatment from the home page: a single animated
 * icon framed as a specimen, mono labels, plus-grid ground, and the site's
 * pill CTAs. The compass loops on load, so the page itself demos the product.
 */

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

export default function NotFound() {
	const reduced = useReducedMotion();
	const iconRef = useRef<IconHandle | null>(null);

	useEffect(() => {
		if (reduced) return;
		const first = setTimeout(() => iconRef.current?.startAnimation(), 500);
		const loop = setInterval(() => iconRef.current?.startAnimation(), 2600);
		return () => {
			clearTimeout(first);
			clearInterval(loop);
		};
	}, [reduced]);

	return (
		<div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-16">
			<div
				aria-hidden="true"
				className="bg-plus-grid pointer-events-none absolute inset-0"
			/>
			<div
				aria-hidden="true"
				className="bg-primary/5 pointer-events-none absolute top-1/2 left-1/2 h-110 w-110 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
			/>

			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="relative z-10 flex w-full max-w-sm flex-col items-center gap-7 text-center"
			>
				<motion.p
					variants={item}
					className="text-textMuted font-mono text-[11px] tracking-[0.25em] uppercase"
				>
					<span className="text-primary">404</span> / Page not found
				</motion.p>

				<motion.div variants={item} className="w-full">
					<SpecimenFrame
						label="Specimen"
						index="404"
						footLeft="not-found"
						footRight="lost route"
						crosshair
						className="w-full select-none"
					>
						<div className="relative flex aspect-6/5 w-full items-center justify-center overflow-hidden">
							<span
								aria-hidden="true"
								className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[150px] leading-none font-bold text-white/[0.035] select-none"
							>
								404
							</span>
							<div
								aria-hidden="true"
								className="bg-primary/15 absolute size-36 rounded-full blur-3xl"
							/>
							<span className="text-primary relative flex">
								<CompassIcon ref={iconRef} size={124} />
							</span>
						</div>
					</SpecimenFrame>
				</motion.div>

				<motion.h1
					variants={item}
					className="text-textPrimary text-3xl font-semibold tracking-tight sm:text-4xl"
				>
					This page moved<span className="text-primary">.</span>
				</motion.h1>

				<motion.div
					variants={item}
					className="flex flex-wrap items-center justify-center gap-3"
				>
					<Link
						href="/"
						className="group bg-primary hover:bg-primaryHover inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-(--cta-text) transition-colors"
					>
						Go home
						<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
					</Link>
					<Link
						href="/icons/lucide"
						prefetch={false}
						className="group border-border text-textPrimary hover:border-primary/50 hover:bg-surface inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
					>
						Browse icons
					</Link>
				</motion.div>
			</motion.div>
		</div>
	);
}
