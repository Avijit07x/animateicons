import type { Variants } from "motion/react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export const closeVariants: Variants = {
	hidden: { opacity: 0, scale: 0.8, rotate: -90 },
	rest: {
		opacity: 0,
		scale: 0.8,
		rotate: -45,
		transition: { duration: 0.16, ease: "easeOut" },
	},
	open: {
		opacity: 1,
		scale: 1,
		rotate: [-90, 0],
		transition: { duration: 0.32, ease: EASE_OUT, delay: 0.4 },
	},
};

export const tipVariants: Variants = {
	hide: { opacity: 0, x: 4, transition: { duration: 0.12, ease: EASE_OUT } },
	show: {
		opacity: 1,
		x: [6, 0],
		transition: { duration: 0.18, ease: EASE_OUT },
	},
};
