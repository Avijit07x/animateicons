"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface ExternalLinkIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface ExternalLinkIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	duration?: number;
}

const ExternalLinkIcon = forwardRef<
	ExternalLinkIconHandle,
	ExternalLinkIconProps
>(
	(
		{
			onMouseEnter,
			onMouseLeave,
			className,
			size = 28,
			duration = 1,
			...props
		},
		ref,
	) => {
		const boxControls = useAnimation();
		const arrowControls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (reduced) {
						boxControls.start("normal");
						arrowControls.start("normal");
					} else {
						boxControls.start("animate");
						arrowControls.start("animate");
					}
				},
				stopAnimation: () => {
					boxControls.start("normal");
					arrowControls.start("normal");
				},
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) {
					boxControls.start("animate");
					arrowControls.start("animate");
				} else onMouseLeave?.(e as any);
			},
			[boxControls, arrowControls],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					boxControls.start("normal");
					arrowControls.start("normal");
				} else onMouseLeave?.(e as any);
			},
			[boxControls, arrowControls],
		);

		const boxVariants: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [0, 1],
				opacity: [0.6, 1],
				transition: { duration: 0.8 * duration, ease: "easeInOut" },
			},
		};

		const arrowVariants: Variants = {
			normal: { x: 0, y: 0, opacity: 1 },
			animate: {
				x: [0, 3, 0],
				y: [0, -3, 0],
				opacity: [1, 1, 1],
				transition: { duration: 0.6 * duration, ease: "easeInOut" },
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
						d="M15 3h6v6"
						variants={arrowVariants}
						initial="normal"
						animate={arrowControls}
					/>
					<motion.path
						d="M10 14 21 3"
						variants={arrowVariants}
						initial="normal"
						animate={arrowControls}
					/>
					<motion.path
						d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
						variants={boxVariants}
						initial="normal"
						animate={boxControls}
					/>
				</svg>
			</motion.div>
		);
	},
);

ExternalLinkIcon.displayName = "ExternalLinkIcon";
export { ExternalLinkIcon };
