"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface PaperclipIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface PaperclipIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	durationMultiplier?: number;
}

const PaperclipIcon = forwardRef<PaperclipIconHandle, PaperclipIconProps>(
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
			normal: { strokeDashoffset: 0 },
			animate: {
				strokeDashoffset: [360, 0],
				transition: { duration: 1.2 * durationMultiplier, ease: "easeInOut" },
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
						d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"
						initial="normal"
						animate={pathControls}
						variants={pathVariants}
						style={{ strokeDasharray: 360, strokeLinecap: "round" }}
					/>
				</svg>
			</motion.div>
		);
	},
);

PaperclipIcon.displayName = "PaperclipIcon";
export { PaperclipIcon };
