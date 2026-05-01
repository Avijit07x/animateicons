"use client";

/**
 * PlaygroundControls
 *
 * SRP: render the playground's size / duration / color / trigger
 * inputs for the AnimateIcons playground sheet and bubble updates back
 * through props. Stateless. Sliders are native <input type="range">
 * styled with Tailwind arbitrary variants so the AnimateIcons site
 * doesn't pull in a new component dependency just for two sliders.
 */

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { IconConfig, TriggerMode } from "./useIconConfig";

type Props = {
	config: IconConfig;
	update: <K extends keyof IconConfig>(key: K, value: IconConfig[K]) => void;
};

const TRIGGERS: TriggerMode[] = ["hover", "click", "loop"];

/** Tailwind class chain for the AnimateIcons-styled range slider — keep here, not duplicated. */
const sliderClass = cn(
	"h-1.5 w-full cursor-pointer appearance-none rounded-full",
	"bg-surfaceElevated/80 ring-border/60 ring-1 ring-inset",
	"shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]",
	// WebKit thumb
	"[&::-webkit-slider-thumb]:appearance-none",
	"[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4",
	"[&::-webkit-slider-thumb]:rounded-full",
	"[&::-webkit-slider-thumb]:bg-primary",
	"[&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-primary-foreground/20",
	"[&::-webkit-slider-thumb]:shadow-[0_4px_10px_-2px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]",
	"[&::-webkit-slider-thumb]:transition-transform",
	"[&::-webkit-slider-thumb]:hover:scale-110",
	// Firefox thumb
	"[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4",
	"[&::-moz-range-thumb]:border-0",
	"[&::-moz-range-thumb]:rounded-full",
	"[&::-moz-range-thumb]:bg-primary",
	"[&::-moz-range-thumb]:shadow-[0_4px_10px_-2px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]",
);

const Row: React.FC<{
	label: string;
	value: string;
	htmlFor: string;
	children: React.ReactNode;
}> = ({ label, value, htmlFor, children }) => (
	<div className="space-y-2">
		<div className="flex items-center justify-between">
			<label
				htmlFor={htmlFor}
				className="text-textSecondary text-xs font-medium tracking-wide uppercase"
			>
				{label}
			</label>
			<span className="text-textPrimary font-mono text-xs">{value}</span>
		</div>
		{children}
	</div>
);

const PlaygroundControls: React.FC<Props> = ({ config, update }) => {
	return (
		<div className="space-y-5">
			<Row label="Size" value={`${config.size}px`} htmlFor="pg-size">
				<input
					id="pg-size"
					type="range"
					min={16}
					max={160}
					step={1}
					value={config.size}
					onChange={(e) => update("size", Number(e.target.value))}
					className={sliderClass}
				/>
			</Row>

			<Row
				label="Duration"
				value={`${config.duration.toFixed(2)}x`}
				htmlFor="pg-duration"
			>
				<input
					id="pg-duration"
					type="range"
					min={0.25}
					max={3}
					step={0.05}
					value={config.duration}
					onChange={(e) => update("duration", Number(e.target.value))}
					className={sliderClass}
				/>
			</Row>

			<div className="space-y-2">
				<label
					htmlFor="pg-color"
					className="text-textSecondary text-xs font-medium tracking-wide uppercase"
				>
					Color
				</label>
				<div className="border-border/60 relative flex items-center gap-3 overflow-hidden rounded-xl border bg-gradient-to-b from-white/[0.03] to-white/[0.01] px-3 py-2 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
					<span
						aria-hidden="true"
						className="pointer-events-none absolute inset-x-3 top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
					/>
					<label
						htmlFor="pg-color"
						className="ring-border/40 relative h-6 w-6 cursor-pointer overflow-hidden rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.4)] ring-1 ring-inset"
						style={{ background: config.color }}
					>
						<input
							id="pg-color"
							type="color"
							value={config.color}
							onChange={(e) => update("color", e.target.value)}
							className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
						/>
					</label>
					<span className="text-textPrimary font-mono text-xs uppercase">
						{config.color}
					</span>
				</div>
			</div>

			<div className="space-y-2">
				<span className="text-textSecondary text-xs font-medium tracking-wide uppercase">
					Trigger
				</span>
				<div
					role="radiogroup"
					aria-label="Trigger mode"
					className={cn(
						"flex gap-1 rounded-full p-1",
						"border-border/80 from-surface to-surfaceElevated border bg-gradient-to-b",
						"shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_8px_24px_-12px_rgba(0,0,0,0.6)]",
						"backdrop-blur",
					)}
				>
					{TRIGGERS.map((t) => {
						const active = config.trigger === t;
						return (
							<button
								key={t}
								type="button"
								role="radio"
								aria-checked={active}
								onClick={() => update("trigger", t)}
								className={cn(
									"relative z-10 flex-1 rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors",
									active
										? "text-primary"
										: "text-textSecondary hover:text-textPrimary",
								)}
							>
								{active && (
									<motion.span
										layoutId="playground-trigger-pill"
										className="ring-primary/30 absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-white/[0.06] to-transparent ring-1 ring-inset"
										transition={{
											type: "spring",
											stiffness: 380,
											damping: 32,
										}}
									/>
								)}
								{t}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default PlaygroundControls;
