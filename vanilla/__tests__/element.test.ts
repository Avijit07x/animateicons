import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineIcons, type AnimateIconsElement } from "../src/element";
import { BELL, callsFor, resetMotion, TRASH } from "./fixtures";

vi.mock("motion", async () => (await import("./fixtures")).motionModule);

beforeEach(resetMotion);

afterEach(() => {
	document.body.replaceChildren();
});

const mount = (html: string) => {
	document.body.innerHTML = html;
	return document.body.firstElementChild as AnimateIconsElement;
};

describe("<animate-icons>", () => {
	it("renders a registered icon with its attributes", () => {
		defineIcons({ BELL });
		const element = mount(
			'<animate-icons name="bell" size="32" color="red"></animate-icons>',
		);
		const svg = element.querySelector("svg");
		expect(svg?.getAttribute("width")).toBe("32");
		expect(element.style.color).toBe("red");
		expect(element.style.display).toBe("inline-flex");
	});

	it("accepts an array of icons and picks a library when asked", () => {
		const hugeBell = {
			...BELL,
			library: "huge" as const,
			attrs: { viewBox: "0 0 20 20" },
		};
		defineIcons([BELL, hugeBell]);
		const lucide = mount('<animate-icons name="bell"></animate-icons>');
		expect(lucide.querySelector("svg")?.getAttribute("viewBox")).toBe(
			"0 0 24 24",
		);
		const huge = mount(
			'<animate-icons name="bell" library="huge"></animate-icons>',
		);
		expect(huge.querySelector("svg")?.getAttribute("viewBox")).toBe(
			"0 0 20 20",
		);
	});

	it("waits for icons registered later", () => {
		const element = mount('<animate-icons name="trash-2"></animate-icons>');
		expect(element.querySelector("svg")).toBeNull();
		defineIcons([TRASH]);
		expect(element.querySelector("svg")).not.toBeNull();
	});

	it("re-renders when an attribute changes", () => {
		defineIcons([BELL]);
		const element = mount('<animate-icons name="bell"></animate-icons>');
		element.setAttribute("size", "48");
		expect(element.querySelector("svg")?.getAttribute("width")).toBe("48");
	});

	it("exposes startAnimation and stopAnimation, even with hover turned off", () => {
		defineIcons([BELL]);
		const element = mount(
			'<animate-icons name="bell" is-animated="false"></animate-icons>',
		);
		const svg = element.querySelector("svg") as Element;
		element.dispatchEvent(new MouseEvent("mouseenter"));
		expect(callsFor(svg)).toHaveLength(0);
		element.startAnimation();
		expect(callsFor(svg).at(-1)?.values).toEqual({
			rotate: [0, -12, 10.2, -6, 3, 0],
		});
		element.stopAnimation();
		expect(callsFor(svg).at(-1)?.values).toEqual({ rotate: 0 });
	});

	it("cleans up when removed from the page", () => {
		defineIcons([BELL]);
		const element = mount('<animate-icons name="bell"></animate-icons>');
		element.remove();
		expect(element.querySelector("svg")).toBeNull();
	});
});
