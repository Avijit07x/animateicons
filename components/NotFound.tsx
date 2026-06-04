"use client";

import { CompassIcon } from "@/icons/lucide/compass-icon";
import { MapPinIcon } from "@/icons/lucide/map-pin-icon";
import { MapPinnedIcon } from "@/icons/lucide/map-pinned-icon";
import { SearchIcon } from "@/icons/lucide/search-icon";
import { EyeIcon } from "@/icons/lucide/eye-icon";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

/** Loosely-typed handle shared by every animated icon (all expose startAnimation). */
type IconHandle = { startAnimation: () => void };

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

// Navigation-themed icons: the page itself becomes a tiny demo of the product.
const CLUSTER = [MapPinIcon, SearchIcon, CompassIcon, MapPinnedIcon, EyeIcon];

/**
 * 404 page. Instead of a generic centered card, this mirrors the homepage Hero:
 * the site's own icons actually move (loop on load and every few seconds), a bold
 * gradient 404 anchors the page, and the CTAs match the rest of the site. Falls
 * back to a still, calm layout under prefers-reduced-motion.
 */
export default function NotFound() {
	const refs = useRef<(IconHandle | null)[]>([]);
	const reduced = useReducedMotion();

	useEffect(() => {
		if (reduced) return;
		const play = () =>
			refs.current.forEach((icon, i) =>
				window.setTimeout(() => icon?.startAnimation(), i * 140),
			);
		play();
		const id = window.setInterval(play, 3500);
		return () => window.clearInterval(id);
	}, [reduced]);

	return (
		<div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-16">
			<div
				aria-hidden="true"
				className="bg-grid pointer-events-none absolute inset-0 z-0"
			/>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 z-0"
				style={{
					backgroundImage:
						"radial-gradient(circle at center, color-mix(in oklab, var(--color-primary) 14%, transparent), transparent 55%)",
				}}
			/>

			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="show"
				className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center gap-7 text-center"
			>
				<motion.div variants={itemVariants}>
					<Link
						href="/"
						aria-label="AnimateIcons home"
						className="inline-flex items-center gap-2 opacity-90 transition-opacity hover:opacity-100"
					>
						<Image src="/logo.svg" alt="" width={28} height={28} priority />
						<span className="text-textPrimary text-base font-semibold">
							AnimateIcons
						</span>
					</Link>
				</motion.div>

				<motion.div
					variants={itemVariants}
					aria-hidden="true"
					className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
				>
					{CLUSTER.map((Icon, i) => (
						<div
							key={i}
							className="border-border/60 bg-bgDark/60 text-primary inline-flex size-12 items-center justify-center rounded-2xl border sm:size-14"
						>
							<Icon
								ref={(el) => {
									refs.current[i] = el;
								}}
								size={26}
								isAnimated={false}
							/>
						</div>
					))}
				</motion.div>

				<motion.span
					variants={itemVariants}
					aria-hidden="true"
					className="from-primary to-textPrimary bg-gradient-to-b bg-clip-text text-7xl leading-none font-bold tracking-tight text-transparent sm:text-8xl"
				>
					404
				</motion.span>

				<motion.div variants={itemVariants} className="space-y-2">
					<h1 className="text-textPrimary text-2xl font-semibold tracking-tight sm:text-3xl">
						This page wandered off the map
					</h1>
					<p className="text-textSecondary mx-auto max-w-md text-sm leading-relaxed">
						The link may be broken, or the page may have moved. Let&apos;s get
						you back on track.
					</p>
				</motion.div>

				<motion.div
					variants={itemVariants}
					className="flex w-full flex-col items-center justify-center gap-2.5 sm:w-auto sm:flex-row"
				>
					<Link
						href="/"
						className="group from-primary to-primary/85 ring-primary-foreground/15 relative inline-flex w-full items-center justify-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-b px-5 py-2.5 text-sm font-semibold text-(--cta-text) shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_10px_28px_-8px_color-mix(in_oklab,var(--color-primary)_55%,transparent)] ring-1 transition-all duration-200 ring-inset hover:shadow-[0_1px_0_rgba(255,255,255,0.22)_inset,0_14px_36px_-8px_color-mix(in_oklab,var(--color-primary)_70%,transparent)] hover:brightness-110 active:scale-[0.98] sm:w-auto"
					>
						<span
							aria-hidden="true"
							className="pointer-events-none absolute inset-x-5 top-px h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
						/>
						Go home
						<ArrowRight
							className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
							aria-hidden="true"
						/>
					</Link>
					<Link
						href="/icons/lucide"
						prefetch={false}
						className="border-border/60 hover:border-primary/40 text-textPrimary inline-flex w-full items-center justify-center gap-1.5 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors sm:w-auto"
					>
						Browse icons
					</Link>
				</motion.div>
			</motion.div>
		</div>
	);
}
