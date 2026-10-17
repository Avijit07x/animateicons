import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp, h, nextTick, ref, type App } from "vue";
import { AnimateIcons } from "../src";
import { Bell, BellIcon, Heart } from "../src/generated/lucide";

const attached = vi.hoisted(
	() =>
		[] as {
			host: Element;
			svg: Element;
			options: Record<string, unknown>;
			mounted: Record<
				"startAnimation" | "stopAnimation" | "destroy",
				() => void
			>;
		}[],
);

vi.mock("@animateicons/vanilla", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@animateicons/vanilla")>();
	return {
		...actual,
		attachIcon: (
			host: Element,
			svg: Element,
			_icon: unknown,
			options: Record<string, unknown>,
		) => {
			const mounted = {
				startAnimation: vi.fn(),
				stopAnimation: vi.fn(),
				destroy: vi.fn(),
			};
			attached.push({ host, svg, options, mounted });
			return mounted;
		},
	};
});

let app: App | undefined;
let container: HTMLElement;

beforeEach(() => {
	attached.length = 0;
	container = document.createElement("div");
	document.body.append(container);
});

afterEach(() => {
	app?.unmount();
	app = undefined;
	container.remove();
});

const render = (component: () => ReturnType<typeof h>) => {
	app = createApp({ render: component });
	app.mount(container);
};

describe("icon components", () => {
	it("wrap the svg in a relative inline-flex span at 24px by default", () => {
		render(() => h(BellIcon));
		const span = container.querySelector("span") as HTMLElement;
		expect(span.style.position).toBe("relative");
		expect(span.style.display).toBe("inline-flex");
		expect(span.querySelector("svg")?.getAttribute("width")).toBe("24");
		expect(attached.at(-1)?.options).toEqual({ duration: 1, isAnimated: true });
		expect(attached.at(-1)?.host).toBe(span);
	});

	it("pass size, color, duration and isAnimated through", () => {
		render(() =>
			h(BellIcon, {
				size: 40,
				color: "tomato",
				duration: 2,
				isAnimated: false,
			}),
		);
		const span = container.querySelector("span") as HTMLElement;
		expect(span.style.color).toBe("tomato");
		expect(span.querySelector("svg")?.getAttribute("height")).toBe("40");
		expect(attached.at(-1)?.options).toEqual({
			duration: 2,
			isAnimated: false,
		});
	});

	it("expose startAnimation and stopAnimation on the ref", () => {
		const icon = ref<InstanceType<typeof BellIcon>>();
		render(() => h(BellIcon, { ref: icon }));
		icon.value?.startAnimation();
		icon.value?.stopAnimation();
		const { mounted } = attached.at(-1)!;
		expect(mounted.startAnimation).toHaveBeenCalledOnce();
		expect(mounted.stopAnimation).toHaveBeenCalledOnce();
	});

	it("re-attach with the new options when a prop changes", async () => {
		const size = ref(24);
		render(() => h(BellIcon, { size: size.value }));
		const first = attached.at(-1)!;
		size.value = 48;
		await nextTick();
		expect(first.mounted.destroy).toHaveBeenCalledOnce();
		expect(attached.at(-1)?.svg.getAttribute("width")).toBe("48");
	});

	it("swap the whole svg when AnimateIcons gets a different icon", async () => {
		const icon = ref(Bell);
		render(() => h(AnimateIcons, { icon: icon.value }));
		const bellSvg = attached.at(-1)!.svg;
		icon.value = Heart;
		await nextTick();
		expect(attached.at(-1)?.svg).not.toBe(bellSvg);
		expect(container.querySelectorAll("svg")).toHaveLength(1);
	});

	it("clean up when unmounted", () => {
		render(() => h(BellIcon));
		const { mounted } = attached.at(-1)!;
		app?.unmount();
		app = undefined;
		expect(mounted.destroy).toHaveBeenCalledOnce();
	});
});
