"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface ChevronsLeftRightIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface ChevronsLeftRightIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	durationMultiplier?: number;
}

const ChevronsLeftRightIcon = forwardRef<
	ChevronsLeftRightIconHandle,
	ChevronsLeftRightIconProps
>(({ onMouseEnter, onMouseLeave, className, size = 28, durationMultiplier = 1, ...props }, ref) => {
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
				onMouseLeave?.(e);
			}
		},
		[controls, onMouseLeave],
	);

	const leftArrow: Variants = {
		normal: { x: 0, opacity: 1 },
		animate: {
			x: [0, -4, 0],
			opacity: [1, 0.6, 1],
			transition: { duration: 0.8 * durationMultiplier, repeat: 0 },
		},
	};

	const rightArrow: Variants = {
		normal: { x: 0, opacity: 1 },
		animate: {
			x: [0, 4, 0],
			opacity: [1, 0.6, 1],
			transition: { duration: 0.8 * durationMultiplier, repeat: 0, delay: 0.2 },
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
				animate={controls}
				initial="normal"
			>
				<motion.path
					d="m9 7-5 5 5 5"
					variants={leftArrow}
					stroke="currentColor"
				/>
				<motion.path
					d="m15 7 5 5-5 5"
					variants={rightArrow}
					stroke="currentColor"
				/>
			</motion.svg>
		</motion.div>
	);
});

ChevronsLeftRightIcon.displayName = "ChevronsLeftRightIcon";
export { ChevronsLeftRightIcon };
