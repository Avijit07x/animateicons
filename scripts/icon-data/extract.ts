import {
	Children,
	createElement,
	Fragment,
	isValidElement,
	type ComponentType,
	type ReactElement,
	type ReactNode,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
	hasTransform,
	ORIGIN_PROPERTIES,
	TRANSFORM_PROPERTIES,
} from "../../vanilla/src/motion-properties";
import type {
	IconData,
	IconLibrary,
	IconNode,
	MotionTarget,
	MotionValues,
} from "../../vanilla/src/types";
import { ANIMATION_CONTROLS, motionTagOf, takeCapturedTree } from "./recorder";

const ANIMATED_PROPERTIES = new Set([
	...TRANSFORM_PROPERTIES,
	...ORIGIN_PROPERTIES,
	"opacity",
	"pathLength",
	"pathOffset",
	"strokeDashoffset",
	"strokeDasharray",
	"strokeWidth",
]);

const TRANSITION_OPTIONS = new Set([
	"duration",
	"delay",
	"ease",
	"times",
	"repeat",
	"repeatType",
	"repeatDelay",
]);

const TIMING_OPTIONS = new Set(["duration", "delay", "repeatDelay"]);

const STYLE_PROPERTIES = new Set([
	"transformBox",
	"originX",
	"originY",
	"transformOrigin",
	"overflow",
]);

const VARIANT_LABELS = ["normal", "animate"] as const;

const MOTION_PROPS = new Set(["variants", "animate", "initial", "custom"]);

const CAMEL_CASE_ATTRIBUTES = new Set([
	"viewBox",
	"preserveAspectRatio",
	"pathLength",
	"gradientUnits",
	"gradientTransform",
	"clipPathUnits",
	"maskUnits",
	"maskContentUnits",
	"patternUnits",
	"patternContentUnits",
	"patternTransform",
]);

const ROOT_SIZE_ATTRIBUTES = new Set(["width", "height"]);

class IconDataError extends Error {}

export interface IconSource {
	library: IconLibrary;
	name: string;
	exportName: string;
	component: ComponentType<{ duration?: number }>;
}

export interface ExtractedIcon {
	library: IconLibrary;
	name: string;
	exportName: string;
	data: IconData;
	stillParts: string[];
}

type VariantContext = "animated" | "still" | "none";

const fail = (path: string, message: string): never => {
	throw new IconDataError(`${path}: ${message}`);
};

const toAttributeName = (prop: string) =>
	prop === "className"
		? "class"
		: CAMEL_CASE_ATTRIBUTES.has(prop)
			? prop
			: prop.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

const isPlainObject = (value: unknown): value is MotionValues =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const childElements = (children: ReactNode, path: string): ReactElement[] =>
	Children.toArray(children).flatMap((child) => {
		if (isValidElement(child)) {
			return child.type === Fragment
				? childElements(
						(child.props as { children?: ReactNode }).children,
						path,
					)
				: [child];
		}
		if (typeof child === "string" && child.trim() === "") return [];
		return fail(path, `text content is not supported (${String(child)})`);
	});

const tagOf = (element: ReactElement, path: string): string =>
	typeof element.type === "string"
		? element.type
		: (motionTagOf(element.type) ??
			fail(path, "custom components are not supported inside an icon"));

const findSvg = (node: ReactNode, path: string): ReactElement | undefined => {
	for (const element of childElements(node, path)) {
		if (tagOf(element, path) === "svg") return element;
		const props = element.props as { children?: ReactNode };
		const nested = findSvg(props.children, path);
		if (nested) return nested;
	}
	return undefined;
};

const checkTransition = (transition: unknown, path: string, nested = false) => {
	if (!isPlainObject(transition))
		return fail(path, "transition must be an object");
	for (const [key, value] of Object.entries(transition)) {
		if (TRANSITION_OPTIONS.has(key)) continue;
		if (!nested && ANIMATED_PROPERTIES.has(key)) {
			checkTransition(value, `${path}.${key}`, true);
			continue;
		}
		fail(path, `unsupported transition option "${key}"`);
	}
};

const checkTarget = (target: unknown, path: string): MotionTarget => {
	if (!isPlainObject(target)) return fail(path, "variant must be an object");
	for (const [key, value] of Object.entries(target)) {
		if (key === "transition") checkTransition(value, `${path}.transition`);
		else if (!ANIMATED_PROPERTIES.has(key)) {
			fail(path, `unsupported animated property "${key}"`);
		}
	}
	return target;
};

const resolveVariants = (
	variants: unknown,
	custom: unknown,
	path: string,
): Pick<IconNode, "normal" | "animate"> => {
	if (!isPlainObject(variants)) return fail(path, "variants must be an object");
	const extra = Object.keys(variants).filter(
		(label) => !(VARIANT_LABELS as readonly string[]).includes(label),
	);
	if (extra.length)
		fail(path, `unsupported variant labels: ${extra.join(", ")}`);
	const [normal, animate] = VARIANT_LABELS.map((label) => {
		const variant = variants[label];
		if (variant === undefined) return fail(path, `missing "${label}" variant`);
		const target = typeof variant === "function" ? variant(custom) : variant;
		return checkTarget(target, `${path}.${label}`);
	});
	return { normal, animate };
};

const toStyle = (style: unknown, path: string) => {
	if (style === undefined) return {};
	if (!isPlainObject(style)) return fail(path, "style must be an object");
	for (const [key, value] of Object.entries(style)) {
		if (!STYLE_PROPERTIES.has(key)) fail(path, `unsupported style "${key}"`);
		if (typeof value !== "string" && typeof value !== "number") {
			fail(path, `style "${key}" must be a string or number`);
		}
	}
	return { ...style } as Record<string, string | number>;
};

const toNode = (
	element: ReactElement,
	path: string,
	isRoot: boolean,
	inherited: VariantContext,
	stillParts: string[],
): IconNode => {
	const tag = tagOf(element, path);
	const props = element.props as Record<string, unknown>;
	const node: IconNode = { tag };
	const attrs: Record<string, string | number> = {};

	for (const [prop, value] of Object.entries(props)) {
		if (prop === "children" || prop === "style" || MOTION_PROPS.has(prop)) {
			continue;
		}
		if (isRoot && ROOT_SIZE_ATTRIBUTES.has(prop)) continue;
		if (/^(on|while)[A-Z]/.test(prop) || prop === "transition") {
			fail(path, `unsupported prop "${prop}"`);
		}
		if (typeof value !== "string" && typeof value !== "number") {
			fail(path, `attribute "${prop}" must be a string or number`);
		}
		attrs[toAttributeName(prop)] = value as string | number;
	}
	if (Object.keys(attrs).length) node.attrs = attrs;

	if (props.animate !== undefined && props.animate !== ANIMATION_CONTROLS) {
		fail(path, "animate must be animation controls");
	}
	if (props.initial !== undefined && props.initial !== "normal") {
		fail(path, `initial must be "normal"`);
	}
	const ownsVariants =
		props.animate === ANIMATION_CONTROLS || typeof props.initial === "string";
	const context: VariantContext = ownsVariants
		? props.animate === ANIMATION_CONTROLS
			? "animated"
			: "still"
		: inherited;
	if (props.variants !== undefined) {
		if (context === "none")
			fail(path, "has variants but nothing controls them");
		const { normal, animate } = resolveVariants(
			props.variants,
			props.custom,
			path,
		);
		node.normal = normal;
		if (context === "animated") node.animate = animate;
		else stillParts.push(path);
	}

	const style = toStyle(props.style, path);
	const isMotionChild = !isRoot && typeof element.type !== "string";
	if (isMotionChild && hasTransform(node)) delete style.transformOrigin;
	if (Object.keys(style).length) node.style = style;

	const children = childElements(props.children as ReactNode, path).map(
		(child, index) =>
			toNode(
				child,
				`${path} > ${tagOf(child, path)}[${index}]`,
				false,
				context,
				stillParts,
			),
	);
	if (children.length) node.children = children;
	return node;
};

const ID_REFERENCE = /url\(#([^)]+)\)|^#(.+)$/g;

const renameIds = (root: IconNode, prefix: string, path: string) => {
	const ids = new Map<string, string>();
	const collect = (node: IconNode) => {
		const id = node.attrs?.id;
		if (id !== undefined) ids.set(String(id), `${prefix}-${ids.size}`);
		node.children?.forEach(collect);
	};
	const rename = (node: IconNode) => {
		for (const [attribute, value] of Object.entries(node.attrs ?? {})) {
			if (typeof value !== "string") continue;
			node.attrs![attribute] =
				attribute === "id"
					? (ids.get(value) as string)
					: value.replace(ID_REFERENCE, (reference, url, hash) => {
							const target = ids.get(url ?? hash);
							if (!target) fail(path, `refers to a missing id in ${reference}`);
							return url ? `url(#${target})` : `#${target}`;
						});
		}
		node.children?.forEach(rename);
	};
	collect(root);
	rename(root);
	return root;
};

const renderIconData = (
	{ library, name, component }: IconSource,
	duration: number,
	stillParts: string[] = [],
): IconData => {
	const path = `${library}/${name}`;
	renderToStaticMarkup(createElement(component, { duration }));
	const svg = findSvg(takeCapturedTree(), path);
	if (!svg) return fail(path, "no <svg> element was rendered");
	const root = toNode(svg, `${path} > svg`, true, "none", stillParts);
	return { name, library, ...renameIds(root, `${library}-${name}`, path) };
};

const compareTiming = (base: unknown, scaled: unknown, path: string): void => {
	if (Array.isArray(base) && Array.isArray(scaled)) {
		if (base.length !== scaled.length)
			fail(path, "changes length with duration");
		base.forEach((value, index) =>
			compareTiming(value, scaled[index], `${path}[${index}]`),
		);
		return;
	}
	if (isPlainObject(base) && isPlainObject(scaled)) {
		const keys = new Set([...Object.keys(base), ...Object.keys(scaled)]);
		for (const key of keys) {
			const childPath = `${path}.${key}`;
			if (TIMING_OPTIONS.has(key) && typeof base[key] === "number") {
				const expected = (base[key] as number) * 2;
				if (Math.abs((scaled[key] as number) - expected) > 1e-9) {
					fail(
						childPath,
						`is ${base[key]} at duration 1 but ${scaled[key]} at duration 2, expected ${expected}`,
					);
				}
				continue;
			}
			compareTiming(base[key], scaled[key], childPath);
		}
		return;
	}
	if (!Object.is(base, scaled)) {
		fail(path, `changes with duration (${String(base)} vs ${String(scaled)})`);
	}
};

function extractIcon(source: IconSource): ExtractedIcon {
	const stillParts: string[] = [];
	const data = renderIconData(source, 1, stillParts);
	compareTiming(
		data,
		renderIconData(source, 2),
		`${source.library}/${source.name}`,
	);
	return {
		library: source.library,
		name: source.name,
		exportName: source.exportName,
		data,
		stillParts,
	};
}

export function extractIcons(sources: IconSource[]) {
	const icons: ExtractedIcon[] = [];
	const errors: string[] = [];
	for (const source of sources) {
		try {
			icons.push(extractIcon(source));
		} catch (error) {
			if (!(error instanceof IconDataError)) throw error;
			errors.push(error.message);
		}
	}
	return { icons, errors };
}
