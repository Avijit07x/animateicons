import {
	collectParts,
	playClose,
	playEnter,
	playOpen,
	playQr,
	playReturn,
	playSpread,
	type Run,
} from "@/components/sponsor-cards/choreography";
import {
	CARD_H,
	CARD_W,
	PANEL_W,
	fan,
	measure,
	offscreenTransform,
	offscreenX,
} from "@/components/sponsor-cards/geometry";
import type { Geometry } from "@/components/sponsor-cards/types";
import { afterEach, describe, expect, it } from "vitest";

type Call = {
	target: Element | Element[];
	keyframes: Record<string, unknown>;
	options?: Record<string, unknown>;
};

const rect = (left: number, top: number, width: number, height: number) =>
	({
		left,
		top,
		width,
		height,
		right: left + width,
		bottom: top + height,
		x: left,
		y: top,
		toJSON: () => ({}),
	}) as DOMRect;

const buildStack = () => {
	const root = document.createElement("div");
	root.innerHTML = `
		<div data-anchor style="bottom: 300px"></div>
		${[0, 1, 2, 3]
			.map(
				(i) =>
					`<div data-card><div data-skin><div data-face></div>${i ? "<div data-chip-face></div>" : ""}</div></div>`,
			)
			.join("")}
		<div data-content>
			<p data-item></p>
			<p data-item></p>
			<a data-chip></a>
			<a data-chip></a>
			<button data-chip></button>
			<div data-reveal-inner></div>
		</div>`;
	document.body.append(root);
	return root;
};

const record = () => {
	const calls: Call[] = [];
	const run: Run = (target, keyframes, options) => {
		calls.push({
			target,
			keyframes: keyframes as Record<string, unknown>,
			options: options as Record<string, unknown> | undefined,
		});
	};
	const finalOf = (el: Element) =>
		calls
			.filter((call) => call.target === el)
			.reduce<Record<string, unknown>>(
				(acc, call) => ({ ...acc, ...call.keyframes }),
				{},
			);
	return { run, calls, finalOf };
};

const geometry: Geometry = {
	panelH: 280,
	panel: { x: -24, y: 280 },
	chips: [
		{ x: -222, y: 252, w: 84, h: 32 },
		{ x: -132, y: 252, w: 84, h: 32 },
		{ x: -42, y: 252, w: 84, h: 32 },
	],
	close: -14,
};

afterEach(() => {
	document.body.innerHTML = "";
});

describe("sponsor card geometry", () => {
	it("lets only a strip of the front card peek from the edge", () => {
		expect(fan(0)).toEqual({
			x: CARD_W - 24,
			y: expect.closeTo(0),
			rotate: 0,
		});
	});

	it("fans the cards behind upward and turns them a little more each", () => {
		expect(fan(3)).toEqual({ x: CARD_W - 24 - 18, y: -42, rotate: 12 });
	});

	it("pulls every card further out on hover", () => {
		for (const i of [0, 1, 2, 3]) {
			expect(fan(i, 1).x).toBeLessThan(fan(i).x);
		}
	});

	it("starts each card off screen in its fanned position", () => {
		expect(offscreenX).toBe(CARD_W + 60);
		expect(offscreenTransform(2)).toBe(
			`translateX(${CARD_W + 60}px) translateY(-28px) rotate(8deg)`,
		);
	});

	it("measures the panel and where each chip lands from the live layout", () => {
		const root = buildStack();
		const parts = collectParts(root);
		Object.defineProperty(parts.content, "offsetHeight", { value: 280 });
		parts.content.getBoundingClientRect = () => rect(1000, 400, PANEL_W, 280);
		parts.chips.forEach((chip, k) => {
			chip.getBoundingClientRect = () => rect(1018 + k * 90, 620, 84, 32);
		});

		expect(measure(parts.anchor, parts.content, parts.chips)).toEqual({
			panelH: 280,
			panel: { x: -24, y: 280 },
			chips: [
				{ x: -222, y: 252, w: 84, h: 32 },
				{ x: -132, y: 252, w: 84, h: 32 },
				{ x: -42, y: 252, w: 84, h: 32 },
			],
			close: -14,
		});
	});
});

describe("sponsor card choreography", () => {
	it("finds every moving part by its data attribute", () => {
		const parts = collectParts(buildStack());
		expect(parts.cards).toHaveLength(4);
		expect(parts.skins).toHaveLength(4);
		expect(parts.faces).toHaveLength(4);
		expect(parts.chipFaces).toHaveLength(3);
		expect(parts.items).toHaveLength(2);
		expect(parts.chips).toHaveLength(3);
	});

	it("slides the cards in from the edge, back cards first", () => {
		const { run, calls } = record();
		const parts = collectParts(buildStack());
		playEnter(run, parts);
		const delays = calls.map((call) => call.options?.delay as number);
		expect(delays).toEqual([...delays].sort((a, b) => b - a));
		calls.forEach((call, i) => expect(call.keyframes).toEqual(fan(i)));
	});

	it("fans the stack out on hover and back on leave", () => {
		const { run, finalOf } = record();
		const parts = collectParts(buildStack());
		playSpread(run, parts, true);
		parts.cards.forEach((card, i) => expect(finalOf(card)).toEqual(fan(i, 1)));
		playSpread(run, parts, false);
		parts.cards.forEach((card, i) => expect(finalOf(card)).toEqual(fan(i)));
	});

	it("grows the front card into the panel and deals the rest into chips", () => {
		const { run, finalOf } = record();
		const parts = collectParts(buildStack());
		playOpen(run, parts, geometry);

		expect(finalOf(parts.cards[0])).toMatchObject({
			x: -24,
			y: 280,
			width: PANEL_W,
			height: 280,
		});
		expect(finalOf(parts.faces[0])).toMatchObject({ opacity: 0 });
		expect(finalOf(parts.content)).toMatchObject({ opacity: 1 });
		parts.cards.slice(1).forEach((card, k) => {
			const chip = geometry.chips[k];
			expect(finalOf(card)).toMatchObject({
				x: chip.x,
				y: chip.y,
				width: chip.w,
				height: chip.h,
				zIndex: 10 + k,
			});
			expect(finalOf(parts.skins[k + 1])).toMatchObject({
				borderRadius: `${chip.h / 2}px`,
			});
		});
	});

	it("grows the panel and lifts the hidden chips when the QR code opens", () => {
		const { run, finalOf } = record();
		const parts = collectParts(buildStack());
		playQr(run, parts, geometry, 96);
		expect(finalOf(parts.cards[0])).toEqual({ height: 376 });
		parts.cards.slice(1).forEach((card, k) => {
			expect(finalOf(card)).toEqual({ y: geometry.chips[k].y - 96 });
		});
	});

	it("shrinks the panel back into the front card and fades the chips", () => {
		const { run, finalOf } = record();
		const parts = collectParts(buildStack());
		playClose(run, parts);
		expect(finalOf(parts.content)).toMatchObject({ opacity: 0 });
		expect(finalOf(parts.faces[0])).toMatchObject({ opacity: 1 });
		expect(finalOf(parts.cards[0])).toMatchObject({
			...fan(0),
			width: CARD_W,
			height: CARD_H,
		});
		parts.cards
			.slice(1)
			.forEach((card) => expect(finalOf(card)).toEqual({ opacity: 0 }));
	});

	it("slides the chip cards back into the stack from off screen", () => {
		const { run, finalOf } = record();
		const parts = collectParts(buildStack());
		playReturn(run, parts);
		parts.cards.slice(1).forEach((card, k) => {
			const i = k + 1;
			const { x, y, rotate } = fan(i);
			expect(finalOf(card)).toMatchObject({
				zIndex: parts.cards.length - i,
				width: CARD_W,
				height: CARD_H,
				x: [offscreenX, x],
				y: [y, y],
				rotate: [rotate, rotate],
				opacity: [1, 1],
			});
			expect(finalOf(parts.faces[i])).toMatchObject({ opacity: 1 });
			expect(finalOf(parts.chipFaces[k])).toEqual({ opacity: 0 });
		});
	});
});
