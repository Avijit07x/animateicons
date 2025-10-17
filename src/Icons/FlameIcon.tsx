"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface FlameIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface FlameIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	durationMultiplier?: number;
}

const FlameIcon = forwardRef<FlameIconHandle, FlameIconProps>(
	({ onMouseEnter, onMouseLeave, className, size = 28, durationMultiplier = 1, ...props }, ref) => {
		const pathControls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (reduced) {
						pathControls.start("normal");
					} else {
						pathControls.start("animate");
					}
				},
				stopAnimation: () => {
					pathControls.start("normal");
				},
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) {
					pathControls.start("animate");
				} else onMouseEnter?.(e as any);
			},
			[pathControls, reduced, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					pathControls.start("normal");
				} else onMouseLeave?.(e as any);
			},
			[pathControls, onMouseLeave],
		);

		const pathVariants: Variants = {
			normal: { strokeDashoffset: 0, scale: 1, y: 0 },
			animate: {
				strokeDashoffset: [520, 150],
				scale: [1, 1.02, 1],
				y: [0, -3, 0],
				transition: {
					duration: 1.2 * durationMultiplier,
					ease: [0.22, 0.85, 0.28, 1],
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
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<motion.path
						d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"
						initial="normal"
						animate={pathControls}
						variants={pathVariants}
						style={{
							strokeDasharray: 220,
							transformOrigin: "12px 12px",
							strokeLinecap: "round",
						}}
					/>
				</svg>
			</motion.div>
		);
	},
);

FlameIcon.displayName = "FlameIcon";
export { FlameIcon };
