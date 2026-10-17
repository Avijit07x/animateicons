import { afterEach, describe, expect, it } from "vitest";
import { createApp, h, type App } from "vue";
import { BellIcon } from "../src/generated/lucide";

let app: App | undefined;

afterEach(() => {
	app?.unmount();
	document.body.replaceChildren();
});

const settle = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

describe("hover with the real player", () => {
	it("rotates the bell while hovered and returns it to rest after", async () => {
		const container = document.createElement("div");
		document.body.append(container);
		app = createApp({ render: () => h(BellIcon, { duration: 0.5 }) });
		app.mount(container);
		const span = container.querySelector("span") as HTMLElement;
		const svg = span.querySelector("svg") as SVGSVGElement;

		span.dispatchEvent(new MouseEvent("mouseenter"));
		await settle(120);
		expect(svg.style.transform).toMatch(/rotate\(-?\d/);

		span.dispatchEvent(new MouseEvent("mouseleave"));
		await settle(900);
		expect(svg.style.transform).toBe("none");
	});
});
