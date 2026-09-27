"use client";

/**
 * PlaygroundControls
 *
 * SRP: render the playground's size / duration / color inputs and bubble
 * updates back through props. Stateless. Laid out like the home page's
 * spec sheet - mono labels, hairline dividers - and the sliders reuse the
 * shared `.ai-slider` style with a primary fill up to the thumb.
 */

import type { IconConfig } from "./useIconConfig";

type Props = {
	config: IconConfig;
	update: <K extends keyof IconConfig>(key: K, value: IconConfig[K]) => void;
};

const SIZE = { min: 16, max: 160 };
const DURATION = { min: 0.25, max: 3 };

const fill = (value: number, { min, max }: { min: number; max: number }) => {
	const pct = ((value - min) / (max - min)) * 100;
	return `linear-gradient(to right, var(--color-primary) ${pct}%, var(--color-border) ${pct}%)`;
};

const Row: React.FC<{
	label: string;
	value: string;
	htmlFor: string;
	children: React.ReactNode;
}> = ({ label, value, htmlFor, children }) => (
	<div className="py-4 first:pt-0 last:pb-0">
		<div className="flex items-center justify-between">
			<label
				htmlFor={htmlFor}
				className="text-textMuted font-mono text-[10px] tracking-[0.2em] uppercase"
			>
				{label}
			</label>
			<span className="text-textSecondary font-mono text-xs tabular-nums">
				{value}
			</span>
		</div>
		<div className="mt-3">{children}</div>
	</div>
);

const PlaygroundControls: React.FC<Props> = ({ config, update }) => {
	return (
		<div className="divide-border/60 divide-y">
			<Row label="Size" value={`${config.size}px`} htmlFor="pg-size">
				<input
					id="pg-size"
					type="range"
					min={SIZE.min}
					max={SIZE.max}
					step={1}
					value={config.size}
					onChange={(e) => update("size", Number(e.target.value))}
					className="ai-slider"
					style={{ background: fill(config.size, SIZE) }}
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
					min={DURATION.min}
					max={DURATION.max}
					step={0.05}
					value={config.duration}
					onChange={(e) => update("duration", Number(e.target.value))}
					className="ai-slider"
					style={{ background: fill(config.duration, DURATION) }}
				/>
			</Row>

			<Row label="Color" value={config.color.toUpperCase()} htmlFor="pg-color">
				<label
					htmlFor="pg-color"
					className="border-border/60 hover:border-primary/40 flex cursor-pointer items-center gap-3 border px-3 py-2 transition-colors"
				>
					<span
						aria-hidden="true"
						className="border-border/60 relative size-6 shrink-0 overflow-hidden rounded-sm border"
						style={{ background: config.color }}
					>
						<input
							id="pg-color"
							type="color"
							value={config.color}
							onChange={(e) => update("color", e.target.value)}
							className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
						/>
					</span>
					<span className="text-textSecondary font-mono text-xs">
						Pick a color
					</span>
				</label>
			</Row>
		</div>
	);
};

export default PlaygroundControls;
