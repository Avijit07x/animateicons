import { useEffect, useMemo, useRef, useState, type Ref } from "react";
import { FRAMEWORKS, type MountedFramework } from "./frameworks";
import {
	loadReactIcon,
	type ReactIcon,
	type ReactIconHandle,
	type TestIcon,
} from "./icons";
import { isMatch, type Comparison, type IconTracks, type Track } from "./run";

interface IconCardProps {
	icon: TestIcon;
	size: number;
	duration: number;
	result?: Comparison[];
	register: (key: string, tracks: IconTracks | null) => void;
	onTest?: (key: string) => void;
	busy?: boolean;
}

const UNITS: Record<Comparison["metric"], string> = {
	position: "px",
	opacity: "",
	dash: " units",
	structure: "",
};

export const describe = (comparison: Comparison) =>
	comparison.metric === "structure"
		? "renders different shapes"
		: `${comparison.difference.toFixed(2)}${UNITS[comparison.metric]} ${comparison.metric} at ${comparison.atMs}ms (${comparison.scenario})`;

function ReactStage({
	component: Component,
	handle,
	size,
	duration,
}: {
	component: ReactIcon;
	handle: Ref<ReactIconHandle>;
	size: number;
	duration: number;
}) {
	return <Component ref={handle} size={size} duration={duration} />;
}

function useReactIcon(icon: TestIcon) {
	const [component, setComponent] = useState<{ icon: ReactIcon }>();
	useEffect(() => {
		let active = true;
		loadReactIcon(icon).then((loaded) => {
			if (active) setComponent({ icon: loaded });
		});
		return () => {
			active = false;
		};
	}, [icon]);
	return component?.icon;
}

export function IconCard({
	icon,
	size,
	duration,
	result,
	register,
	onTest,
	busy = false,
}: IconCardProps) {
	const Icon = useReactIcon(icon);
	const reactHandle = useRef<ReactIconHandle>(null);
	const reactCell = useRef<HTMLDivElement>(null);
	const frameworkCells = useRef<(HTMLDivElement | null)[]>([]);
	const mounted = useRef<MountedFramework[]>([]);
	const [frameworksReady, setFrameworksReady] = useState(false);

	useEffect(() => {
		let active = true;
		const hosts = frameworkCells.current;
		Promise.all(
			FRAMEWORKS.map((framework, index) =>
				framework.mount(hosts[index] as HTMLDivElement, icon.data, {
					size,
					duration,
				}),
			),
		).then((frameworks) => {
			if (!active) {
				for (const framework of frameworks) framework.destroy();
				return;
			}
			mounted.current = frameworks;
			setFrameworksReady(true);
		});
		return () => {
			active = false;
			for (const framework of mounted.current) framework.destroy();
			mounted.current = [];
			setFrameworksReady(false);
		};
	}, [icon, size, duration]);

	const tracks = useMemo((): IconTracks => {
		const candidate = (index: number): Track => ({
			get cell() {
				return frameworkCells.current[index] as HTMLDivElement;
			},
			start: () => mounted.current[index]?.start(),
			stop: () => mounted.current[index]?.stop(),
		});
		return {
			key: icon.key,
			data: icon.data,
			reference: {
				get cell() {
					return reactCell.current as HTMLDivElement;
				},
				start: () => reactHandle.current?.startAnimation(),
				stop: () => reactHandle.current?.stopAnimation(),
			},
			candidates: FRAMEWORKS.map((_, index) => candidate(index)),
		};
	}, [icon]);

	const ready = frameworksReady && Icon !== undefined;

	useEffect(() => {
		if (!ready) return;
		register(icon.key, tracks);
		return () => register(icon.key, null);
	}, [ready, register, icon.key, tracks]);

	const play = () => {
		for (const track of [tracks.reference, ...tracks.candidates]) track.start();
	};
	const rest = () => {
		for (const track of [tracks.reference, ...tracks.candidates]) track.stop();
	};
	const off = result?.some((comparison) => !isMatch(comparison));

	return (
		<li
			className={off ? "card card--off" : "card"}
			data-icon={icon.key}
			onMouseEnter={play}
			onMouseLeave={rest}
		>
			<header className="card__header">
				<span className="card__name">{icon.key}</span>
				{onTest && (
					<button
						type="button"
						className="pill pill--button"
						disabled={!ready || busy}
						onClick={() => onTest(icon.key)}
					>
						Test
					</button>
				)}
			</header>
			<div className="card__stages">
				<figure className="stage">
					<div className="stage__icon" ref={reactCell}>
						{Icon && (
							<ReactStage
								component={Icon}
								handle={reactHandle}
								size={size}
								duration={duration}
							/>
						)}
					</div>
					<figcaption>React</figcaption>
				</figure>
				{FRAMEWORKS.map((framework, index) => {
					const comparison = result?.[index];
					const status = !comparison
						? "waiting"
						: isMatch(comparison)
							? "match"
							: "off";
					return (
						<figure key={framework.id} className="stage">
							<div
								className="stage__icon"
								ref={(element) => {
									frameworkCells.current[index] = element;
								}}
							/>
							<figcaption>
								{framework.label}
								<span
									className={`dot dot--${status}`}
									title={comparison ? describe(comparison) : "Not measured yet"}
								/>
							</figcaption>
						</figure>
					);
				})}
			</div>
			{off && (
				<ul className="card__issues">
					{FRAMEWORKS.map((framework, index) => {
						const comparison = result?.[index];
						if (!comparison || isMatch(comparison)) return null;
						return (
							<li key={framework.id}>
								{framework.label}: {describe(comparison)}
							</li>
						);
					})}
				</ul>
			)}
		</li>
	);
}
