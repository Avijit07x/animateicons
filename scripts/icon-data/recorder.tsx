import type { ComponentType, ReactNode } from "react";

const MOTION_TAG = Symbol.for("animateicons.motion-tag");

export const ANIMATION_CONTROLS = Object.freeze({
	start: () => Promise.resolve(),
	stop: () => {},
	set: () => {},
});

type MotionComponent = ComponentType & { [MOTION_TAG]: string };

const components = new Map<string, MotionComponent>();

const motionComponent = (tag: string): MotionComponent => {
	let component = components.get(tag);
	if (!component) {
		component = Object.assign(() => null, { [MOTION_TAG]: tag });
		components.set(tag, component);
	}
	return component;
};

export const motionTagOf = (type: unknown): string | undefined =>
	typeof type === "function"
		? (type as Partial<MotionComponent>)[MOTION_TAG]
		: undefined;

let captured: ReactNode;

export const takeCapturedTree = (): ReactNode => {
	const tree = captured;
	captured = undefined;
	return tree;
};

export const LazyMotion = ({ children }: { children: ReactNode }) => {
	captured = children;
	return null;
};

export const domMin = {};

export const m = new Proxy({} as Record<string, MotionComponent>, {
	get: (_, tag) => motionComponent(String(tag)),
});

export const useAnimation = () => ANIMATION_CONTROLS;

export const useReducedMotion = () => false;
