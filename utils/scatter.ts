export type ScatterPoint = {
	left: string;
	top: string;
	bob: string;
	delay: string;
	thinned: boolean;
};

export const scatter = (
	count: number,
	cols: number,
	rows: number,
	seed = 7,
): ScatterPoint[] => {
	let state = seed;
	const rnd = () => {
		state = (state * 16807) % 2147483647;
		return state / 2147483647;
	};

	return Array.from({ length: count }, (_, i) => {
		const row = Math.floor(i / cols);
		const col = i % cols;
		return {
			left: (((col + 0.5 + (rnd() - 0.5) * 0.7) / cols) * 100).toFixed(2),
			top: (((row + 0.5 + (rnd() - 0.5) * 0.55) / rows) * 100).toFixed(2),
			bob: (5 + rnd() * 3).toFixed(1),
			delay: (-rnd() * 6).toFixed(1),
			thinned: (row + col) % 2 === 1,
		};
	});
};
