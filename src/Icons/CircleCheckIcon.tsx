"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface CircleCheckIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface CircleCheckIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	durationMultiplier?: number;
}

const CircleCheckIcon = forwardRef<CircleCheckIconHandle, CircleCheckIconProps>(
	({ onMouseEnter, onMouseLeave, className, size = 28, durationMultiplier = 1, ...props }, ref) => {
		const controls = useAnimation();
		const tickControls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (reduced) {
						controls.start("normal");
						tickControls.start("normal");
					} else {
						controls.start("animate");
						tickControls.start("animate");
					}
				},
				stopAnimation: () => {
					controls.start("normal");
					tickControls.start("normal");
				},
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) {
					controls.start("animate");
					tickControls.start("animate");
				} else {
					onMouseEnter?.(e as any);
				}
			},
			[controls, tickControls, reduced, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					controls.start("normal");
					tickControls.start("normal");
				} else {
					onMouseLeave?.(e as any);
				}
			},
			[controls, tickControls, onMouseLeave],
		);

		const svgVariants: Variants = {
			normal: { scale: 1 },
			animate: {
				scale: [1, 1.1, 0.95, 1],
				transition: {
					duration: 1.2 * durationMultiplier,
					ease: [0.42, 0, 0.58, 1],
				},
			},
		};

		const circleVariants: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: { pathLength: 1, opacity: 1 },
		};

		const tickVariants: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [0, 1],
				opacity: 1,
				transition: {
					duration: 0.8 * durationMultiplier,
					ease: [0.42, 0, 0.58, 1],
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
					animate={controls}
					initial="normal"
					variants={svgVariants}
				>
					<motion.circle
						cx="12"
						cy="12"
						r="10"
						variants={circleVariants}
						initial="normal"
					/>
					<motion.path
						d="m9 12 2 2 4-4"
						animate={tickControls}
						initial="normal"
						variants={tickVariants}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

CircleCheckIcon.displayName = "CircleCheckIcon";
export { CircleCheckIcon };
