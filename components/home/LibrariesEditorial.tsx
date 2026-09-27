"use client";

import { ActivityIcon } from "@/icons/huge/activity-icon";
import { Dashboard01Icon } from "@/icons/huge/dashboard-0-1-icon";
import { GithubIcon } from "@/icons/huge/github-icon";
import { Loading01Icon } from "@/icons/huge/loading-0-1-icon";
import { MousePointerClick01Icon } from "@/icons/huge/mouse-pointer-click-0-1-icon";
import { NotificationIcon } from "@/icons/huge/notification-icon";
import { Settings01Icon } from "@/icons/huge/settings-0-1-icon";
import { BellRingIcon } from "@/icons/lucide/bell-ring-icon";
import { DownloadIcon } from "@/icons/lucide/download-icon";
import { EyeIcon } from "@/icons/lucide/eye-icon";
import { HeartIcon } from "@/icons/lucide/heart-icon";
import { SearchIcon } from "@/icons/lucide/search-icon";
import { SparklesIcon } from "@/icons/lucide/sparkles-icon";
import { StarIcon } from "@/icons/lucide/star-icon";
import { ICON_COUNTS } from "@/lib/icon-count.generated";
import type { IconHandle } from "@/types/icon";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import SpecimenFrame from "./SpecimenFrame";

/**
 * LibrariesEditorial - the two icon libraries side by side, each a specimen
 * plate in the same hairline language as the wall: a label strip, a lattice
 * row of live icons, the pitch and a browse link, and a footer strip. The
 * row rests in grey and a wave tints each icon as it replays on scroll-in.
 */

type PIcon = React.ComponentType<{
	size?: number;
	ref?: React.Ref<IconHandle>;
}>;

const LUCIDE = [
	BellRingIcon,
	HeartIcon,
	SparklesIcon,
	EyeIcon,
	SearchIcon,
	DownloadIcon,
	StarIcon,
] as unknown as PIcon[];

const HUGE = [
	NotificationIcon,
	Dashboard01Icon,
	MousePointerClick01Icon,
	Loading01Icon,
	Settings01Icon,
	ActivityIcon,
	GithubIcon,
] as unknown as PIcon[];

const WAVE_STEP_MS = 90;
const TINT_MS = 450;
const WAVE_EVERY_MS = 4200;

const PreviewStrip: React.FC<{ icons: PIcon[] }> = ({ icons }) => {
	const reduced = useReducedMotion();
	const wrapRef = useRef<HTMLDivElement | null>(null);
	const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
	const refs = useRef<(IconHandle | null)[]>([]);

	useEffect(() => {
		if (reduced) return;
		const el = wrapRef.current;
		if (!el) return;
		let timers: ReturnType<typeof setTimeout>[] = [];
		let loop: ReturnType<typeof setInterval> | undefined;
		const wave = () => {
			timers.forEach(clearTimeout);
			timers = icons.flatMap((_, i) => [
				setTimeout(() => {
					cellRefs.current[i]?.setAttribute("data-active", "");
					refs.current[i]?.startAnimation();
				}, i * WAVE_STEP_MS),
				setTimeout(
					() => cellRefs.current[i]?.removeAttribute("data-active"),
					i * WAVE_STEP_MS + TINT_MS,
				),
			]);
		};
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					wave();
					loop = setInterval(wave, WAVE_EVERY_MS);
				} else if (loop) {
					clearInterval(loop);
					loop = undefined;
				}
			},
			{ threshold: 0.3 },
		);
		io.observe(el);
		return () => {
			io.disconnect();
			if (loop) clearInterval(loop);
			timers.forEach(clearTimeout);
		};
	}, [reduced, icons]);

	return (
		<div ref={wrapRef} className="bg-border/50 grid grid-cols-7 gap-px">
			{icons.map((Icon, i) => (
				<div
					key={i}
					ref={(el) => {
						cellRefs.current[i] = el;
					}}
					onMouseEnter={() => refs.current[i]?.startAnimation()}
					onMouseLeave={() => refs.current[i]?.stopAnimation()}
					className="bg-bgDark text-textSecondary hover:text-primary data-active:text-primary flex aspect-square items-center justify-center transition-colors duration-500"
				>
					<Icon
						ref={(el: IconHandle | null) => {
							refs.current[i] = el;
						}}
						size={26}
					/>
				</div>
			))}
		</div>
	);
};

const LIBS = [
	{
		id: "lucide",
		title: "Lucide",
		count: ICON_COUNTS.lucide,
		body: "Minimal, precise icons for modern product interfaces.",
		icons: LUCIDE,
	},
	{
		id: "huge",
		title: "Huge",
		count: ICON_COUNTS.huge,
		body: "Bold, expressive icons for dashboards and rich interfaces.",
		icons: HUGE,
	},
];

const LibrariesEditorial: React.FC = () => {
	return (
		<section aria-label="Icon libraries" className="border-border/60 border-t">
			<div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
				<p className="text-textMuted font-mono text-[11px] tracking-[0.25em] uppercase">
					<span className="text-primary">04</span> / Two systems
				</p>
				<h2 className="text-textPrimary mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
					Two libraries. One motion system
					<span className="text-primary">.</span>
				</h2>

				<div className="mt-14 grid gap-6 lg:grid-cols-2">
					{LIBS.map((lib) => (
						<SpecimenFrame key={lib.id}>
							<div className="border-border/60 text-textMuted flex items-center justify-between border-b px-4 py-3 font-mono text-[10px] tracking-widest">
								<span className="uppercase">{lib.title}</span>
								<span className="tabular-nums">{lib.count} icons</span>
							</div>

							<PreviewStrip icons={lib.icons} />

							<div className="border-border/60 border-t px-4 py-6">
								<p className="text-textSecondary max-w-sm text-sm leading-relaxed">
									{lib.body}
								</p>
								<Link
									href={`/icons/${lib.id}`}
									prefetch={false}
									className="group text-primary hover:text-primaryHover mt-4 inline-flex items-center gap-1.5 text-sm font-semibold"
								>
									Browse {lib.title}
									<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
								</Link>
							</div>

							<div className="border-border/60 flex items-center justify-between border-t px-4 py-3 font-mono text-[10px] tracking-widest">
								<span className="text-primary">{lib.id}</span>
								<span className="text-textMuted uppercase">
									one motion system
								</span>
							</div>
						</SpecimenFrame>
					))}
				</div>
			</div>
		</section>
	);
};

export default LibrariesEditorial;
