"use client";

import { ICON_COUNTS } from "@/lib/icon-count.generated";
import { cn } from "@/lib/utils";
import type { IconHandle } from "@/types/icon";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import Link from "next/link";
import {
	lazy,
	Suspense,
	useEffect,
	useRef,
	useState,
	type ComponentType,
	type Ref,
} from "react";
import SpecimenFrame from "./SpecimenFrame";

/**
 * KineticWall - a dense lattice of the set, in the gallery's hairline grid.
 * Icons rest in grey; a diagonal wave sweeps the wall on a loop, tinting
 * each icon and replaying its animation as it passes. Hovering a cell plays
 * that icon and shows its name. The last cell links to the full gallery.
 *
 * Each icon is its own lazy chunk, fetched only once the wall nears the
 * viewport, so the homepage's initial bundle doesn't grow with the grid.
 */

type WallIcon = ComponentType<{ size?: number; ref?: Ref<IconHandle> }>;

const toExportName = (name: string) =>
	name
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("") + "Icon";

const cell = (name: string, load: () => Promise<Record<string, unknown>>) => ({
	name,
	Icon: lazy(() =>
		load().then((m) => ({ default: m[toExportName(name)] as WallIcon })),
	),
});

// The first 23 show on phones (6 × 4), 31 on tablets (8 × 4) and all 47 on
// desktop (12 × 4); the "view all" cell always closes the last row.
const CELLS = [
	cell("bell-ring", () => import("@/icons/lucide/bell-ring-icon")),
	cell("rocket", () => import("@/icons/lucide/rocket-icon")),
	cell("heart", () => import("@/icons/lucide/heart-icon")),
	cell("bot", () => import("@/icons/lucide/bot-icon")),
	cell("sparkles", () => import("@/icons/lucide/sparkles-icon")),
	cell("party-popper", () => import("@/icons/lucide/party-popper-icon")),
	cell("compass", () => import("@/icons/lucide/compass-icon")),
	cell("trophy", () => import("@/icons/lucide/trophy-icon")),
	cell("cloud-rain", () => import("@/icons/lucide/cloud-rain-icon")),
	cell("plane", () => import("@/icons/lucide/plane-icon")),
	cell("zap", () => import("@/icons/lucide/zap-icon")),
	cell("ghost", () => import("@/icons/lucide/ghost-icon")),
	cell("puzzle", () => import("@/icons/lucide/puzzle-icon")),
	cell("alarm-clock", () => import("@/icons/lucide/alarm-clock-icon")),
	cell("gem", () => import("@/icons/lucide/gem-icon")),
	cell("wand-sparkles", () => import("@/icons/lucide/wand-sparkles-icon")),
	cell("leaf", () => import("@/icons/lucide/leaf-icon")),
	cell("radar", () => import("@/icons/lucide/radar-icon")),
	cell("search", () => import("@/icons/lucide/search-icon")),
	cell("dice-5", () => import("@/icons/lucide/dice-5-icon")),
	cell("crown", () => import("@/icons/lucide/crown-icon")),
	cell("rainbow", () => import("@/icons/lucide/rainbow-icon")),
	cell("bug", () => import("@/icons/lucide/bug-icon")),
	cell("sun-medium", () => import("@/icons/lucide/sun-medium-icon")),
	cell("anchor", () => import("@/icons/lucide/anchor-icon")),
	cell("magnet", () => import("@/icons/lucide/magnet-icon")),
	cell("target", () => import("@/icons/lucide/target-icon")),
	cell("download", () => import("@/icons/lucide/download-icon")),
	cell("palette", () => import("@/icons/lucide/palette-icon")),
	cell("hammer", () => import("@/icons/lucide/hammer-icon")),
	cell("orbit", () => import("@/icons/lucide/orbit-icon")),
	cell("map", () => import("@/icons/lucide/map-icon")),
	cell("star", () => import("@/icons/lucide/star-icon")),
	cell("heart-pulse", () => import("@/icons/lucide/heart-pulse-icon")),
	cell("flask-conical", () => import("@/icons/lucide/flask-conical-icon")),
	cell("graduation-cap", () => import("@/icons/lucide/graduation-cap-icon")),
	cell("database", () => import("@/icons/lucide/database-icon")),
	cell("power", () => import("@/icons/lucide/power-icon")),
	cell("wrench", () => import("@/icons/lucide/wrench-icon")),
	cell("badge-check", () => import("@/icons/lucide/badge-check-icon")),
	cell("rotate-cw", () => import("@/icons/lucide/rotate-cw-icon")),
	cell("infinity", () => import("@/icons/lucide/infinity-icon")),
	cell("scissors", () => import("@/icons/lucide/scissors-icon")),
	cell("sprout", () => import("@/icons/lucide/sprout-icon")),
	cell("square-pen", () => import("@/icons/lucide/square-pen-icon")),
	cell("lock-open", () => import("@/icons/lucide/lock-open-icon")),
	cell("toggle-right", () => import("@/icons/lucide/toggle-right-icon")),
];

const ROWS = 4;
const PHONE_CELLS = 23;
const TABLET_CELLS = 31;
const WAVE_STEP_MS = 90;
const TINT_MS = 450;
const WAVE_EVERY_MS = 6000;

const visibility = (i: number) =>
	i < PHONE_CELLS
		? "flex"
		: i < TABLET_CELLS
			? "hidden sm:flex"
			: "hidden lg:flex";

const KineticWall: React.FC = () => {
	const gridRef = useRef<HTMLDivElement | null>(null);
	const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
	const iconRefs = useRef<(IconHandle | null)[]>([]);
	const [near, setNear] = useState(false);
	const reduced = useReducedMotion();

	// Start fetching the icon chunks shortly before the wall scrolls in.
	useEffect(() => {
		const el = gridRef.current;
		if (!el || near) return;
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setNear(true);
					io.disconnect();
				}
			},
			{ rootMargin: "600px 0px" },
		);
		io.observe(el);
		return () => io.disconnect();
	}, [near]);

	// Loop a diagonal wave while the wall is on screen. Hover still plays a
	// single cell on desktop; the wave is what gives touch devices motion.
	useEffect(() => {
		if (reduced) return;
		const grid = gridRef.current;
		if (!grid) return;
		let timers: ReturnType<typeof setTimeout>[] = [];
		let loop: ReturnType<typeof setInterval> | undefined;

		const wave = () => {
			timers.forEach(clearTimeout);
			timers = [];
			const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
			const count = Math.min(cols * ROWS - 1, CELLS.length);
			for (let i = 0; i < count; i++) {
				const delay = (Math.floor(i / cols) + (i % cols)) * WAVE_STEP_MS;
				timers.push(
					setTimeout(() => {
						cellRefs.current[i]?.setAttribute("data-active", "");
						iconRefs.current[i]?.startAnimation();
					}, delay),
					setTimeout(
						() => cellRefs.current[i]?.removeAttribute("data-active"),
						delay + TINT_MS,
					),
				);
			}
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
			{ threshold: 0.2 },
		);
		io.observe(grid);
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

				<SpecimenFrame className="mt-12">
					<div className="border-border/60 text-textMuted flex items-center justify-between border-b px-4 py-3 font-mono text-[10px] tracking-widest">
						<span className="uppercase">The set</span>
						<span className="tabular-nums">{ICON_COUNTS.total} specimens</span>
					</div>

					<div
						ref={gridRef}
						className="bg-border/50 grid grid-cols-6 gap-px sm:grid-cols-8 lg:grid-cols-12"
					>
						{CELLS.map(({ name, Icon }, i) => (
							<div
								key={name}
								ref={(el) => {
									cellRefs.current[i] = el;
								}}
								onMouseEnter={() => iconRefs.current[i]?.startAnimation()}
								onMouseLeave={() => iconRefs.current[i]?.stopAnimation()}
								className={cn(
									"group bg-bgDark text-textSecondary hover:text-primary data-active:text-primary relative aspect-square items-center justify-center transition-colors duration-500 sm:aspect-5/4",
									visibility(i),
								)}
							>
								<div className="flex size-7 items-center justify-center">
									{near && (
										<Suspense fallback={null}>
											<Icon
												ref={(el: IconHandle | null) => {
													iconRefs.current[i] = el;
												}}
												size={26}
											/>
										</Suspense>
									)}
								</div>
								<span className="text-textMuted pointer-events-none absolute inset-x-1 bottom-2 hidden truncate text-center font-mono text-[9px] tracking-wider opacity-0 transition-opacity group-hover:opacity-100 sm:block">
									{name}
								</span>
							</div>
						))}

						<Link
							href="/icons/lucide"
							prefetch={false}
							className="group bg-bgDark text-textMuted hover:text-primary flex aspect-square flex-col items-center justify-center gap-1.5 transition-colors sm:aspect-5/4"
						>
							<ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							<span className="font-mono text-[9px] tracking-widest uppercase">
								All {ICON_COUNTS.total}
							</span>
						</Link>
					</div>

					<div className="border-border/60 flex items-center justify-between border-t px-4 py-3 font-mono text-[10px] tracking-widest">
						<span className="text-primary">lucide + huge</span>
						<span className="text-textMuted uppercase">in motion</span>
					</div>
				</SpecimenFrame>
			</div>
		</section>
	);
};

export default KineticWall;
