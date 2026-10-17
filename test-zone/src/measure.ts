const TOLERANCE = { position: 0.25, opacity: 0.01, dash: 0.1 } as const;

type Metric = keyof typeof TOLERANCE;

export type Snapshot = (readonly number[])[];

const FIELDS: Metric[] = [
	"position",
	"position",
	"position",
	"position",
	"opacity",
	"dash",
	"dash",
];

const REST_EPSILON = 0.01;
const NOT_DRAWN = "defs, clipPath, mask, symbol, pattern, marker";
const NOT_DRAWN_ROW: readonly number[] = FIELDS.map(() => 0);

export interface Gap {
	ratio: number;
	metric: Metric | "structure";
	difference: number;
}

const dashUnit = (element: Element) => {
	const pathLength = Number(element.getAttribute("pathLength"));
	return element instanceof SVGGeometryElement && pathLength > 0
		? element.getTotalLength() / pathLength
		: 1;
};

export function measure(cell: Element): Snapshot {
	const svg = cell.querySelector("svg");
	if (!svg?.parentElement) return [];
	const origin = svg.parentElement.getBoundingClientRect();
	return [svg, ...svg.querySelectorAll("*")].map((element) => {
		if (element.closest(NOT_DRAWN)) return NOT_DRAWN_ROW;
		const box = element.getBoundingClientRect();
		const style = getComputedStyle(element);
		const unit = dashUnit(element);
		return [
			box.x - origin.x,
			box.y - origin.y,
			box.width,
			box.height,
			Number(style.opacity),
			(parseFloat(style.strokeDasharray) || 0) * unit,
			(parseFloat(style.strokeDashoffset) || 0) * unit,
		];
	});
}

export function difference(reference: Snapshot, candidate: Snapshot): Gap {
	if (reference.length !== candidate.length) {
		return { ratio: Infinity, metric: "structure", difference: 0 };
	}
	let worst: Gap = { ratio: 0, metric: "position", difference: 0 };
	reference.forEach((row, element) =>
		FIELDS.forEach((metric, field) => {
			const gap = Math.abs(row[field] - candidate[element][field]);
			const ratio = gap / TOLERANCE[metric];
			if (ratio > worst.ratio) worst = { ratio, metric, difference: gap };
		}),
	);
	return worst;
}

export const atRest = (snapshot: Snapshot, rest: Snapshot) =>
	snapshot.length === rest.length &&
	snapshot.every((row, element) =>
		row.every(
			(value, field) => Math.abs(value - rest[element][field]) < REST_EPSILON,
		),
	);
