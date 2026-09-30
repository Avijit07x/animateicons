"use client";

import { cn } from "@/lib/utils";

type Props = {
	value: string;
	onChange: (color: string) => void;
	swatches: readonly string[];
	className?: string;
};

const ColorSwatches: React.FC<Props> = ({
	value,
	onChange,
	swatches,
	className,
}) => (
	<div className={cn("flex items-center gap-2.5", className)}>
		{swatches.map((swatch) => {
			const active = value.toLowerCase() === swatch;
			return (
				<button
					key={swatch}
					type="button"
					onClick={() => onChange(swatch)}
					aria-label={`Use ${swatch}`}
					aria-pressed={active}
					className={cn(
						"ring-offset-bgDark size-7 rounded-full transition-transform hover:scale-110",
						active && "ring-2 ring-white/80 ring-offset-2",
					)}
					style={{ backgroundColor: swatch }}
				/>
			);
		})}
		<label className="border-border text-textMuted hover:text-textPrimary relative flex size-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border text-xs transition-colors">
			<input
				type="color"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="absolute inset-0 cursor-pointer opacity-0"
				aria-label="Custom color"
			/>
			<span aria-hidden="true">+</span>
		</label>
	</div>
);

export default ColorSwatches;
