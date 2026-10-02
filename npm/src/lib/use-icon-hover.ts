import { useId, useMemo, type RefObject, type SyntheticEvent } from "react";
import type { IconHandle } from "./icon-handle";

export type IconTrigger = "hover" | "click" | "both";

export type IconConfig = {
	icon: string;
	trigger: IconTrigger;
};

export type IconTriggerProps = {
	onMouseEnter?: (event?: SyntheticEvent<HTMLElement>) => void;
	onMouseLeave?: (event?: SyntheticEvent<HTMLElement>) => void;
	onClick?: (event?: SyntheticEvent<HTMLElement>) => void;
};

type IconRef = RefObject<IconHandle | null>;

export type IconRefProps = {
	ref: IconRef;
	"data-animateicon": string;
};

type SingleOptions = {
	trigger?: IconTrigger;
};

type ConfigOptions<C extends readonly IconConfig[]> = {
	trigger: C;
};

type SingleResult = {
	ref: IconRef;
	triggerProps: IconTriggerProps;
};

type ConfigResult<C extends readonly IconConfig[]> = {
	icon: { [K in C[number]["icon"]]: IconRefProps };
	trigger: IconTriggerProps;
};

const MARKER = "data-animateicon";
const TRIGGERS: readonly string[] = ["hover", "click", "both"];
const OPTION_KEYS: readonly string[] = ["trigger"];
const ENTRY_KEYS: readonly string[] = ["icon", "trigger"];

const isTrigger = (value: unknown): value is IconTrigger =>
	typeof value === "string" && TRIGGERS.includes(value);

const isObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const show = (value: unknown) => {
	if (typeof value === "string") return JSON.stringify(value);
	try {
		return String(value);
	} catch {
		return Object.prototype.toString.call(value);
	}
};

const resolve = (options: unknown) => {
	if (!isObject(options)) {
		throw new TypeError(
			`useIconHover: options must be an object like { trigger: "click" }, received ${show(options)}.`,
		);
	}

	const unknownOption = Object.keys(options).find(
		(key) => !OPTION_KEYS.includes(key),
	);
	if (unknownOption !== undefined) {
		throw new TypeError(
			`useIconHover: unknown option "${unknownOption}". The only option is "trigger".`,
		);
	}

	const { trigger = "hover" } = options;

	if (isTrigger(trigger)) {
		return { list: false, entries: [{ icon: "", trigger }] as IconConfig[] };
	}

	if (!Array.isArray(trigger)) {
		throw new TypeError(
			`useIconHover: "trigger" must be "hover", "click", "both" or a list like [{ icon: "bell", trigger: "click" }], received ${show(trigger)}.`,
		);
	}

	if (trigger.length === 0) {
		throw new RangeError('useIconHover: "trigger" must not be an empty list.');
	}

	const seen = new Set<string>();

	const entries = trigger.map((entry: unknown, index: number): IconConfig => {
		const label = `trigger[${index}]`;

		if (!isObject(entry)) {
			throw new TypeError(
				`useIconHover: ${label} must be an object like { icon: "bell", trigger: "click" }, received ${show(entry)}.`,
			);
		}

		const unknownKey = Object.keys(entry).find(
			(key) => !ENTRY_KEYS.includes(key),
		);
		if (unknownKey !== undefined) {
			throw new TypeError(
				`useIconHover: ${label} has an unknown key "${unknownKey}". Valid keys are "icon" and "trigger".`,
			);
		}

		if (typeof entry.icon !== "string" || entry.icon === "") {
			throw new TypeError(
				`useIconHover: ${label}.icon must be a non-empty string, received ${show(entry.icon)}.`,
			);
		}

		if (!isTrigger(entry.trigger)) {
			throw new TypeError(
				`useIconHover: ${label}.trigger must be "hover", "click" or "both", received ${show(entry.trigger)}.`,
			);
		}

		if (seen.has(entry.icon)) {
			throw new TypeError(
				`useIconHover: the icon ${show(entry.icon)} appears more than once in "trigger". Each icon name must be unique.`,
			);
		}
		seen.add(entry.icon);

		return { icon: entry.icon, trigger: entry.trigger };
	});

	return { list: true, entries };
};

const schedule = (callback: () => void) => {
	if (typeof requestAnimationFrame === "function") {
		requestAnimationFrame(callback);
	} else {
		setTimeout(callback, 0);
	}
};

const scopeOf = (event?: SyntheticEvent<HTMLElement>) => {
	const element = event?.currentTarget;
	return element && typeof element.querySelectorAll === "function"
		? element
		: undefined;
};

const markersIn = (scope: HTMLElement) => {
	const found = new Set<string>();
	const own = scope.getAttribute(MARKER);
	if (own) found.add(own);
	scope.querySelectorAll(`[${MARKER}]`).forEach((element) => {
		const value = element.getAttribute(MARKER);
		if (value) found.add(value);
	});
	return found;
};

const onHover = (mode: IconTrigger) => mode !== "click";
const onClick = (mode: IconTrigger) => mode !== "hover";

export function useIconHover(options?: SingleOptions): SingleResult;
export function useIconHover<const C extends readonly IconConfig[]>(
	options: ConfigOptions<C>,
): ConfigResult<C>;
export function useIconHover(options: unknown = {}): unknown {
	const { list, entries } = resolve(options);
	const id = useId();
	const key = JSON.stringify(entries);

	return useMemo(() => {
		const targets = (JSON.parse(key) as IconConfig[]).map((entry) => ({
			...entry,
			marker: `${id}:${entry.icon}`,
			ref: { current: null } as IconRef,
		}));

		const play = (
			plays: (mode: IconTrigger) => boolean,
			action: (handle: IconHandle) => void,
			scope?: HTMLElement,
		) => {
			const inside = scope ? markersIn(scope) : undefined;
			targets.forEach(({ icon, marker, trigger, ref }) => {
				const handle = ref.current;
				if (!handle || !plays(trigger)) return;
				if (inside && !inside.has(marker)) return;
				if (
					typeof handle.startAnimation !== "function" ||
					typeof handle.stopAnimation !== "function"
				) {
					throw new TypeError(
						`useIconHover: ${list ? `icon.${icon}` : "ref"} is attached to something that is not an AnimateIcons icon. Pass it to an icon component.`,
					);
				}
				action(handle);
			});
		};

		const scoped = (event?: SyntheticEvent<HTMLElement>) =>
			list ? scopeOf(event) : undefined;

		const props: IconTriggerProps = {};

		if (targets.some(({ trigger }) => onHover(trigger))) {
			props.onMouseEnter = (event) =>
				play(onHover, (handle) => handle.startAnimation(), scoped(event));
			props.onMouseLeave = (event) =>
				play(onHover, (handle) => handle.stopAnimation(), scoped(event));
		}

		if (targets.some(({ trigger }) => onClick(trigger))) {
			props.onClick = (event) => {
				const scope = scoped(event);
				schedule(() =>
					play(onClick, (handle) => handle.startAnimation(), scope),
				);
			};
		}

		if (!list) return { ref: targets[0].ref, triggerProps: props };

		return {
			icon: Object.fromEntries(
				targets.map(({ icon, marker, ref }) => [
					icon,
					{ ref, [MARKER]: marker },
				]),
			),
			trigger: props,
		};
	}, [key, list, id]);
}
