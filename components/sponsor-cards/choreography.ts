import {
	stagger,
	type AnimationOptions,
	type DOMKeyframesDefinition,
} from "motion/react";
import { CARD_H, CARD_W, PANEL_W, fan, offscreenX } from "./geometry";
import type { Geometry } from "./types";

export type Run = (
	target: Element | Element[],
	keyframes: DOMKeyframesDefinition,
	options?: AnimationOptions,
) => void;

export type Parts = {
	anchor: HTMLElement;
	cards: HTMLElement[];
	skins: HTMLElement[];
	faces: HTMLElement[];
	chipFaces: HTMLElement[];
	content: HTMLElement;
	items: HTMLElement[];
	chips: HTMLElement[];
	revealInner: HTMLElement;
};

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const SLIDE = { type: "spring", visualDuration: 0.45, bounce: 0 } as const;
const OPEN = { type: "spring", visualDuration: 0.5, bounce: 0.08 } as const;
const DEAL = { type: "spring", visualDuration: 0.45, bounce: 0.06 } as const;
const RETURN = { type: "spring", visualDuration: 0.5, bounce: 0.1 } as const;
const ENTER = { type: "spring", stiffness: 260, damping: 26 } as const;
const PEEK = { type: "spring", stiffness: 380, damping: 28 } as const;
const TILT = [3, -2.5, 2];
const CHIP_BG = "rgb(36, 36, 36)";
const CARD_BG = "rgb(22, 22, 22)";
const SHADOW = {
	rest: "-10px 14px 34px -12px rgba(0, 0, 0, 0.85)",
	lift: "-18px 32px 52px -14px rgba(0, 0, 0, 0.9)",
	landed: "0px 18px 40px -18px rgba(0, 0, 0, 0.9)",
	none: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
};

export const LANDED_AFTER = 0.8;
export const RETURN_AFTER = 0.1;
export const CLOSE_DURATION = 0.7;
export const QR_TRANSITION = { duration: 0.35, ease: EASE_OUT } as const;

const chipDelay = (k: number) => 0.06 + k * 0.05;

const all = (root: ParentNode, selector: string) =>
	Array.from(root.querySelectorAll<HTMLElement>(selector));

const one = (root: ParentNode, selector: string) =>
	root.querySelector<HTMLElement>(selector) as HTMLElement;

export const collectParts = (root: HTMLElement): Parts => {
	const cards = all(root, "[data-card]");
	return {
		anchor: one(root, "[data-anchor]"),
		cards,
		skins: cards.map((card) => one(card, "[data-skin]")),
		faces: cards.map((card) => one(card, "[data-face]")),
		chipFaces: all(root, "[data-chip-face]"),
		content: one(root, "[data-content]"),
		items: all(root, "[data-item]"),
		chips: all(root, "[data-chip]"),
		revealInner: one(root, "[data-reveal-inner]"),
	};
};

export const playEnter = (run: Run, { cards }: Parts) =>
	cards.forEach((card, i) =>
		run(card, fan(i), {
			...ENTER,
			delay: 0.35 + (cards.length - 1 - i) * 0.07,
		}),
	);

export const playSpread = (run: Run, { cards }: Parts, on: boolean) =>
	cards.forEach((card, i) => run(card, fan(i, on ? 1 : 0), PEEK));

export const playOpen = (run: Run, parts: Parts, geometry: Geometry) => {
	const { cards, skins, faces, chipFaces, content, items } = parts;
	const [front, ...tips] = cards;

	run(
		front,
		{
			x: geometry.panel.x,
			y: geometry.panel.y,
			width: PANEL_W,
			height: geometry.panelH,
		},
		OPEN,
	);
	run(front, { rotate: [null, -2, 0] }, { duration: 0.5, ease: "easeInOut" });
	run(skins[0], { borderRadius: "22px" }, { duration: 0.3 });
	run(
		skins[0],
		{
			scale: [1, 1.03, 1],
			boxShadow: [SHADOW.rest, SHADOW.lift, SHADOW.landed],
		},
		{ duration: 0.5, times: [0, 0.45, 1], ease: "easeInOut" },
	);
	run(
		faces[0],
		{ opacity: 0, filter: "blur(3px)" },
		{ duration: 0.14, delay: 0.04 },
	);
	run(content, { opacity: 1, filter: "blur(0px)" }, { duration: 0 });
	run(
		items,
		{ opacity: [0, 1], y: [8, 0], filter: ["blur(3px)", "blur(0px)"] },
		{
			duration: 0.28,
			ease: EASE_OUT,
			delay: stagger(0.035, { startDelay: 0.12 }),
		},
	);

	tips.forEach((card, k) => {
		const target = geometry.chips[k];
		const delay = chipDelay(k);
		const skin = skins[k + 1];
		run(card, { zIndex: 10 + k, opacity: 1 }, { duration: 0, delay });
		run(
			card,
			{ x: target.x, y: target.y, width: target.w, height: target.h },
			{ ...DEAL, delay },
		);
		run(
			card,
			{ rotate: [null, TILT[k], 0] },
			{ duration: 0.45, ease: "easeInOut", delay },
		);
		run(skin, { borderRadius: `${target.h / 2}px` }, { duration: 0.3, delay });
		run(skin, { backgroundColor: CHIP_BG }, { duration: 0.18, delay });
		run(
			skin,
			{ boxShadow: [SHADOW.rest, SHADOW.lift, SHADOW.none] },
			{ duration: 0.45, times: [0, 0.45, 1], ease: "easeInOut", delay },
		);
		run(
			faces[k + 1],
			{ opacity: 0, filter: "blur(3px)" },
			{ duration: 0.12, delay: delay + 0.02 },
		);
		run(
			chipFaces[k],
			{ opacity: [0, 1], filter: ["blur(3px)", "blur(0px)"] },
			{ duration: 0.2, delay: delay + 0.16 },
		);
	});
};

export const playQr = (
	run: Run,
	{ cards }: Parts,
	geometry: Geometry,
	extra: number,
) => {
	const [front, ...tips] = cards;
	run(front, { height: geometry.panelH + extra }, QR_TRANSITION);
	tips.forEach((card, k) =>
		run(card, { y: geometry.chips[k].y - extra }, QR_TRANSITION),
	);
};

export const playClose = (
	run: Run,
	{ cards, skins, faces, content }: Parts,
) => {
	const [front, ...tips] = cards;
	const delay = 0.06;

	run(content, { opacity: 0, filter: "blur(3px)" }, { duration: 0.18 });
	run(
		faces[0],
		{ opacity: 1, filter: "blur(0px)" },
		{ duration: 0.1, delay: 0.2 },
	);
	run(front, fan(0), { ...RETURN, delay });
	run(front, { width: CARD_W, height: CARD_H }, { ...SLIDE, delay });
	run(skins[0], { borderRadius: "16px" }, { duration: 0.3, delay });
	run(
		skins[0],
		{
			scale: [null, 1.03, 1],
			boxShadow: [SHADOW.landed, SHADOW.lift, SHADOW.rest],
		},
		{ duration: 0.45, times: [0, 0.4, 1], ease: "easeInOut", delay },
	);
	tips.forEach((card) => run(card, { opacity: 0 }, { duration: RETURN_AFTER }));
};

export const playReturn = (
	run: Run,
	{ cards, skins, faces, chipFaces }: Parts,
) =>
	cards.slice(1).forEach((card, k) => {
		const i = k + 1;
		const { x, y, rotate } = fan(i);
		const delay = 0.14 + (cards.length - 1 - i) * 0.06;
		run(
			card,
			{ zIndex: cards.length - i, width: CARD_W, height: CARD_H },
			{ duration: 0 },
		);
		run(
			skins[i],
			{
				borderRadius: "16px",
				backgroundColor: CARD_BG,
				boxShadow: SHADOW.rest,
			},
			{ duration: 0 },
		);
		run(chipFaces[k], { opacity: 0 }, { duration: 0 });
		run(faces[i], { opacity: 1, filter: "blur(0px)" }, { duration: 0 });
		run(
			card,
			{ x: [offscreenX, x], y: [y, y], rotate: [rotate, rotate] },
			{ ...ENTER, delay },
		);
		run(card, { opacity: [1, 1] }, { duration: 0, delay });
	});
