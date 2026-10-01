import {
	computeRowWindow,
	visibleRows,
} from "@/app/icons/_components/iconlist/windowRows";
import { describe, expect, it } from "vitest";

const base = {
	columns: 4,
	rowHeight: 152,
	gap: 12,
	overscanRows: 2,
};
const STRIDE = base.rowHeight + base.gap;

const renderedHeight = (
	itemCount: number,
	w: { start: number; end: number; topSpacer: number; bottomSpacer: number },
	columns: number,
) => {
	const rows = Math.ceil((w.end - w.start) / columns);
	const parts = [];
	if (w.topSpacer > 0) parts.push(w.topSpacer);
	for (let i = 0; i < rows; i++) parts.push(base.rowHeight);
	if (w.bottomSpacer > 0) parts.push(w.bottomSpacer);
	return parts.reduce((a, b) => a + b, 0) + (parts.length - 1) * base.gap;
};

describe("visibleRows", () => {
	it("maps scroll position and viewport height to a row range", () => {
		expect(visibleRows(0, 900, 152, 12)).toEqual({ firstRow: 0, lastRow: 5 });
		expect(visibleRows(STRIDE * 10, 900, 152, 12)).toEqual({
			firstRow: 10,
			lastRow: 15,
		});
	});

	it("gives negative rows while the grid is still below the viewport top", () => {
		expect(visibleRows(-300, 900, 152, 12).firstRow).toBeLessThan(0);
	});
});

describe("computeRowWindow", () => {
	it("renders nothing for an empty list", () => {
		expect(
			computeRowWindow({ ...base, itemCount: 0, firstRow: 0, lastRow: 5 }),
		).toEqual({ start: 0, end: 0, topSpacer: 0, bottomSpacer: 0 });
	});

	it("renders the first rows plus overscan at the top", () => {
		const w = computeRowWindow({
			...base,
			itemCount: 100,
			firstRow: 0,
			lastRow: 5,
		});
		expect(w.start).toBe(0);
		expect(w.end).toBe(8 * 4);
		expect(w.topSpacer).toBe(0);
		expect(w.bottomSpacer).toBe((25 - 1 - 7) * STRIDE - base.gap);
	});

	it("keeps overscan rows above and below in the middle", () => {
		const w = computeRowWindow({
			...base,
			itemCount: 400,
			firstRow: 20,
			lastRow: 25,
		});
		expect(w.start).toBe(18 * 4);
		expect(w.end).toBe(28 * 4);
		expect(w.topSpacer).toBe(18 * STRIDE - base.gap);
	});

	it("clamps a partial last row to the item count", () => {
		const w = computeRowWindow({
			...base,
			itemCount: 10,
			firstRow: 0,
			lastRow: 20,
		});
		expect(w.end).toBe(10);
		expect(w.bottomSpacer).toBe(0);
	});

	it("still shows the last row when the list shrank under the scroll position", () => {
		const w = computeRowWindow({
			...base,
			itemCount: 10,
			firstRow: 50,
			lastRow: 56,
		});
		expect(w.start).toBe(2 * 4);
		expect(w.end).toBe(10);
	});

	it("keeps the total height identical to the full grid for many shapes", () => {
		for (const columns of [1, 2, 3, 4, 5, 6]) {
			for (const itemCount of [1, 7, 34, 459, 669, 2000]) {
				for (const firstRow of [-3, 0, 4, 40, 300]) {
					const w = computeRowWindow({
						...base,
						columns,
						itemCount,
						firstRow,
						lastRow: firstRow + 6,
					});
					const totalRows = Math.ceil(itemCount / columns);
					const full = totalRows * STRIDE - base.gap;
					expect(renderedHeight(itemCount, w, columns)).toBe(full);
				}
			}
		}
	});

	it("extends the window ahead of a focused tile so Tab can keep going", () => {
		const without = computeRowWindow({
			...base,
			itemCount: 400,
			firstRow: 20,
			lastRow: 25,
		});
		const withFocus = computeRowWindow({
			...base,
			itemCount: 400,
			firstRow: 20,
			lastRow: 25,
			focusRow: 27,
		});
		expect(withFocus.end).toBeGreaterThan(without.end);
		expect(withFocus.start).toBe(without.start);
	});

	it("ignores a focused row that is far outside the window", () => {
		const base2 = {
			...base,
			itemCount: 400,
			firstRow: 20,
			lastRow: 25,
		};
		expect(computeRowWindow({ ...base2, focusRow: 90 })).toEqual(
			computeRowWindow(base2),
		);
	});
});
