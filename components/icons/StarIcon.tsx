"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface StarIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface StarIconProps extends HTMLMotionProps<"div"> {
	size?: number;
}

const StarIcon = forwardRef<StarIconHandle, StarIconProps>(
	({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
		const controls = useAnimation();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => controls.start("animate"),
				stopAnimation: () => controls.start("idle"),
			};
		});

		const handleEnter = useCallback(() => {
			if (!isControlled.current) controls.start("animate");
		}, [controls]);

		const handleLeave = useCallback(() => {
			if (!isControlled.current) controls.start("idle");
		}, [controls]);

		const starVariants: Variants = {
			idle: {
				scale: [1, 1.02, 0.98, 1],
				filter: [
					"drop-shadow(0px 0px 2px yellow)",
					"drop-shadow(0px 0px 4px yellow)",
					"drop-shadow(0px 0px 6px yellow)",
					"drop-shadow(0px 0px 2px yellow)",
				],
				transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
			},
			animate: {
				scale: [1, 1.2, 0.95, 1.05, 1],
				rotate: [0, -10, 10, 0],
				filter: [
					"drop-shadow(0px 0px 4px yellow)",
					"drop-shadow(0px 0px 12px yellow)",
					"drop-shadow(0px 0px 16px yellow)",
					"drop-shadow(0px 0px 8px yellow)",
					"drop-shadow(0px 0px 4px yellow)",
				],
				transition: { duration: 1.2, ease: "easeInOut" },
			},
		};

		return (
			<motion.div
				className={cn("inline-flex items-center justify-center", className)}
				onMouseEnter={handleEnter}
				onMouseLeave={handleLeave}
				{...props}
			>
				<motion.svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="yellow"
					stroke="yellow"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					animate={controls}
					initial="idle"
					variants={starVariants}
				>
					<motion.path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
				</motion.svg>
			</motion.div>
		);
	},
);

StarIcon.displayName = "StarIcon";
export { StarIcon };
