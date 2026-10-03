"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { computeRowWindow, visibleRows } from "./windowRows";

const OVERSCAN_ROWS = 2;
const FALLBACK_GAP = 12;

type View = {
	columns: number;
	rowHeight: number;
	gap: number;
	firstRow: number;
	lastRow: number;
};

const INITIAL_VIEW: View = {
	columns: 6,
	rowHeight: 152,
	gap: FALLBACK_GAP,
	firstRow: 0,
	lastRow: 8,
};

const sameView = (a: View, b: View) =>
	a.columns === b.columns &&
	a.rowHeight === b.rowHeight &&
	a.gap === b.gap &&
	a.firstRow === b.firstRow &&
	a.lastRow === b.lastRow;

export const useWindowedGrid = <T extends { name: string }>(
	items: readonly T[],
) => {
	const [grid, setGrid] = useState<HTMLDivElement | null>(null);
	const [view, setView] = useState<View>(INITIAL_VIEW);
	const [focusRow, setFocusRow] = useState<number | null>(null);

	useEffect(() => {
		if (!grid) return;
		let frame = 0;

		const update = () => {
			frame = 0;
			const style = getComputedStyle(grid);
			const columns = Math.max(
				1,
				style.gridTemplateColumns.split(" ").filter(Boolean).length,
			);
			const gap = parseFloat(style.rowGap) || FALLBACK_GAP;
			const tile = grid.querySelector<HTMLElement>('[role="group"]');
			const gridTop =
				grid.getBoundingClientRect().top + parseFloat(style.paddingTop || "0");

			setView((prev) => {
				const rowHeight = tile ? tile.offsetHeight : prev.rowHeight;
				const { firstRow, lastRow } = visibleRows(
					-gridTop,
					window.innerHeight,
					rowHeight,
					gap,
				);
				const next = { columns, rowHeight, gap, firstRow, lastRow };
				return sameView(prev, next) ? prev : next;
			});
		};

		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		schedule();
		window.addEventListener("scroll", schedule, { passive: true });
		const observer = new ResizeObserver(schedule);
		observer.observe(grid);

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("scroll", schedule);
			observer.disconnect();
		};
	}, [grid]);

	const indexByName = useMemo(
		() => new Map(items.map((item, index) => [item.name, index])),
		[items],
	);

	const onFocusCapture = useCallback(
		(event: React.FocusEvent) => {
			const tile = (event.target as HTMLElement).closest('[role="group"]');
			const name = tile?.getAttribute("aria-label");
			const index = name ? indexByName.get(name) : undefined;
			setFocusRow(
				index === undefined ? null : Math.floor(index / view.columns),
			);
		},
		[indexByName, view.columns],
	);

	const onBlurCapture = useCallback((event: React.FocusEvent) => {
		if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
			setFocusRow(null);
		}
	}, []);

	const rows = useMemo(
		() =>
			computeRowWindow({
				itemCount: items.length,
				...view,
				overscanRows: OVERSCAN_ROWS,
				focusRow,
			}),
		[items.length, view, focusRow],
	);

	const slice = useMemo(
		() => items.slice(rows.start, rows.end),
		[items, rows.start, rows.end],
	);

	return {
		setGrid,
		slice,
		topSpacer: rows.topSpacer,
		bottomSpacer: rows.bottomSpacer,
		onFocusCapture,
		onBlurCapture,
	};
};
