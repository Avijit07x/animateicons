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
import type { IconConfig, TriggerMode } from "./useIconConfig";

type Props = {
	config: IconConfig;
	update: <K extends keyof IconConfig>(key: K, value: IconConfig[K]) => void;
};

const TRIGGERS: TriggerMode[] = ["hover", "click", "loop"];

/** Tailwind class chain for the AnimateIcons-styled range slider — keep here, not duplicated. */
const sliderClass = cn(
	"h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surfaceElevated",
	// WebKit thumb
	"[&::-webkit-slider-thumb]:appearance-none",
	"[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4",
	"[&::-webkit-slider-thumb]:rounded-full",
	"[&::-webkit-slider-thumb]:bg-primary",
	"[&::-webkit-slider-thumb]:shadow-md",
	"[&::-webkit-slider-thumb]:transition-transform",
	"[&::-webkit-slider-thumb]:hover:scale-110",
	// Firefox thumb
	"[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4",
	"[&::-moz-range-thumb]:border-0",
	"[&::-moz-range-thumb]:rounded-full",
	"[&::-moz-range-thumb]:bg-primary",
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
				<div className="bg-surfaceElevated border-border/60 flex items-center gap-3 rounded-md border px-3 py-2">
					<label
						htmlFor="pg-color"
						className="border-border/40 relative h-6 w-6 cursor-pointer overflow-hidden rounded border"
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
					className="bg-surfaceElevated border-border/60 flex gap-1 rounded-full border p-1"
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
									"flex-1 rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors",
									active
										? "bg-primary text-white"
										: "text-textSecondary hover:text-textPrimary",
								)}
							>
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
