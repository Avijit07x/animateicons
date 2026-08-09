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
 * LibrariesEditorial - the two icon libraries as editorial rows with live
 * preview strips that replay on scroll-in, instead of a tabbed card widget.
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

const PreviewStrip: React.FC<{ icons: PIcon[] }> = ({ icons }) => {
	const reduced = useReducedMotion();
	const wrapRef = useRef<HTMLDivElement | null>(null);
	const refs = useRef<(IconHandle | null)[]>([]);

	useEffect(() => {
		if (reduced) return;
		const el = wrapRef.current;
		if (!el) return;
		let timers: ReturnType<typeof setTimeout>[] = [];
		let loop: ReturnType<typeof setInterval> | undefined;
		const wave = () => {
			timers.forEach(clearTimeout);
			timers = icons.map((_, i) =>
				setTimeout(() => refs.current[i]?.startAnimation(), i * 90),
			);
		};
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					wave();
					loop = setInterval(wave, 4200);
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
		<div ref={wrapRef} className="flex flex-wrap gap-3">
			{icons.map((Icon, i) => (
				<div
					key={i}
					onMouseEnter={() => refs.current[i]?.startAnimation()}
					onMouseLeave={() => refs.current[i]?.stopAnimation()}
					className="border-border/70 bg-surface/40 text-textPrimary hover:border-primary/50 hover:text-primary flex size-14 cursor-pointer items-center justify-center rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
				>
					<Icon
						ref={(el: IconHandle | null) => {
							refs.current[i] = el;
						}}
						size={28}
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
						<SpecimenFrame
							key={lib.id}
							label={lib.title}
							index={`${lib.count} icons`}
							footLeft={lib.id}
							footRight="one motion system"
							crosshair
						>
							<div className="px-7 pt-12 pb-14">
								<PreviewStrip icons={lib.icons} />
								<p className="text-textSecondary mt-7 max-w-sm text-sm leading-relaxed">
									{lib.body}
								</p>
								<Link
									href={`/icons/${lib.id}`}
									prefetch={false}
									className="group text-primary hover:text-primaryHover mt-5 inline-flex items-center gap-1.5 text-sm font-semibold"
								>
									Browse {lib.title}
									<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
								</Link>
							</div>
						</SpecimenFrame>
					))}
				</div>
			</div>
		</section>
	);
};

export default LibrariesEditorial;
