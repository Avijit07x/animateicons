import {
	useIconHover,
	type IconConfig,
	type IconTrigger,
} from "@/npm/src/lib/use-icon-hover";
import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";

type Handle = {
	startAnimation: ReturnType<typeof vi.fn>;
	stopAnimation: ReturnType<typeof vi.fn>;
};

const handle = (): Handle => ({
	startAnimation: vi.fn(),
	stopAnimation: vi.fn(),
});

const asIcon = (value: Handle) =>
	value as unknown as Parameters<typeof attach>[1];

const attach = (ref: { current: unknown }, value: unknown) => {
	ref.current = value;
};

const frames = () => {
	const queue: FrameRequestCallback[] = [];
	vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
		queue.push(cb);
		return queue.length;
	});
	return () => queue.splice(0).forEach((cb) => cb(0));
};

const keys = (props: object) => Object.keys(props).sort();

const calls = (value: Handle, kind: "start" | "stop") =>
	(kind === "start" ? value.startAnimation : value.stopAnimation).mock.calls
		.length;

const mountSingle = (options?: { trigger?: IconTrigger }) => {
	const { result, rerender } = renderHook(
		(props?: { trigger?: IconTrigger }) => useIconHover(props),
		{ initialProps: options },
	);
	const icon = handle();
	attach(result.current.ref, asIcon(icon));
	return { result, rerender, icon };
};

const mountConfig = (config: readonly IconConfig[]) => {
	const { result, rerender } = renderHook(
		(entries: readonly IconConfig[]) => useIconHover({ trigger: entries }),
		{ initialProps: config },
	);
	const icons: Record<string, Handle> = {};
	for (const { icon } of config) {
		icons[icon] = handle();
		attach(result.current.icon[icon].ref, asIcon(icons[icon]));
	}
	return { result, rerender, icons };
};

const fails = (options: unknown) => {
	vi.spyOn(console, "error").mockImplementation(() => {});
	return () => renderHook(() => useIconHover(options as never));
};

afterEach(() => {
	vi.useRealTimers();
	vi.unstubAllGlobals();
});

describe("useIconHover with a single trigger", () => {
	it("plays on hover and stops on leave by default", () => {
		const { result, icon } = mountSingle();

		result.current.triggerProps.onMouseEnter?.();
		result.current.triggerProps.onMouseLeave?.();

		expect(calls(icon, "start")).toBe(1);
		expect(calls(icon, "stop")).toBe(1);
		expect(result.current.triggerProps.onClick).toBeUndefined();
	});

	it("click wires only the click handler, one frame later", () => {
		const { result, icon } = mountSingle({ trigger: "click" });
		const flush = frames();

		expect(keys(result.current.triggerProps)).toEqual(["onClick"]);

		result.current.triggerProps.onClick?.();
		expect(calls(icon, "start")).toBe(0);
		flush();

		expect(calls(icon, "start")).toBe(1);
		expect(calls(icon, "stop")).toBe(0);
	});

	it("both wires hover and click", () => {
		const { result, icon } = mountSingle({ trigger: "both" });
		const flush = frames();

		expect(keys(result.current.triggerProps)).toEqual([
			"onClick",
			"onMouseEnter",
			"onMouseLeave",
		]);

		result.current.triggerProps.onMouseEnter?.();
		result.current.triggerProps.onClick?.();
		flush();
		result.current.triggerProps.onMouseLeave?.();

		expect(calls(icon, "start")).toBe(2);
		expect(calls(icon, "stop")).toBe(1);
	});

	it("does nothing before the icon mounts or after it unmounts", () => {
		const { result, icon } = mountSingle({ trigger: "both" });
		const flush = frames();

		result.current.triggerProps.onClick?.();
		attach(result.current.ref, null);

		expect(flush).not.toThrow();
		expect(() => result.current.triggerProps.onMouseEnter?.()).not.toThrow();
		expect(calls(icon, "start")).toBe(0);
	});

	it("falls back to setTimeout when requestAnimationFrame is missing", () => {
		vi.useFakeTimers();
		vi.stubGlobal("requestAnimationFrame", undefined);
		const { result, icon } = mountSingle({ trigger: "click" });

		result.current.triggerProps.onClick?.();
		expect(calls(icon, "start")).toBe(0);
		vi.runAllTimers();

		expect(calls(icon, "start")).toBe(1);
	});
});

describe("useIconHover with a config list", () => {
	const config = [
		{ icon: "bell", trigger: "click" },
		{ icon: "heart", trigger: "hover" },
		{ icon: "star", trigger: "both" },
	] as const;

	it("returns props per icon name and one trigger object", () => {
		const { result } = mountConfig(config);

		expect(keys(result.current)).toEqual(["icon", "trigger"]);
		expect(keys(result.current.icon)).toEqual(["bell", "heart", "star"]);
		expect(keys(result.current.icon.bell)).toEqual(["data-animateicon", "ref"]);
		expect(result.current.icon.bell.ref).not.toBe(
			result.current.icon.heart.ref,
		);
	});

	it("marks every icon with a name that is unique per hook call", () => {
		const first = mountConfig(config).result.current;
		const second = mountConfig(config).result.current;
		const markers = [first, second].flatMap((hook) =>
			Object.values(hook.icon).map((props) => props["data-animateicon"]),
		);

		expect(new Set(markers).size).toBe(6);
		expect(first.icon.bell["data-animateicon"]).toMatch(/:bell$/);
	});

	it("hover plays the hover and both icons only, and stops them on leave", () => {
		const { result, icons } = mountConfig(config);

		result.current.trigger.onMouseEnter?.();
		result.current.trigger.onMouseLeave?.();

		expect(calls(icons.heart, "start")).toBe(1);
		expect(calls(icons.star, "start")).toBe(1);
		expect(calls(icons.bell, "start")).toBe(0);
		expect(calls(icons.heart, "stop")).toBe(1);
		expect(calls(icons.star, "stop")).toBe(1);
		expect(calls(icons.bell, "stop")).toBe(0);
	});

	it("click plays the click and both icons only, one frame later", () => {
		const { result, icons } = mountConfig(config);
		const flush = frames();

		result.current.trigger.onClick?.();
		expect(calls(icons.bell, "start")).toBe(0);
		flush();

		expect(calls(icons.bell, "start")).toBe(1);
		expect(calls(icons.star, "start")).toBe(1);
		expect(calls(icons.heart, "start")).toBe(0);
		expect(calls(icons.bell, "stop")).toBe(0);
	});

	it("only wires the handlers some icon needs", () => {
		const clickOnly = mountConfig([
			{ icon: "a", trigger: "click" },
			{ icon: "b", trigger: "click" },
		]);
		const hoverOnly = mountConfig([
			{ icon: "a", trigger: "hover" },
			{ icon: "b", trigger: "hover" },
		]);

		expect(keys(clickOnly.result.current.trigger)).toEqual(["onClick"]);
		expect(keys(hoverOnly.result.current.trigger)).toEqual([
			"onMouseEnter",
			"onMouseLeave",
		]);
	});

	it("handles several icons in one element, like an add to cart button", () => {
		const { result, icons } = mountConfig([
			{ icon: "cart", trigger: "click" },
			{ icon: "sparkles", trigger: "hover" },
			{ icon: "check", trigger: "both" },
		]);
		const flush = frames();

		result.current.trigger.onMouseEnter?.();
		result.current.trigger.onClick?.();
		flush();

		expect(calls(icons.cart, "start")).toBe(1);
		expect(calls(icons.sparkles, "start")).toBe(1);
		expect(calls(icons.check, "start")).toBe(2);
	});

	it("skips icons that are not mounted and keeps the others playing", () => {
		const { result, icons } = mountConfig([
			{ icon: "a", trigger: "hover" },
			{ icon: "b", trigger: "hover" },
		]);
		attach(result.current.icon.a.ref, null);

		result.current.trigger.onMouseEnter?.();

		expect(calls(icons.a, "start")).toBe(0);
		expect(calls(icons.b, "start")).toBe(1);
	});

	it("accepts icon names that clash with object built-ins", () => {
		const { result, icons } = mountConfig([
			{ icon: "constructor", trigger: "hover" },
			{ icon: "toString", trigger: "hover" },
			{ icon: "__proto__", trigger: "hover" },
		]);

		expect(Object.keys(result.current.icon).sort()).toEqual([
			"__proto__",
			"constructor",
			"toString",
		]);
		result.current.trigger.onMouseEnter?.();
		for (const name of ["constructor", "toString", "__proto__"]) {
			expect(calls(icons[name], "start")).toBe(1);
		}
	});

	it("types the ref names from the config", () => {
		const { result } = renderHook(() =>
			useIconHover({
				trigger: [
					{ icon: "bell", trigger: "click" },
					{ icon: "heart", trigger: "hover" },
				],
			}),
		);

		expectTypeOf(result.current.icon).toHaveProperty("bell");
		expectTypeOf(result.current.icon).toHaveProperty("heart");
		expectTypeOf(result.current.icon).not.toHaveProperty("hart");
		expectTypeOf(result.current).toHaveProperty("trigger");
		expectTypeOf(result.current).not.toHaveProperty("triggerProps");
		expectTypeOf(result.current).not.toHaveProperty("ref");
	});

	it("accepts a config kept in a constant", () => {
		const shared = [
			{ icon: "bell", trigger: "click" },
			{ icon: "heart", trigger: "hover" },
		] as const;
		const { result } = renderHook(() => useIconHover({ trigger: shared }));

		expectTypeOf(result.current.icon).toHaveProperty("bell");
		expect(keys(result.current.icon)).toEqual(["bell", "heart"]);
	});
});

describe("useIconHover errors", () => {
	it("rejects options that are not an object", () => {
		for (const options of [null, "click", 3, ["hover"]]) {
			expect(fails(options)).toThrow(TypeError);
			expect(fails(options)).toThrow(/options must be an object/);
		}
	});

	it("rejects unknown options", () => {
		expect(fails({ trigers: "click" })).toThrow(/unknown option "trigers"/);
		expect(fails({ icons: 2 })).toThrow(/unknown option "icons"/);
	});

	it("rejects a trigger that is not a trigger or a list", () => {
		for (const trigger of ["tap", 5, null, true, {}]) {
			expect(fails({ trigger })).toThrow(TypeError);
			expect(fails({ trigger })).toThrow(/"trigger" must be "hover"/);
		}
	});

	it("rejects an empty list", () => {
		expect(fails({ trigger: [] })).toThrow(RangeError);
		expect(fails({ trigger: [] })).toThrow(/must not be an empty list/);
	});

	it("names the entry when it is not an object", () => {
		expect(fails({ trigger: ["bell"] })).toThrow(
			/trigger\[0\] must be an object like/,
		);
		expect(fails({ trigger: [null] })).toThrow(TypeError);
	});

	it("names the unknown key in an entry", () => {
		expect(fails({ trigger: [{ icon: "bell", triger: "click" }] })).toThrow(
			/trigger\[0\] has an unknown key "triger"/,
		);
	});

	it("names the entry when the icon name is missing or empty", () => {
		expect(fails({ trigger: [{ trigger: "click" }] })).toThrow(
			/trigger\[0\]\.icon must be a non-empty string/,
		);
		expect(fails({ trigger: [{ icon: "", trigger: "click" }] })).toThrow(
			/trigger\[0\]\.icon must be a non-empty string/,
		);
		expect(fails({ trigger: [{ icon: 4, trigger: "click" }] })).toThrow(
			TypeError,
		);
	});

	it("names the entry when its trigger is invalid", () => {
		expect(
			fails({
				trigger: [
					{ icon: "bell", trigger: "click" },
					{ icon: "heart", trigger: "tap" },
				],
			}),
		).toThrow(
			/trigger\[1\]\.trigger must be "hover", "click" or "both", received "tap"/,
		);
	});

	it("rejects duplicate icon names", () => {
		expect(
			fails({
				trigger: [
					{ icon: "bell", trigger: "click" },
					{ icon: "bell", trigger: "hover" },
				],
			}),
		).toThrow(/the icon "bell" appears more than once/);
	});

	it("keeps validating on every render, not just the first", () => {
		vi.spyOn(console, "error").mockImplementation(() => {});
		const { rerender } = renderHook(
			(props: unknown) => useIconHover(props as never),
			{ initialProps: { trigger: "click" } as unknown },
		);

		expect(() => rerender({ trigger: "tap" })).toThrow(TypeError);
	});

	it("throws a clear error when the single ref is attached to something that is not an icon", () => {
		const { result } = mountSingle({ trigger: "both" });
		attach(result.current.ref, document.createElement("div"));

		expect(() => result.current.triggerProps.onMouseEnter?.()).toThrow(
			/useIconHover: ref is attached to something that is not an AnimateIcons icon/,
		);
	});

	it("names the icon when a config ref is attached to something that is not an icon", () => {
		const { result } = mountConfig([{ icon: "heart", trigger: "hover" }]);
		attach(result.current.icon.heart.ref, document.createElement("div"));

		expect(() => result.current.trigger.onMouseEnter?.()).toThrow(
			/useIconHover: icon\.heart is attached to something that is not an AnimateIcons icon/,
		);
	});

	it("only checks the icons that the event plays", () => {
		const { result } = mountConfig([
			{ icon: "bell", trigger: "click" },
			{ icon: "heart", trigger: "hover" },
		]);
		attach(result.current.icon.bell.ref, document.createElement("div"));

		expect(() => result.current.trigger.onMouseEnter?.()).not.toThrow();
	});
});

describe("useIconHover caching", () => {
	const config: IconConfig[] = [
		{ icon: "bell", trigger: "click" },
		{ icon: "heart", trigger: "hover" },
	];

	it("returns the same objects while the config is unchanged, even with a new list each render", () => {
		const { result, rerender } = mountConfig(config);
		const first = result.current;

		rerender(config.map((entry) => ({ ...entry })));
		rerender(config.map((entry) => ({ ...entry })));

		expect(result.current).toBe(first);
		expect(result.current.icon).toBe(first.icon);
		expect(result.current.trigger).toBe(first.trigger);
		expect(result.current.trigger.onClick).toBe(first.trigger.onClick);
	});

	it("keeps the same single-trigger objects for equivalent options", () => {
		const { result, rerender } = mountSingle();
		const first = result.current;

		rerender({});
		rerender({ trigger: "hover" });

		expect(result.current).toBe(first);
	});

	it("builds new handlers when a trigger changes", () => {
		const { result, rerender } = mountSingle({ trigger: "hover" });
		const first = result.current;

		rerender({ trigger: "click" });

		expect(result.current).not.toBe(first);
		expect(keys(result.current.triggerProps)).toEqual(["onClick"]);
	});

	it("hands out working refs when the config changes", () => {
		const { result, rerender } = mountConfig(config);
		const first = result.current;

		rerender([
			{ icon: "bell", trigger: "click" },
			{ icon: "heart", trigger: "hover" },
			{ icon: "star", trigger: "both" },
		]);

		expect(result.current).not.toBe(first);
		expect(keys(result.current.icon)).toEqual(["bell", "heart", "star"]);
		const star = handle();
		attach(result.current.icon.star.ref, asIcon(star));
		result.current.trigger.onMouseEnter?.();
		expect(calls(star, "start")).toBe(1);
	});
});
