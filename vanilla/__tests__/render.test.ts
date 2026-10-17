import { describe, expect, it } from "vitest";
import { renderIcon, restingAttributes } from "../src/render";
import type { IconData } from "../src/types";
import { BELL, TRASH } from "./fixtures";

describe("renderIcon", () => {
	it("renders at 24px by default and at the requested size", () => {
		expect(renderIcon(BELL).getAttribute("width")).toBe("24");
		const large = renderIcon(BELL, 64);
		expect(large.getAttribute("width")).toBe("64");
		expect(large.getAttribute("height")).toBe("64");
	});

	it("copies every attribute and child from the icon data", () => {
		const svg = renderIcon(BELL);
		expect(svg.namespaceURI).toBe("http://www.w3.org/2000/svg");
		expect(svg.getAttribute("viewBox")).toBe("0 0 24 24");
		expect(svg.getAttribute("stroke-width")).toBe("2");
		expect(svg.children).toHaveLength(2);
		expect(svg.children[0].getAttribute("d")).toBe(BELL.children?.[0].attrs?.d);
	});

	it("writes static styles, turning originX and originY into transform-origin", () => {
		expect(renderIcon(BELL).getAttribute("style")).toBe(
			"transform-origin: top center",
		);
		const group = renderIcon(TRASH).children[0];
		expect(group.getAttribute("style")).toBe(
			"transform-box: view-box; transform-origin: 3px 6px",
		);
	});

	it("draws the resting state so the first frame matches React", () => {
		const attributes = restingAttributes({
			tag: "path",
			normal: { scale: 0.6, opacity: 0, rotate: [0, 12] },
		});
		expect(attributes.style).toBe(
			"transform-origin: 50% 50%; transform: scale(0.6) rotate(12deg); transform-box: fill-box; opacity: 0",
		);
		expect(
			restingAttributes({
				tag: "path",
				normal: { pathLength: 0, pathOffset: 0.6 },
			}),
		).toEqual({
			pathLength: "1",
			"stroke-dasharray": "0 1",
			"stroke-dashoffset": "-0.6",
		});
	});

	it("gives every rendered copy its own ids", () => {
		const clipped: IconData = {
			name: "clip",
			library: "lucide",
			tag: "svg",
			children: [
				{
					tag: "clipPath",
					attrs: { id: "lucide-clip-0" },
					children: [{ tag: "rect" }],
				},
				{ tag: "g", attrs: { "clip-path": "url(#lucide-clip-0)" } },
			],
		};
		const [first, second] = [renderIcon(clipped), renderIcon(clipped)];
		const id = (svg: SVGSVGElement) => svg.children[0].getAttribute("id");
		expect(id(first)).not.toBe(id(second));
		expect(first.children[1].getAttribute("clip-path")).toBe(
			`url(#${id(first)})`,
		);
	});

	it("leaves elements at their identity state unstyled", () => {
		expect(
			restingAttributes({ tag: "path", normal: { x: 0, rotate: 0 } }).style,
		).toBeUndefined();
		expect(renderIcon(BELL).children[1].hasAttribute("style")).toBe(false);
	});
});
