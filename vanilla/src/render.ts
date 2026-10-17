import { hasOrigin } from "./motion-properties";
import type { IconData, IconNode, MotionValues } from "./types";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

type TransformTemplate = [
	property: string,
	format: (value: unknown) => string,
	identity: number,
];

const withUnit = (value: unknown, unit: string) =>
	typeof value === "number" ? `${value}${unit}` : String(value);

const TRANSFORM_TEMPLATES: TransformTemplate[] = [
	["transformPerspective", (v) => `perspective(${withUnit(v, "px")})`, 0],
	["x", (v) => `translateX(${withUnit(v, "px")})`, 0],
	["y", (v) => `translateY(${withUnit(v, "px")})`, 0],
	["scale", (v) => `scale(${v})`, 1],
	["scaleX", (v) => `scaleX(${v})`, 1],
	["scaleY", (v) => `scaleY(${v})`, 1],
	["rotate", (v) => `rotate(${withUnit(v, "deg")})`, 0],
	["rotateX", (v) => `rotateX(${withUnit(v, "deg")})`, 0],
	["skewX", (v) => `skewX(${withUnit(v, "deg")})`, 0],
	["skewY", (v) => `skewY(${withUnit(v, "deg")})`, 0],
];

const RESTING_STYLES: Record<string, string> = {
	opacity: "",
	strokeDashoffset: "px",
	strokeDasharray: "",
	strokeWidth: "px",
};

const ID_REFERENCE = /url\(#([^)]+)\)|^#(.+)$/g;

let renderedIcons = 0;

export const createIdScope = () => `ai${(renderedIcons += 1).toString(36)}`;

const scopeIds = (attribute: string, value: string, scope: string) =>
	attribute === "id"
		? `${value}-${scope}`
		: value.replace(ID_REFERENCE, (_, url, hash) =>
				url ? `url(#${url}-${scope})` : `#${hash}-${scope}`,
			);

const toKebabCase = (property: string) =>
	property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

const finalValue = (value: unknown) =>
	Array.isArray(value) ? value[value.length - 1] : value;

const restingValues = (node: IconNode): MotionValues =>
	Object.fromEntries(
		Object.entries(node.normal ?? {})
			.filter(([key]) => key !== "transition")
			.map(([key, value]) => [key, finalValue(value)]),
	);

const restingTransform = (values: MotionValues) =>
	TRANSFORM_TEMPLATES.filter(
		([property, , identity]) =>
			values[property] !== undefined &&
			parseFloat(String(values[property])) !== identity,
	)
		.map(([property, format]) => format(values[property]))
		.join(" ");

export function restingAttributes(
	node: IconNode,
	isRoot = false,
	idScope?: string,
): Record<string, string> {
	const attributes: Record<string, string> = {};
	for (const [name, value] of Object.entries(node.attrs ?? {})) {
		attributes[name] = idScope
			? scopeIds(name, String(value), idScope)
			: String(value);
	}

	const values = restingValues(node);
	const { originX, originY, ...style } = {
		...node.style,
		...(values.originX !== undefined && { originX: values.originX }),
		...(values.originY !== undefined && { originY: values.originY }),
	};
	const declarations = Object.entries(style).map(
		([property, value]) => `${toKebabCase(property)}: ${value}`,
	);

	const transform = restingTransform(values);
	if (originX !== undefined || originY !== undefined) {
		const x = withUnit(originX ?? "50%", "px");
		const y = withUnit(originY ?? "50%", "px");
		declarations.push(`transform-origin: ${x} ${y}`);
	} else if (transform && !isRoot && !hasOrigin(node)) {
		declarations.push("transform-origin: 50% 50%");
	}
	if (transform) {
		declarations.push(`transform: ${transform}`);
		if (!isRoot && node.style?.transformBox === undefined) {
			declarations.push("transform-box: fill-box");
		}
	}

	for (const [property, unit] of Object.entries(RESTING_STYLES)) {
		if (values[property] === undefined) continue;
		declarations.push(
			`${toKebabCase(property)}: ${withUnit(values[property], unit)}`,
		);
	}

	if (values.pathLength !== undefined || values.pathOffset !== undefined) {
		attributes.pathLength = "1";
		attributes["stroke-dasharray"] = `${values.pathLength ?? 1} 1`;
		attributes["stroke-dashoffset"] = String(-Number(values.pathOffset ?? 0));
	}

	if (declarations.length) attributes.style = declarations.join("; ");
	return attributes;
}

export function renderIcon(
	data: IconData,
	size = 24,
	doc: Document = document,
): SVGSVGElement {
	const idScope = createIdScope();
	const build = (node: IconNode, isRoot: boolean): Element => {
		const element = doc.createElementNS(SVG_NAMESPACE, node.tag);
		const attributes = restingAttributes(node, isRoot, idScope);
		for (const [name, value] of Object.entries(attributes)) {
			element.setAttribute(name, value);
		}
		for (const child of node.children ?? []) {
			element.appendChild(build(child, false));
		}
		return element;
	};

	const svg = build(data, true) as SVGSVGElement;
	svg.setAttribute("width", String(size));
	svg.setAttribute("height", String(size));
	return svg;
}
