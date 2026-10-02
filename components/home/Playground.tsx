"use client";

import ColorSwatches from "@/components/ColorSwatches";
import IconButton from "@/components/IconButton";
import RangeSlider, { type Bounds } from "@/components/RangeSlider";
import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import { useIconLoop } from "@/hooks/useIconLoop";
import { PlayIcon } from "@/icons/huge/play-icon";
import { Refresh01Icon } from "@/icons/huge/refresh-0-1-icon";
import { cn } from "@/lib/utils";
import { iconNameToComponent } from "@/utils/iconNameToComponent";
import { Suspense, useState } from "react";
import CodeSnippet from "./CodeSnippet";
import { PLAYGROUND_ICONS } from "./showcase-icons";

const SWATCHES = [
	"#f45b48",
	"#e5e7eb",
	"#38bdf8",
	"#22c55e",
	"#f59e0b",
	"#a78bfa",
];
const SIZE: Bounds = { min: 24, max: 160 };
const DURATION: Bounds = { min: 0.4, max: 2 };
const DEFAULTS = { color: "#f45b48", size: 112, duration: 1 };
const IMPORT_PATH = "@animateicons/react/huge";

const buildUsage = (
	component: string,
	size: number,
	color: string,
	duration: number,
) => `<${component} size={${size}} color="${color}" duration={${duration}} />`;

const WIDEST_USAGE = PLAYGROUND_ICONS.map(({ name }) =>
	buildUsage(iconNameToComponent(name), SIZE.max, "#ffffff", DURATION.min),
).reduce((a, b) => (b.length > a.length ? b : a));

type PlaygroundIcon = (typeof PLAYGROUND_ICONS)[number];

const PickerButton: React.FC<
	PlaygroundIcon & { selected: boolean; onSelect: () => void }
> = ({ name, Icon, selected, onSelect }) => {
	const { ref, triggerProps } = useIconHover();

	return (
		<button
			type="button"
			onClick={onSelect}
			aria-label={name}
			aria-pressed={selected}
			{...triggerProps}
			className={cn(
				"grid size-11 place-items-center rounded-full transition-colors sm:size-13",
				selected
					? "bg-primary/15 text-primary"
					: "text-textSecondary hover:bg-surfaceElevated hover:text-textPrimary",
			)}
		>
			<Suspense fallback={null}>
				<Icon ref={ref} size={24} />
			</Suspense>
		</button>
	);
};

const Playground: React.FC = () => {
	const [selected, setSelected] = useState(0);
	const [color, setColor] = useState(DEFAULTS.color);
	const [size, setSize] = useState(DEFAULTS.size);
	const [duration, setDuration] = useState(DEFAULTS.duration);
	const { name, Icon } = PLAYGROUND_ICONS[selected];
	const iconRef = useIconLoop(Math.max(1500, duration * 1400 + 800), selected);

	const component = iconNameToComponent(name);
	const importLine = `import { ${component} } from "${IMPORT_PATH}";`;
	const usageLine = buildUsage(component, size, color, duration);

	const isDefault =
		color === DEFAULTS.color &&
		size === DEFAULTS.size &&
		duration === DEFAULTS.duration;

	const reset = () => {
		setColor(DEFAULTS.color);
		setSize(DEFAULTS.size);
		setDuration(DEFAULTS.duration);
	};

	return (
		<section aria-label="Playground" className="home-section">
			<div className="mx-auto max-w-7xl px-6">
				<h2 className="text-textPrimary text-3xl font-semibold tracking-tight sm:text-4xl">
					Tune it. Copy it<span className="text-primary">.</span>
				</h2>

				<div className="relative mt-11 flex flex-col items-center gap-5">
					<div
						aria-hidden="true"
						className="bg-plus-grid pointer-events-none absolute inset-0 [--plus-mask:radial-gradient(circle_at_50%_38%,#000_8%,transparent_60%)]"
					/>

					<div className="relative grid min-h-44 place-items-center">
						<Suspense fallback={null}>
							<Icon
								ref={iconRef}
								size={size}
								color={color}
								duration={duration}
							/>
						</Suspense>
					</div>

					<CodeSnippet
						code={usageLine}
						copyText={`${importLine}\n\n${usageLine}`}
						sizer={WIDEST_USAGE}
					/>

					<div className="relative flex items-center gap-2">
						<IconButton
							icon={PlayIcon}
							onClick={() => iconRef.current?.startAnimation()}
							variant="secondary"
							size="pill"
						>
							Replay
						</IconButton>
						<IconButton
							icon={Refresh01Icon}
							onClick={reset}
							disabled={isDefault}
							variant="secondary"
							size="pill"
						>
							Reset
						</IconButton>
					</div>
				</div>

				<div className="mt-8 flex flex-wrap justify-center gap-2">
					{PLAYGROUND_ICONS.map((icon, i) => (
						<PickerButton
							key={icon.name}
							{...icon}
							selected={i === selected}
							onSelect={() => setSelected(i)}
						/>
					))}
				</div>

				<div className="mx-auto mt-8 grid max-w-3xl items-center gap-8 text-left md:grid-cols-[auto_1fr_1fr] md:gap-10">
					<ColorSwatches
						value={color}
						onChange={setColor}
						swatches={SWATCHES}
						className="justify-center"
					/>

					<RangeSlider
						label="Size"
						display={`${size}px`}
						bounds={SIZE}
						step={1}
						value={size}
						onChange={setSize}
					/>
					<RangeSlider
						label="Duration"
						display={`${duration.toFixed(1)}s`}
						bounds={DURATION}
						step={0.1}
						value={duration}
						onChange={setDuration}
					/>
				</div>
			</div>
		</section>
	);
};

export default Playground;
