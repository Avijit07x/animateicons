import type { IconNode } from "./types";

export const TRANSFORM_PROPERTIES: ReadonlySet<string> = new Set([
	"x",
	"y",
	"scale",
	"scaleX",
	"scaleY",
	"rotate",
	"rotateX",
	"skewX",
	"skewY",
	"transformPerspective",
]);

export const ORIGIN_PROPERTIES: ReadonlySet<string> = new Set([
	"originX",
	"originY",
]);

const definesAny = (
	node: IconNode,
	properties: ReadonlySet<string>,
	sources: (keyof IconNode)[],
) =>
	sources.some((source) => {
		const values = node[source];
		return (
			typeof values === "object" &&
			values !== null &&
			Object.keys(values).some((key) => properties.has(key))
		);
	});

export const hasTransform = (node: IconNode) =>
	definesAny(node, TRANSFORM_PROPERTIES, ["normal", "animate"]);

export const hasOrigin = (node: IconNode) =>
	definesAny(node, ORIGIN_PROPERTIES, ["style", "normal", "animate"]);
