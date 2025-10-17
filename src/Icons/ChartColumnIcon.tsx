"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface ChartColumnIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface ChartColumnIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	durationMultiplier?: number;
}

const ChartColumnIcon = forwardRef<ChartColumnIconHandle, ChartColumnIconProps>(
	({ onMouseEnter, onMouseLeave, className, size = 28, durationMultiplier = 1, ...props }, ref) => {
		const controls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () =>
					reduced ? controls.start("normal") : controls.start("animate"),
				stopAnimation: () => controls.start("normal"),
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) controls.start("animate");
				else onMouseEnter?.(e as any);
			},
			[controls, reduced, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					controls.start("normal");
				} else {
					onMouseLeave?.(e as any);
				}
			},
			[controls, onMouseLeave],
		);

		const pathVariants: Variants = {
			normal: {
				pathLength: 1,
				opacity: 1,
				transition: { duration: 0.2 * durationMultiplier },
			},
			animate: {
				pathLength: [0, 1],
				opacity: [0.7, 1],
				transition: {
					duration: 0.6 * durationMultiplier,
					ease: "easeInOut",
				},
			},
		};

		const chartVariants: Variants = {
			normal: {
				scale: 1,
				transition: { duration: 0.2 * durationMultiplier },
			},
			animate: {
				scale: [1, 1.05, 1],
				transition: {
					duration: 0.4 * durationMultiplier,
					ease: "easeInOut",
				},
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
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					variants={chartVariants}
					animate={controls}
					initial="normal"
				>
					<motion.path d="M3 3v16a2 2 0 0 0 2 2h16" variants={pathVariants} />
					<motion.path d="M18 17V9" variants={pathVariants} />
					<motion.path d="M13 17V5" variants={pathVariants} />
					<motion.path d="M8 17v-3" variants={pathVariants} />
				</motion.svg>
			</motion.div>
		);
	},
);

ChartColumnIcon.displayName = "ChartColumnIcon";
export { ChartColumnIcon };
