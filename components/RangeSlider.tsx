"use client";

export type Bounds = { min: number; max: number };

type Props = {
	label: string;
	display: string;
	bounds: Bounds;
	step: number;
	value: number;
	onChange: (value: number) => void;
};

const percent = (value: number, { min, max }: Bounds) =>
	((value - min) / (max - min)) * 100;

const trackFill = (pct: number) =>
	`linear-gradient(to right, var(--color-primary) ${pct}%, var(--color-border) ${pct}%)`;

const RangeSlider: React.FC<Props> = ({
	label,
	display,
	bounds,
	step,
	value,
	onChange,
}) => (
	<label className="flex flex-col gap-1.5">
		<span className="text-textMuted flex justify-between text-sm">
			{label}
			<span className="text-textSecondary font-mono text-xs tabular-nums">
				{display}
			</span>
		</span>
		<input
			type="range"
			min={bounds.min}
			max={bounds.max}
			step={step}
			value={value}
			onChange={(e) => onChange(Number(e.target.value))}
			className="ai-slider"
			style={{ background: trackFill(percent(value, bounds)) }}
		/>
	</label>
);

export default RangeSlider;
