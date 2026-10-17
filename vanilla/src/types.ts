export type MotionValues = Record<string, unknown>;

export type MotionTarget = MotionValues & { transition?: MotionValues };

export interface IconNode {
	tag: string;
	attrs?: Record<string, string | number>;
	style?: Record<string, string | number>;
	normal?: MotionTarget;
	animate?: MotionTarget;
	children?: IconNode[];
}

export type IconLibrary = "lucide" | "huge";

export interface IconData extends IconNode {
	name: string;
	library: IconLibrary;
}

export interface IconOptions {
	size?: number;
	color?: string;
	duration?: number;
	isAnimated?: boolean;
}

export interface IconControls {
	startAnimation: () => void;
	stopAnimation: () => void;
}
