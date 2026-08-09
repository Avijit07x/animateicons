"use client";

import { BellRingIcon } from "@/icons/lucide/bell-ring-icon";
import { CalendarIcon } from "@/icons/lucide/calendar-icon";
import { ChartColumnIcon } from "@/icons/lucide/chart-column-icon";
import { FolderIcon } from "@/icons/lucide/folder-icon";
import { HeartIcon } from "@/icons/lucide/heart-icon";
import { HouseIcon } from "@/icons/lucide/house-icon";
import { LayoutDashboardIcon } from "@/icons/lucide/layout-dashboard-icon";
import { MessageCircleIcon } from "@/icons/lucide/message-circle-icon";
import { SearchIcon } from "@/icons/lucide/search-icon";
import { SettingsIcon } from "@/icons/lucide/settings-icon";
import { StarIcon } from "@/icons/lucide/star-icon";
import { UserIcon } from "@/icons/lucide/user-icon";
import type { IconHandle } from "@/types/icon";
import { Check, Copy, Play, RotateCcw } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import SpecimenFrame from "./SpecimenFrame";

/**
 * Playground - pick an icon, tune color / size / duration, watch it loop,
 * and copy working JSX. Uses the real icon props (size, color, duration)
 * so the copied snippet matches what renders. Left column is the output
 * (preview + code); right column is the inputs.
 */

type PIcon = React.ComponentType<{
	size?: number;
	color?: string;
	duration?: number;
	ref?: React.Ref<IconHandle>;
}>;

const ICONS = [
	{ Icon: HouseIcon, name: "house", comp: "HouseIcon" },
	{
		Icon: LayoutDashboardIcon,
		name: "layout-dashboard",
		comp: "LayoutDashboardIcon",
	},
	{ Icon: UserIcon, name: "user", comp: "UserIcon" },
	{ Icon: SearchIcon, name: "search", comp: "SearchIcon" },
	{ Icon: BellRingIcon, name: "bell-ring", comp: "BellRingIcon" },
	{ Icon: StarIcon, name: "star", comp: "StarIcon" },
	{
		Icon: MessageCircleIcon,
		name: "message-circle",
		comp: "MessageCircleIcon",
	},
	{ Icon: CalendarIcon, name: "calendar", comp: "CalendarIcon" },
	{ Icon: ChartColumnIcon, name: "chart-column", comp: "ChartColumnIcon" },
	{ Icon: FolderIcon, name: "folder", comp: "FolderIcon" },
	{ Icon: HeartIcon, name: "heart", comp: "HeartIcon" },
	{ Icon: SettingsIcon, name: "settings", comp: "SettingsIcon" },
] as unknown as { Icon: PIcon; name: string; comp: string }[];

const SWATCHES = [
	"#f45b48",
	"#e5e7eb",
	"#38bdf8",
	"#22c55e",
	"#f59e0b",
	"#a78bfa",
];
const SIZE_PRESETS = [48, 96, 128, 160];
const DEFAULTS = { color: "#f45b48", size: 112, duration: 1 };

const Playground: React.FC = () => {
	const reduced = useReducedMotion();
	const [sel, setSel] = useState(0);
	const [color, setColor] = useState(DEFAULTS.color);
	const [size, setSize] = useState(DEFAULTS.size);
	const [duration, setDuration] = useState(DEFAULTS.duration);
	const [copied, setCopied] = useState(false);
	const iconRef = useRef<IconHandle | null>(null);
	const pickerRefs = useRef<(IconHandle | null)[]>([]);
	const cur = ICONS[sel];

	useEffect(() => {
		if (reduced) return;
		const loopMs = Math.max(1500, duration * 1400 + 800);
		const first = setTimeout(() => iconRef.current?.startAnimation(), 220);
		const loop = setInterval(() => iconRef.current?.startAnimation(), loopMs);
		return () => {
			clearTimeout(first);
			clearInterval(loop);
		};
	}, [reduced, sel, duration]);

	const importLine = `import { ${cur.comp} } from "@animateicons/react/lucide";`;
	const usageLine = `<${cur.comp} size={${size}} color="${color}" duration={${duration}} />`;

	const replay = () => iconRef.current?.startAnimation();
	const reset = () => {
		setColor(DEFAULTS.color);
		setSize(DEFAULTS.size);
		setDuration(DEFAULTS.duration);
	};
	const copy = () => {
		navigator.clipboard?.writeText(`${importLine}\n\n${usageLine}`).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1600);
		});
	};

	const isDefault =
		color === DEFAULTS.color &&
		size === DEFAULTS.size &&
		duration === DEFAULTS.duration;

	const sizePct = ((size - 24) / (160 - 24)) * 100;
	const durPct = ((duration - 0.4) / (2 - 0.4)) * 100;
	const fill = (pct: number) =>
		`linear-gradient(to right, var(--color-primary) ${pct}%, var(--color-border) ${pct}%)`;

	return (
		<section aria-label="Playground" className="border-border/60 border-t">
			<div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
				<p className="text-textMuted font-mono text-[11px] tracking-[0.25em] uppercase">
					<span className="text-primary">03</span> / Playground
				</p>
				<h2 className="text-textPrimary mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
					Tune it. Copy it<span className="text-primary">.</span>
				</h2>

				<div className="mt-14 grid items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
					{/* Output: the live preview */}
					<div className="flex h-full min-w-0 flex-col gap-4">
						<SpecimenFrame
							label="Preview"
							index={cur.name}
							footLeft={`${size}px`}
							footRight={`${duration.toFixed(1)}s`}
							crosshair
							className="w-full grow"
							innerClassName="relative h-full"
						>
							<button
								type="button"
								onClick={replay}
								aria-label="Replay animation"
								className="flex h-full min-h-[420px] w-full cursor-pointer items-center justify-center"
								style={{ color }}
							>
								<cur.Icon
									ref={iconRef}
									size={size}
									color={color}
									duration={duration}
								/>
							</button>

							<div className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
								<button
									type="button"
									onClick={replay}
									aria-label="Replay animation"
									title="Replay"
									className="border-border bg-surface/70 text-textSecondary hover:border-primary/40 hover:text-primary pointer-events-auto flex size-8 items-center justify-center rounded-md border backdrop-blur transition-colors"
								>
									<Play className="size-3.5" />
								</button>
								<button
									type="button"
									onClick={reset}
									disabled={isDefault}
									aria-label="Reset to defaults"
									title="Reset"
									className="border-border bg-surface/70 text-textSecondary hover:border-primary/40 hover:text-primary pointer-events-auto flex size-8 items-center justify-center rounded-md border backdrop-blur transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40"
								>
									<RotateCcw className="size-3.5" />
								</button>
								<button
									type="button"
									onClick={copy}
									aria-label="Copy code"
									title="Copy code"
									className="border-border bg-surface/70 text-textSecondary hover:border-primary/40 hover:text-primary pointer-events-auto flex size-8 items-center justify-center rounded-md border backdrop-blur transition-colors"
								>
									{copied ? (
										<Check className="text-success size-3.5" />
									) : (
										<Copy className="size-3.5" />
									)}
								</button>
							</div>
						</SpecimenFrame>
					</div>

					{/* Inputs */}
					<div className="flex min-w-0 flex-col gap-8">
						<div>
							<label className="text-textMuted font-mono text-[10px] tracking-[0.2em] uppercase">
								Icon
							</label>
							<div className="mt-3 grid grid-cols-6 gap-2">
								{ICONS.map((ic, i) => (
									<button
										key={ic.name}
										type="button"
										onClick={() => setSel(i)}
										onMouseEnter={() => pickerRefs.current[i]?.startAnimation()}
										onMouseLeave={() => pickerRefs.current[i]?.stopAnimation()}
										aria-label={ic.name}
										aria-pressed={i === sel}
										className={`flex aspect-square items-center justify-center rounded-xl border transition-all duration-200 ${
											i === sel
												? "border-primary bg-primary/10 text-primary shadow-[0_0_24px_-8px_var(--color-primaryGlow)]"
												: "border-border/70 bg-surface/40 text-textSecondary hover:border-primary/40 hover:bg-surface hover:text-textPrimary hover:-translate-y-0.5"
										}`}
									>
										<ic.Icon
											ref={(el: IconHandle | null) => {
												pickerRefs.current[i] = el;
											}}
											size={28}
										/>
									</button>
								))}
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label className="text-textMuted font-mono text-[10px] tracking-[0.2em] uppercase">
									Color
								</label>
								<span className="text-textSecondary font-mono text-xs">
									{color}
								</span>
							</div>
							<div className="mt-3 flex items-center gap-2">
								{SWATCHES.map((s) => (
									<button
										key={s}
										type="button"
										onClick={() => setColor(s)}
										aria-label={`Use ${s}`}
										className={`size-8 rounded-full border transition-transform hover:scale-110 ${
											color.toLowerCase() === s.toLowerCase()
												? "border-textPrimary scale-110"
												: "border-border"
										}`}
										style={{ backgroundColor: s }}
									/>
								))}
								<label className="border-border text-textMuted hover:border-primary/40 relative flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border text-xs">
									<input
										type="color"
										value={color}
										onChange={(e) => setColor(e.target.value)}
										className="absolute inset-0 cursor-pointer opacity-0"
										aria-label="Custom color"
									/>
									<span aria-hidden="true">+</span>
								</label>
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label className="text-textMuted font-mono text-[10px] tracking-[0.2em] uppercase">
									Size
								</label>
								<div className="flex items-center gap-1.5">
									{SIZE_PRESETS.map((p) => (
										<button
											key={p}
											type="button"
											onClick={() => setSize(p)}
											className={`rounded px-1.5 py-0.5 font-mono text-[10px] tabular-nums transition-colors ${
												size === p
													? "text-primary"
													: "text-textMuted hover:text-textSecondary"
											}`}
										>
											{p}
										</button>
									))}
									<span className="text-textSecondary ml-1 inline-block w-12 text-right font-mono text-xs tabular-nums">
										{size}px
									</span>
								</div>
							</div>
							<input
								type="range"
								min={24}
								max={160}
								step={1}
								value={size}
								onChange={(e) => setSize(Number(e.target.value))}
								aria-label="Icon size"
								className="ai-slider mt-4"
								style={{ background: fill(sizePct) }}
							/>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label className="text-textMuted font-mono text-[10px] tracking-[0.2em] uppercase">
									Duration{" "}
									<span className="text-textDisabled normal-case">
										(lower = faster)
									</span>
								</label>
								<span className="text-textSecondary font-mono text-xs tabular-nums">
									{duration.toFixed(1)}s
								</span>
							</div>
							<input
								type="range"
								min={0.4}
								max={2}
								step={0.1}
								value={duration}
								onChange={(e) => setDuration(Number(e.target.value))}
								aria-label="Animation duration"
								className="ai-slider mt-4"
								style={{ background: fill(durPct) }}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Playground;
