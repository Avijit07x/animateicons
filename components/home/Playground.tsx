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
import { cn } from "@/lib/utils";
import type { IconHandle } from "@/types/icon";
import { Check, Copy, Play, RotateCcw } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import SpecimenFrame from "./SpecimenFrame";

/**
 * Playground - pick an icon, tune color / size / duration, watch it loop,
 * and copy working JSX. Uses the real icon props (size, color, duration)
 * so the copied snippet matches what renders. Left column is the preview,
 * right column is the controls.
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

const PREVIEW_BUTTON =
	"border-border bg-surface text-textPrimary hover:border-primary/50 hover:text-primary pointer-events-auto inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase transition-colors";

const Row: React.FC<{
	label: string;
	hint?: string;
	value?: React.ReactNode;
	children: React.ReactNode;
}> = ({ label, hint, value, children }) => (
	<div className="border-border/60 border-t px-4 py-4 sm:px-5">
		<div className="flex items-center justify-between gap-4">
			<span className="text-textMuted font-mono text-[10px] tracking-[0.2em] uppercase">
				{label}
				{hint && (
					<span className="text-textDisabled ml-2 tracking-normal normal-case">
						{hint}
					</span>
				)}
			</span>
			{value !== undefined && (
				<span className="text-textSecondary font-mono text-xs tabular-nums">
					{value}
				</span>
			)}
		</div>
		<div className="mt-3">{children}</div>
	</div>
);

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
					{/* Preview */}
					<SpecimenFrame
						label="Preview"
						index={cur.name}
						footLeft={`${size}px`}
						footRight={`${duration.toFixed(1)}s`}
						className="h-full min-w-0"
						innerClassName="relative h-full"
					>
						<div
							className="flex h-full min-h-80 w-full items-center justify-center lg:min-h-96"
							style={{ color }}
						>
							<cur.Icon
								ref={iconRef}
								size={size}
								color={color}
								duration={duration}
							/>
						</div>

						<div className="pointer-events-none absolute inset-x-0 bottom-3.5 flex justify-center gap-2">
							<button type="button" onClick={replay} className={PREVIEW_BUTTON}>
								<Play className="size-3" />
								Replay
							</button>
							<button
								type="button"
								onClick={copy}
								aria-label="Copy code"
								className={PREVIEW_BUTTON}
							>
								{copied ? (
									<Check className="text-success size-3" />
								) : (
									<Copy className="size-3" />
								)}
								{copied ? "Copied" : "Copy"}
							</button>
						</div>
					</SpecimenFrame>

					{/* Controls */}
					<div className="border-border/60 flex min-w-0 flex-col border">
						<div className="flex items-center justify-between px-4 py-3 sm:px-5">
							<span className="text-textMuted font-mono text-[10px] tracking-[0.2em] uppercase">
								Controls
							</span>
							<button
								type="button"
								onClick={reset}
								disabled={isDefault}
								className="text-textMuted hover:text-primary inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase transition-colors disabled:pointer-events-none disabled:opacity-40"
							>
								<RotateCcw className="size-3" />
								Reset
							</button>
						</div>

						<Row label="Icon" value={cur.name}>
							<div className="bg-border/50 border-border/50 grid grid-cols-6 gap-px border">
								{ICONS.map((ic, i) => (
									<button
										key={ic.name}
										type="button"
										onClick={() => setSel(i)}
										onMouseEnter={() => pickerRefs.current[i]?.startAnimation()}
										onMouseLeave={() => pickerRefs.current[i]?.stopAnimation()}
										aria-label={ic.name}
										aria-pressed={i === sel}
										className={cn(
											"flex aspect-square items-center justify-center transition-colors",
											i === sel
												? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_var(--color-primary)]"
												: "bg-bgDark text-textSecondary hover:bg-surface hover:text-textPrimary",
										)}
									>
										<ic.Icon
											ref={(el: IconHandle | null) => {
												pickerRefs.current[i] = el;
											}}
											size={24}
										/>
									</button>
								))}
							</div>
						</Row>

						<Row label="Color" value={color}>
							<div className="flex items-center gap-2.5">
								{SWATCHES.map((s) => (
									<button
										key={s}
										type="button"
										onClick={() => setColor(s)}
										aria-label={`Use ${s}`}
										aria-pressed={color.toLowerCase() === s.toLowerCase()}
										className={cn(
											"ring-offset-bgDark size-7 rounded-sm border transition-transform hover:scale-110",
											color.toLowerCase() === s.toLowerCase()
												? "border-transparent ring-2 ring-white/80 ring-offset-2"
												: "border-border",
										)}
										style={{ backgroundColor: s }}
									/>
								))}
								<label className="border-border text-textMuted hover:border-primary/40 hover:text-textPrimary relative flex size-7 cursor-pointer items-center justify-center overflow-hidden rounded-sm border text-xs transition-colors">
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
						</Row>

						<Row
							label="Size"
							value={
								<span className="flex items-center gap-1.5">
									{SIZE_PRESETS.map((s) => (
										<button
											key={s}
											type="button"
											onClick={() => setSize(s)}
											className={cn(
												"rounded-sm px-1.5 py-0.5 text-[10px] transition-colors",
												size === s
													? "text-primary"
													: "text-textMuted hover:text-textSecondary",
											)}
										>
											{s}
										</button>
									))}
									<span className="ml-1 inline-block w-12 text-right">
										{size}px
									</span>
								</span>
							}
						>
							<input
								type="range"
								min={24}
								max={160}
								step={1}
								value={size}
								onChange={(e) => setSize(Number(e.target.value))}
								aria-label="Icon size"
								className="ai-slider"
								style={{ background: fill(sizePct) }}
							/>
						</Row>

						<Row
							label="Duration"
							hint="lower = faster"
							value={`${duration.toFixed(1)}s`}
						>
							<input
								type="range"
								min={0.4}
								max={2}
								step={0.1}
								value={duration}
								onChange={(e) => setDuration(Number(e.target.value))}
								aria-label="Animation duration"
								className="ai-slider"
								style={{ background: fill(durPct) }}
							/>
						</Row>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Playground;
