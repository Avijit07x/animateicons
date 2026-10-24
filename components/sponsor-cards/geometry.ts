import type { Geometry } from "./types";

export const CARD_W = 168;
export const CARD_H = 106;
export const PANEL_W = 300;

const PEEK = 24;
const RIGHT = 24;
const BOTTOM = 20;
const CLOSE_OVERLAP = 14;
const OFFSCREEN = CARD_W + 60;

export const fan = (i: number, spread = 0) => ({
	x: CARD_W - PEEK - i * (6 + 3 * spread) - 12 * spread,
	y: -i * (14 + 4 * spread),
	rotate: i * (4 + spread),
});

export const offscreenX = OFFSCREEN;

export const offscreenTransform = (i: number) => {
	const { y, rotate } = fan(i);
	return `translateX(${OFFSCREEN}px) translateY(${y}px) rotate(${rotate}deg)`;
};

const offsetIn = (el: HTMLElement, parent: HTMLElement) => {
	const rect = el.getBoundingClientRect();
	const origin = parent.getBoundingClientRect();
	return {
		x: rect.left - origin.left,
		y: rect.top - origin.top,
		w: rect.width,
		h: rect.height,
	};
};

export const measure = (
	anchor: HTMLElement,
	content: HTMLElement,
	chips: HTMLElement[],
): Geometry => {
	const peek = parseFloat(getComputedStyle(anchor).bottom);
	const panelH = content.offsetHeight;
	const left = -(RIGHT + PANEL_W);
	const top = peek - BOTTOM - panelH;

	return {
		panelH,
		panel: { x: -RIGHT, y: peek - BOTTOM },
		chips: chips.map((chip) => {
			const { x, y, w, h } = offsetIn(chip, content);
			return { x: left + x + w, y: top + y + h, w, h };
		}),
		close: panelH + BOTTOM - peek - CLOSE_OVERLAP,
	};
};
