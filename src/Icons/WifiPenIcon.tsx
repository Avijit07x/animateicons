"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface WifiPenIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface WifiPenIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	duration?: number;
}

const WifiPenIcon = forwardRef<WifiPenIconHandle, WifiPenIconProps>(
	(
		{
			onMouseEnter,
			onMouseLeave,
			className,
			size = 24,
			duration = 1,
			...props
		},
		ref,
	) => {
		const groupControls = useAnimation();
		const arcLargeControls = useAnimation();
		const arcMidControls = useAnimation();
		const arcSmallControls = useAnimation();
		const penControls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (reduced) {
						groupControls.start("normal");
						arcLargeControls.start("normal");
						arcMidControls.start("normal");
						arcSmallControls.start("normal");
						penControls.start("normal");
					} else {
						groupControls.start("animate");
						arcLargeControls.start("animate");
						arcMidControls.start("animate");
						arcSmallControls.start("animate");
						penControls.start("animate");
					}
				},
				stopAnimation: () => {
					groupControls.start("normal");
					arcLargeControls.start("normal");
					arcMidControls.start("normal");
					arcSmallControls.start("normal");
					penControls.start("normal");
				},
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) {
					groupControls.start("animate");
					arcLargeControls.start("animate");
					arcMidControls.start("animate");
					arcSmallControls.start("animate");
					penControls.start("animate");
				} else onMouseEnter?.(e as any);
			},
			[
				groupControls,
				arcLargeControls,
				arcMidControls,
				arcSmallControls,
				penControls,
				reduced,
				onMouseEnter,
			],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					groupControls.start("normal");
					arcLargeControls.start("normal");
					arcMidControls.start("normal");
					arcSmallControls.start("normal");
					penControls.start("normal");
				} else onMouseLeave?.(e as any);
			},
			[
				groupControls,
				arcLargeControls,
				arcMidControls,
				arcSmallControls,
				penControls,
				onMouseLeave,
			],
		);

		const groupVariants: Variants = {
			normal: { scale: 1, rotate: 0 },
			animate: {
				scale: [1, 1.06, 0.99, 1],
				rotate: [0, -1.5, 1.5, 0],
				transition: { duration: 0.9 * duration, ease: [0.22, 0.9, 0.32, 1] },
			},
		};

		const arcLargeVariants: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [0, 1],
				opacity: [0.2, 1],
				transition: { duration: 0.9 * duration, ease: "easeOut", delay: 0.04 },
			},
		};

		const arcMidVariants: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [0, 1],
				opacity: [0.2, 1],
				transition: { duration: 0.8 * duration, ease: "easeOut", delay: 0.12 },
			},
		};

		const arcSmallVariants: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [0, 1],
				opacity: [0.2, 1],
				transition: { duration: 0.7 * duration, ease: "easeOut", delay: 0.18 },
			},
		};

		const penVariants: Variants = {
			normal: { rotate: 0, x: 0, y: 0, opacity: 1 },
			animate: {
				rotate: [-8, 8, -4, 0],
				x: [6, -2, 2, 0],
				y: [0, -2, 0, 0],
				opacity: [0.6, 1, 1, 1],
				transition: { duration: 1 * duration, ease: "easeInOut" },
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
					strokeWidth={2}
					strokeLinecap="round"
					strokeLinejoin="round"
					initial="normal"
					animate={groupControls}
					variants={groupVariants}
				>
					<motion.path
						d="M2 8.82a15 15 0 0 1 20 0"
						initial="normal"
						animate={arcLargeControls}
						variants={arcLargeVariants}
					/>
					<motion.path
						d="M5 12.859a10 10 0 0 1 10.5-2.222"
						initial="normal"
						animate={arcMidControls}
						variants={arcMidVariants}
					/>
					<motion.path
						d="M8.5 16.429a5 5 0 0 1 3-1.406"
						initial="normal"
						animate={arcSmallControls}
						variants={arcSmallVariants}
					/>
					<motion.g
						initial="normal"
						animate={penControls}
						variants={penVariants}
					>
						<motion.path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
					</motion.g>
				</motion.svg>
			</motion.div>
		);
	},
);

WifiPenIcon.displayName = "WifiPenIcon";
export { WifiPenIcon };
