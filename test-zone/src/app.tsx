import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FRAMEWORKS } from "./frameworks";
import { describe, IconCard } from "./icon-card";
import { TEST_ICONS, type TestIcon } from "./icons";
import { isMatch, measureIcons, type Comparison, type IconTracks } from "./run";
import {
	DURATIONS,
	LIBRARIES,
	readSettings,
	settingsHref,
	SIZES,
	type Settings,
} from "./settings";

const GROUP_SIZE = 40;
const PAGE_SIZE = 36;

export interface TestZoneReport {
	total: number;
	failures: { key: string; framework: string; detail: string }[];
}

declare global {
	interface Window {
		testZoneReport?: TestZoneReport;
	}
}

const selectIcons = ({ library }: Settings) =>
	TEST_ICONS.filter((icon) => library === "all" || icon.library === library);

function OptionGroup<T extends string | number>({
	label,
	values,
	current,
	href,
	format = String,
}: {
	label: string;
	values: readonly T[];
	current: T;
	href: (value: T) => string;
	format?: (value: T) => string;
}) {
	return (
		<div className="options">
			<span className="options__label">{label}</span>
			{values.map((value) => (
				<a
					key={value}
					href={href(value)}
					className="pill"
					aria-current={value === current ? "page" : undefined}
				>
					{format(value)}
				</a>
			))}
		</div>
	);
}

export function App() {
	const [settings] = useState(readSettings);
	const icons = useMemo(() => selectIcons(settings), [settings]);
	const [results, setResults] = useState<Record<string, Comparison[]>>({});
	const [queue, setQueue] = useState<TestIcon[] | undefined>(
		settings.autoRun ? icons : undefined,
	);
	const [search, setSearch] = useState("");
	const [onlyOff, setOnlyOff] = useState(false);
	const [page, setPage] = useState(0);
	const [readyKeys, setReadyKeys] = useState<ReadonlySet<string>>(
		() => new Set(),
	);
	const [testing, setTesting] = useState<string>();
	const groupTracks = useRef(new Map<string, IconTracks>());
	const gridTracks = useRef(new Map<string, IconTracks>());
	const measuringNow = useRef(false);

	const unmeasured = useMemo(
		() => queue?.filter((icon) => !results[icon.key]) ?? [],
		[queue, results],
	);
	const group = useMemo(() => unmeasured.slice(0, GROUP_SIZE), [unmeasured]);
	const running = unmeasured.length > 0;
	const finished = queue !== undefined && !running;
	const groupReady =
		group.length > 0 && group.every((icon) => readyKeys.has(icon.key));

	const registerGroup = useCallback(
		(key: string, tracks: IconTracks | null) => {
			if (tracks) groupTracks.current.set(key, tracks);
			else groupTracks.current.delete(key);
			setReadyKeys((previous) => {
				const next = new Set(previous);
				if (tracks) next.add(key);
				else next.delete(key);
				return next;
			});
		},
		[],
	);

	const registerGrid = useCallback((key: string, tracks: IconTracks | null) => {
		if (tracks) gridTracks.current.set(key, tracks);
		else gridTracks.current.delete(key);
	}, []);

	const record = useCallback((measured: Record<string, Comparison[]>) => {
		measuringNow.current = false;
		setResults((previous) => ({ ...previous, ...measured }));
	}, []);

	useEffect(() => {
		if (!groupReady || testing || measuringNow.current) return;
		measuringNow.current = true;
		const tracks = group.map(
			(icon) => groupTracks.current.get(icon.key) as IconTracks,
		);
		measureIcons(tracks, settings.duration).then(record);
	}, [groupReady, group, testing, settings.duration, record]);

	const testIcon = useCallback(
		(key: string) => {
			const tracks = gridTracks.current.get(key);
			if (!tracks || measuringNow.current) return;
			measuringNow.current = true;
			setTesting(key);
			measureIcons([tracks], settings.duration).then((measured) => {
				record(measured);
				setTesting(undefined);
			});
		},
		[settings.duration, record],
	);

	const failures = useMemo(
		() =>
			icons.flatMap((icon) =>
				(results[icon.key] ?? []).flatMap((comparison, index) =>
					isMatch(comparison)
						? []
						: [
								{
									key: icon.key,
									framework: FRAMEWORKS[index].label,
									detail: describe(comparison),
								},
							],
				),
			),
		[icons, results],
	);

	useEffect(() => {
		document.documentElement.dataset.status = running
			? "running"
			: finished
				? "done"
				: "idle";
		if (finished) window.testZoneReport = { total: icons.length, failures };
	}, [running, finished, icons.length, failures]);

	const runAll = () => {
		setResults({});
		setQueue(icons);
	};

	const visible = icons.filter(
		(icon) =>
			icon.key.includes(search.trim().toLowerCase()) &&
			(!onlyOff ||
				results[icon.key]?.some((comparison) => !isMatch(comparison))),
	);
	const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
	const currentPage = Math.min(page, pageCount - 1);
	const pageIcons = visible.slice(
		currentPage * PAGE_SIZE,
		(currentPage + 1) * PAGE_SIZE,
	);
	const measured = icons.filter((icon) => results[icon.key]);

	return (
		<main className="layout">
			<header className="intro">
				<h1>Test zone</h1>
				<p>
					Every icon plays in React and in the plain JS, Vue and Angular
					packages on one shared clock that steps through each frame, so all
					four compute the same moments and every frame is compared exactly.
					Anything that differs from React is marked off. Hover a card to watch
					all four at normal speed.
				</p>
			</header>

			<section className="toolbar">
				<OptionGroup
					label="Library"
					values={LIBRARIES}
					current={settings.library}
					href={(library) => settingsHref(settings, { library })}
				/>
				<OptionGroup
					label="Size"
					values={SIZES}
					current={settings.size}
					href={(size) => settingsHref(settings, { size })}
				/>
				<OptionGroup
					label="Speed"
					values={DURATIONS}
					current={settings.duration}
					href={(duration) => settingsHref(settings, { duration })}
					format={(duration) => `${duration}x`}
				/>
			</section>

			<section className="summary" aria-live="polite">
				<button
					type="button"
					className="button"
					onClick={runAll}
					disabled={running || testing !== undefined}
				>
					{running ? "Measuring" : "Run every icon"}
				</button>
				<span>
					{running
						? `Measured ${measured.length} of ${icons.length}`
						: `${measured.length} of ${icons.length} measured`}
				</span>
				{FRAMEWORKS.map((framework, index) => {
					const matched = measured.filter((icon) =>
						isMatch(results[icon.key][index]),
					).length;
					return (
						<span key={framework.id} className="summary__framework">
							{framework.label}: {matched} of {measured.length} match
						</span>
					);
				})}
			</section>

			{running && (
				<section>
					<h2>Measuring now</h2>
					<ul className="grid">
						{group.map((icon) => (
							<IconCard
								key={icon.key}
								icon={icon}
								size={settings.size}
								duration={settings.duration}
								result={results[icon.key]}
								register={registerGroup}
							/>
						))}
					</ul>
				</section>
			)}

			{failures.length > 0 && (
				<section className="failures">
					<h2>Off ({failures.length})</h2>
					<ul>
						{failures.map(({ key, framework, detail }) => (
							<li key={`${key}-${framework}`}>
								<strong>{key}</strong> in {framework}: {detail}
							</li>
						))}
					</ul>
				</section>
			)}

			<section>
				<div className="filters">
					<input
						type="search"
						placeholder="Search icons"
						value={search}
						onChange={(event) => {
							setSearch(event.target.value);
							setPage(0);
						}}
					/>
					<label>
						<input
							type="checkbox"
							checked={onlyOff}
							onChange={(event) => {
								setOnlyOff(event.target.checked);
								setPage(0);
							}}
						/>
						Only icons that are off
					</label>
				</div>
				<ul className="grid">
					{pageIcons.map((icon) => (
						<IconCard
							key={icon.key}
							icon={icon}
							size={settings.size}
							duration={settings.duration}
							result={results[icon.key]}
							register={registerGrid}
							onTest={testIcon}
							busy={running || testing !== undefined}
						/>
					))}
				</ul>
				<nav className="pagination">
					<button
						type="button"
						className="pill pill--button"
						disabled={currentPage === 0}
						onClick={() => setPage(currentPage - 1)}
					>
						Previous
					</button>
					<span>
						Page {currentPage + 1} of {pageCount}
					</span>
					<button
						type="button"
						className="pill pill--button"
						disabled={currentPage >= pageCount - 1}
						onClick={() => setPage(currentPage + 1)}
					>
						Next
					</button>
				</nav>
			</section>
		</main>
	);
}
