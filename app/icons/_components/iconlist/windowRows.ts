export type RowWindow = {
	start: number;
	end: number;
	topSpacer: number;
	bottomSpacer: number;
};

type WindowParams = {
	itemCount: number;
	columns: number;
	rowHeight: number;
	gap: number;
	firstRow: number;
	lastRow: number;
	overscanRows: number;
	focusRow?: number | null;
};

const EMPTY: RowWindow = { start: 0, end: 0, topSpacer: 0, bottomSpacer: 0 };

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

export const visibleRows = (
	scrollTop: number,
	viewportHeight: number,
	rowHeight: number,
	gap: number,
) => {
	const stride = rowHeight + gap;
	return {
		firstRow: Math.floor(scrollTop / stride),
		lastRow: Math.floor((scrollTop + viewportHeight) / stride),
	};
};

export const computeRowWindow = ({
	itemCount,
	columns,
	rowHeight,
	gap,
	firstRow,
	lastRow,
	overscanRows,
	focusRow = null,
}: WindowParams): RowWindow => {
	if (itemCount <= 0 || columns <= 0) return EMPTY;

	const stride = rowHeight + gap;
	const totalRows = Math.ceil(itemCount / columns);
	const lastIndex = totalRows - 1;

	let endRow = clamp(lastRow + overscanRows, 0, lastIndex);
	let startRow = clamp(firstRow - overscanRows, 0, endRow);

	if (
		focusRow !== null &&
		focusRow >= startRow - 1 &&
		focusRow <= endRow + 1 &&
		focusRow <= lastIndex
	) {
		startRow = Math.min(startRow, Math.max(0, focusRow - 1));
		endRow = Math.min(lastIndex, Math.max(endRow, focusRow + 2));
	}

	const rowsBelow = lastIndex - endRow;

	return {
		start: startRow * columns,
		end: Math.min(itemCount, (endRow + 1) * columns),
		topSpacer: startRow > 0 ? startRow * stride - gap : 0,
		bottomSpacer: rowsBelow > 0 ? rowsBelow * stride - gap : 0,
	};
};
