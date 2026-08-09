"use client";

import { AlarmClockIcon } from "@/icons/lucide/alarm-clock-icon";
import { BellRingIcon } from "@/icons/lucide/bell-ring-icon";
import { CloudRainIcon } from "@/icons/lucide/cloud-rain-icon";
import { CompassIcon } from "@/icons/lucide/compass-icon";
import { DownloadIcon } from "@/icons/lucide/download-icon";
import { HeartIcon } from "@/icons/lucide/heart-icon";
import { MapIcon } from "@/icons/lucide/map-icon";
import { RainbowIcon } from "@/icons/lucide/rainbow-icon";
import { RocketIcon } from "@/icons/lucide/rocket-icon";
import { SearchIcon } from "@/icons/lucide/search-icon";
import { SparklesIcon } from "@/icons/lucide/sparkles-icon";
import { StarIcon } from "@/icons/lucide/star-icon";
import { SunMediumIcon } from "@/icons/lucide/sun-medium-icon";
import { ZapIcon } from "@/icons/lucide/zap-icon";
import { ICON_COUNTS } from "@/lib/icon-count.generated";
import type { IconHandle } from "@/types/icon";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import SpecimenFrame from "./SpecimenFrame";

/**
 * KineticWall - a full-bleed band of specimen chips that slides on a loop.
 * The icons sit at a uniform size at rest (each in a fixed 40px slot, so
 * animation never shifts the chip); hovering a chip pauses the marquee and
 * replays that one icon. The scroll itself is the ambient "motion".
 */

type WallIcon = React.ComponentType<{
	size?: number;
	ref?: React.Ref<IconHandle>;
}>;

const ICONS = [
	{ Icon: BellRingIcon, name: "bell-ring" },
	{ Icon: HeartIcon, name: "heart" },
	{ Icon: RocketIcon, name: "rocket" },
	{ Icon: CompassIcon, name: "compass" },
	{ Icon: SparklesIcon, name: "sparkles" },
	{ Icon: SunMediumIcon, name: "sun-medium" },
	{ Icon: CloudRainIcon, name: "cloud-rain" },
	{ Icon: MapIcon, name: "map" },
	{ Icon: DownloadIcon, name: "download" },
	{ Icon: SearchIcon, name: "search" },
	{ Icon: StarIcon, name: "star" },
	{ Icon: AlarmClockIcon, name: "alarm-clock" },
	{ Icon: RainbowIcon, name: "rainbow" },
	{ Icon: ZapIcon, name: "zap" },
] as unknown as { Icon: WallIcon; name: string }[];

const TRACK = [...ICONS, ...ICONS];

const KineticWall: React.FC = () => {
	const refs = useRef<(IconHandle | null)[]>([]);
	const wrapRef = useRef<HTMLDivElement | null>(null);
	const reduced = useReducedMotion();

	// Auto-play a rolling wave while the band is in view. Hover still replays a
	// single icon on desktop; this is what gives touch devices (no hover) motion.
	useEffect(() => {
		if (reduced) return;
		const el = wrapRef.current;
		if (!el) return;
		let timers: ReturnType<typeof setTimeout>[] = [];
		let loop: ReturnType<typeof setInterval> | undefined;
		const wave = () => {
			timers.forEach(clearTimeout);
			timers = TRACK.map((_, i) =>
				setTimeout(() => refs.current[i]?.startAnimation(), i * 100),
			);
		};
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					wave();
					loop = setInterval(wave, 5200);
				} else if (loop) {
					clearInterval(loop);
					loop = undefined;
				}
			},
			{ threshold: 0.2 },
		);
		io.observe(el);
		return () => {
			io.disconnect();
			if (loop) clearInterval(loop);
			timers.forEach(clearTimeout);
		};
	}, [reduced]);

	return (
		<section aria-label="Icons in motion" className="border-border/60 border-t">
			<div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
				<p className="text-textMuted font-mono text-[11px] tracking-[0.25em] uppercase">
					<span className="text-primary">02</span> / The set
				</p>
				<h2 className="text-textPrimary mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
					{ICON_COUNTS.total} icons.{" "}
					<span className="text-textMuted">
						All animated at the path level
						<span className="text-primary">.</span>
					</span>
				</h2>

				<SpecimenFrame
					label="The set"
					index={`${ICON_COUNTS.total} specimens`}
					footLeft="lucide + huge"
					footRight="in motion"
					crosshair
					className="mt-12"
				>
					<div ref={wrapRef} className="relative overflow-hidden py-14">
						<div className="from-bgDark via-bgDark pointer-events-none absolute top-14 bottom-14 left-0 z-10 w-12 bg-gradient-to-r to-transparent sm:w-40" />
						<div className="from-bgDark via-bgDark pointer-events-none absolute top-14 right-0 bottom-14 z-10 w-12 bg-gradient-to-l to-transparent sm:w-40" />

						<div
							className="animate-marquee flex w-max gap-4 px-4 hover:[animation-play-state:paused]"
							style={{ animationDuration: "48s" }}
						>
							{TRACK.map((cell, i) => (
								<div
									key={`${cell.name}-${i}`}
									onMouseEnter={() => refs.current[i]?.startAnimation()}
									onMouseLeave={() => refs.current[i]?.stopAnimation()}
									className="border-border bg-surface/40 text-primary flex w-32 cursor-default flex-col items-center gap-4 rounded-2xl border px-4 py-7 sm:w-40"
								>
									<div className="flex size-10 items-center justify-center">
										<cell.Icon
											ref={(el: IconHandle | null) => {
												refs.current[i] = el;
											}}
											size={40}
										/>
									</div>
									<span className="text-textMuted font-mono text-[10px] tracking-widest whitespace-nowrap">
										{cell.name}
									</span>
								</div>
							))}
						</div>
					</div>
				</SpecimenFrame>
			</div>
		</section>
	);
};

export default KineticWall;
