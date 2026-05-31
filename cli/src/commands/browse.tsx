import {
	fetchCatalog,
	fetchRegistryItem,
	searchIcons,
	writeIcon,
	type Catalog,
	type CatalogIcon,
	type IconLibrary,
} from "@animateicons/core";
import { Box, Text, render, useApp, useInput, useStdout } from "ink";
import { useEffect, useMemo, useState } from "react";

export interface AddedIcon {
	registryName: string;
	file: string;
	skipped: boolean;
	failed?: boolean;
}

export interface RunBrowseOptions {
	cwd: string;
	dir: string;
	registryBase?: string;
	/** Resolved `cn` import specifier for written icons. */
	utilsImport: string;
}

export interface BrowseResult {
	added: AddedIcon[];
}

type LibraryFilter = IconLibrary | "all";

const COL_WIDTH = 30;

const nextLibrary = (f: LibraryFilter): LibraryFilter =>
	f === "all" ? "lucide" : f === "lucide" ? "huge" : "all";

const trunc = (s: string, n: number): string =>
	s.length > n ? `${s.slice(0, Math.max(0, n - 1))}…` : s;

interface AppProps extends RunBrowseOptions {
	/** Keeps the outer result current so Ctrl-C still reports what was added. */
	reportAdded: (added: AddedIcon[]) => void;
}

export function BrowseApp({
	cwd,
	dir,
	registryBase,
	utilsImport,
	reportAdded,
}: AppProps) {
	const { exit } = useApp();
	const { stdout } = useStdout();

	const [catalog, setCatalog] = useState<Catalog | null>(null);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const [library, setLibrary] = useState<LibraryFilter>("all");
	const [cursor, setCursor] = useState(0);
	const [scrollRow, setScrollRow] = useState(0);
	const [selected, setSelected] = useState<Set<string>>(() => new Set());
	const [added, setAdded] = useState<AddedIcon[]>([]);
	const [status, setStatus] = useState<string | null>(null);
	const [isAdding, setIsAdding] = useState(false);

	useEffect(() => {
		let alive = true;
		fetchCatalog({ registryBase })
			.then((c) => alive && setCatalog(c))
			.catch(
				(e) =>
					alive && setLoadError(e instanceof Error ? e.message : String(e)),
			);
		return () => {
			alive = false;
		};
	}, [registryBase]);

	useEffect(() => {
		reportAdded(added);
	}, [added, reportAdded]);

	const results = useMemo<CatalogIcon[]>(() => {
		if (!catalog) return [];
		const opts = library === "all" ? {} : { library };
		return searchIcons(catalog, query, { ...opts, limit: 2000 });
	}, [catalog, query, library]);

	const termCols = stdout?.columns ?? 80;
	const termRows = stdout?.rows ?? 24;
	const innerWidth = Math.max(24, termCols - 4);
	const cols = Math.max(1, Math.floor(innerWidth / COL_WIDTH));
	const gridRows = Math.max(3, termRows - 12);
	const pageSize = cols * gridRows;

	const cursorIdx =
		results.length === 0 ? 0 : Math.min(cursor, results.length - 1);
	const current = results[cursorIdx] ?? null;

	useEffect(() => {
		const cursorRow = Math.floor(cursorIdx / cols);
		setScrollRow((prev) => {
			if (cursorRow < prev) return cursorRow;
			if (cursorRow >= prev + gridRows) return cursorRow - gridRows + 1;
			return prev;
		});
	}, [cursorIdx, cols, gridRows]);

	const moveBy = (delta: number) =>
		setCursor(() => {
			const max = results.length - 1;
			if (max < 0) return 0;
			return Math.min(max, Math.max(0, cursorIdx + delta));
		});

	const resetView = () => {
		setCursor(0);
		setScrollRow(0);
	};

	const toggleSelect = () => {
		if (!current) return;
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(current.registryName)) next.delete(current.registryName);
			else next.add(current.registryName);
			return next;
		});
	};

	const doAdd = async () => {
		if (!catalog || isAdding) return;
		const names =
			selected.size > 0
				? Array.from(selected)
				: current
					? [current.registryName]
					: [];
		if (names.length === 0) return;

		setIsAdding(true);
		setStatus(`Adding ${names.length} icon(s)...`);

		const batch: AddedIcon[] = [];
		for (const registryName of names) {
			const icon = catalog.icons.find((i) => i.registryName === registryName);
			if (!icon) continue;
			try {
				const item = await fetchRegistryItem(registryName, { registryBase });
				const w = writeIcon(item, {
					cwd,
					targetDir: dir,
					fileName: `${icon.name}.tsx`,
					utilsImport,
				});
				batch.push({ registryName, file: w.file, skipped: w.skipped });
			} catch {
				batch.push({ registryName, file: "", skipped: false, failed: true });
			}
		}

		setAdded((prev) => {
			const map = new Map(prev.map((a) => [a.registryName, a]));
			for (const a of batch) map.set(a.registryName, a);
			return Array.from(map.values());
		});
		setSelected(new Set());
		setIsAdding(false);

		const wrote = batch.filter((a) => !a.skipped && !a.failed).length;
		const skipped = batch.filter((a) => a.skipped).length;
		const failed = batch.filter((a) => a.failed).length;
		setStatus(
			`Added ${wrote}` +
				(skipped ? `, skipped ${skipped} (exists)` : "") +
				(failed ? `, ${failed} failed` : "") +
				" · keep browsing or press esc to finish",
		);
	};

	// Single-mode, fzf-style input: typing always filters; the keys below are
	// reserved for actions (so they never leak into the query).
	useInput(
		(input, key) => {
			if (isAdding) return;
			if (key.escape) return exit();
			if (key.return) return void doAdd();
			if (key.tab) {
				setLibrary((cur) => nextLibrary(cur));
				resetView();
				return;
			}
			if (input === " ") return toggleSelect();
			if (key.upArrow) return moveBy(-cols);
			if (key.downArrow) return moveBy(cols);
			if (key.leftArrow) return moveBy(-1);
			if (key.rightArrow) return moveBy(1);
			if (key.backspace || key.delete) {
				setQuery((q) => q.slice(0, -1));
				resetView();
				return;
			}
			if (input && input >= " " && !key.ctrl && !key.meta) {
				setQuery((q) => q + input);
				resetView();
			}
		},
		{ isActive: !isAdding },
	);

	const rule = "─".repeat(innerWidth);

	if (loadError) {
		return (
			<Box
				flexDirection="column"
				borderStyle="round"
				borderColor="red"
				paddingX={1}
			>
				<Text color="red">Failed to load catalog: {loadError}</Text>
				<Text dimColor>Press Ctrl+C to exit.</Text>
			</Box>
		);
	}
	if (!catalog) {
		return (
			<Box borderStyle="round" borderColor="cyan" paddingX={1}>
				<Text>
					<Text color="cyan">●</Text> Loading icon catalog...
				</Text>
			</Box>
		);
	}

	const start = scrollRow * cols;
	const page = results.slice(start, start + pageSize);
	const gridData: CatalogIcon[][] = [];
	for (let r = 0; r < page.length; r += cols)
		gridData.push(page.slice(r, r + cols));
	const totalRows = Math.ceil(results.length / cols) || 1;
	const curRow = Math.floor(cursorIdx / cols);

	const tab = (name: LibraryFilter, label: string) =>
		library === name ? (
			<Text color="black" backgroundColor="cyan" bold>
				{` ${label} `}
			</Text>
		) : (
			<Text dimColor>{` ${label} `}</Text>
		);

	return (
		<Box
			flexDirection="column"
			borderStyle="round"
			borderColor="cyan"
			paddingX={1}
		>
			<Box justifyContent="space-between" width={innerWidth}>
				<Text bold color="cyan">
					AnimateIcons
				</Text>
				<Text dimColor>
					{results.length}/{catalog.total} icons
					{selected.size > 0 ? `  ·  ${selected.size} selected` : ""}
				</Text>
			</Box>

			<Box marginTop={1} width={innerWidth}>
				<Text color="cyan">{"› "}</Text>
				<Box minWidth={24}>
					{query ? (
						<Text>
							{query}
							<Text color="cyan">▋</Text>
						</Text>
					) : (
						<Text dimColor>
							type to filter…<Text color="cyan">▋</Text>
						</Text>
					)}
				</Box>
				<Text dimColor>{"  "}</Text>
				{tab("all", "all")}
				{tab("lucide", "lucide")}
				{tab("huge", "huge")}
			</Box>

			<Text dimColor>{rule}</Text>

			<Box flexDirection="column">
				{results.length === 0 ? (
					<Text dimColor>no matches</Text>
				) : (
					gridData.map((row, ri) => (
						<Box key={ri} flexDirection="row">
							{row.map((icon, ci) => {
								const idx = start + ri * cols + ci;
								const isCursor = idx === cursorIdx;
								const isSel = selected.has(icon.registryName);
								const label = `${isCursor ? "▸" : " "} ${isSel ? "◼" : "◻"} ${icon.registryName}`;
								const fitted = trunc(label, COL_WIDTH - 1).padEnd(
									COL_WIDTH - 1,
								);
								return (
									<Box key={icon.registryName} width={COL_WIDTH}>
										{isCursor ? (
											<Text
												color="black"
												backgroundColor="cyan"
												wrap="truncate"
											>
												{fitted}
											</Text>
										) : (
											<Text color={isSel ? "green" : undefined} wrap="truncate">
												{fitted}
											</Text>
										)}
									</Box>
								);
							})}
						</Box>
					))
				)}
			</Box>

			<Text dimColor>{rule}</Text>

			<Box flexDirection="column" width={innerWidth} minHeight={3}>
				{current ? (
					<>
						<Text>
							<Text bold>{current.name}</Text>
							<Text
								dimColor
							>{`  ·  ${current.library}  ·  ${current.category.join(", ") || "uncategorized"}`}</Text>
						</Text>
						<Text dimColor wrap="truncate-end">
							{current.keywords.join(", ") || "-"}
						</Text>
						<Text color="green">{`→ animateicons add ${current.name}`}</Text>
					</>
				) : (
					<Text dimColor>no selection</Text>
				)}
			</Box>

			<Box width={innerWidth}>
				{status ? (
					<Text color="yellow" wrap="truncate-end">
						{status}
					</Text>
				) : (
					<Text dimColor wrap="truncate-end">
						{`type to filter · ↑↓←→ move · space select · enter add · tab library · esc quit   ${curRow + 1}/${totalRows}`}
					</Text>
				)}
			</Box>
		</Box>
	);
}

/** Render the Ink dashboard and resolve with everything that was added. */
export async function runBrowse(opts: RunBrowseOptions): Promise<BrowseResult> {
	const result: BrowseResult = { added: [] };
	const instance = render(
		<BrowseApp
			{...opts}
			reportAdded={(added) => {
				result.added = added;
			}}
		/>,
	);
	try {
		await instance.waitUntilExit();
	} catch {
		// Ctrl-C / SIGINT still resolves; result holds whatever was added.
	}
	return result;
}
