"use client";

import ColorSwatches from "@/components/ColorSwatches";
import RangeSlider, { type Bounds } from "@/components/RangeSlider";
import type { IconConfig } from "./useIconConfig";

type Props = {
	config: IconConfig;
	update: <K extends keyof IconConfig>(key: K, value: IconConfig[K]) => void;
};

const SIZE: Bounds = { min: 16, max: 160 };
const DURATION: Bounds = { min: 0.25, max: 3 };
const SWATCHES = [
	"#ffffff",
	"#f45b48",
	"#38bdf8",
	"#22c55e",
	"#f59e0b",
	"#a78bfa",
];

const PlaygroundControls: React.FC<Props> = ({ config, update }) => (
	<div className="space-y-5">
		<RangeSlider
			label="Size"
			display={`${config.size}px`}
			bounds={SIZE}
			step={1}
			value={config.size}
			onChange={(size) => update("size", size)}
		/>
		<RangeSlider
			label="Duration"
			display={`${config.duration.toFixed(2)}x`}
			bounds={DURATION}
			step={0.05}
			value={config.duration}
			onChange={(duration) => update("duration", duration)}
		/>
		<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
			<span className="text-textMuted text-sm">Color</span>
			<ColorSwatches
				value={config.color}
				onChange={(color) => update("color", color)}
				swatches={SWATCHES}
				className="flex-wrap"
			/>
		</div>
	</div>
);

export default PlaygroundControls;
