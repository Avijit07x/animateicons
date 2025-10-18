import { HTMLMotionProps } from "motion/react";

type IconListItem = {
	name: string;
	icon: React.ElementType;
	addedAt?: string;
	keywords: string[];
};

export interface AnimatedIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	speed?: number;
}

export interface AnimatedIconRef {
	startAnimation: () => void;
	stopAnimation: () => void;
}
