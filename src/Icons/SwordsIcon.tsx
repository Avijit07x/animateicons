"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface SwordsIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface SwordsIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	durationMultiplier?: number;
}

const SwordsIcon = forwardRef<SwordsIconHandle, SwordsIconProps>(
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
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) controls.start("normal");
				else onMouseLeave?.(e as any);
			},
			[controls, onMouseLeave],
		);

		const svgVariants: Variants = {
			normal: { rotate: 0, scale: 1 },
			animate: {
				rotate: [0, -5, 5, -3, 3, 0],
				scale: [1, 1.05, 0.95, 1],
				transition: { duration: 1.5 * durationMultiplier, ease: "easeInOut", repeat: 0 },
			},
		};

		const pathVariants: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [0, 1],
				opacity: [0.6, 1],
				transition: { duration: 1.2 * durationMultiplier, ease: "easeInOut", repeat: 0 },
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
					variants={svgVariants}
				>
					<motion.polyline
						points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"
						variants={pathVariants}
					/>
					<motion.line
						x1="13"
						x2="19"
						y1="19"
						y2="13"
						variants={pathVariants}
					/>
					<motion.line
						x1="16"
						x2="20"
						y1="16"
						y2="20"
						variants={pathVariants}
					/>
					<motion.line
						x1="19"
						x2="21"
						y1="21"
						y2="19"
						variants={pathVariants}
					/>
					<motion.polyline
						points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"
						variants={pathVariants}
					/>
					<motion.line x1="5" x2="9" y1="14" y2="18" variants={pathVariants} />
					<motion.line x1="7" x2="4" y1="17" y2="20" variants={pathVariants} />
					<motion.line x1="3" x2="5" y1="19" y2="21" variants={pathVariants} />
				</motion.svg>
			</motion.div>
		);
	},
);

SwordsIcon.displayName = "SwordsIcon";
export { SwordsIcon };
