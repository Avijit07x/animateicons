"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface BadgeDollarIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface BadgeDollarIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	duration?: number;
}

const BadgeDollarIcon = forwardRef<BadgeDollarIconHandle, BadgeDollarIconProps>(
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
		const outerControls = useAnimation();
		const dollarControls = useAnimation();
		const lineControls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (reduced) {
						outerControls.start("normal");
						dollarControls.start("normal");
						lineControls.start("normal");
					} else {
						outerControls.start("animate");
						dollarControls.start("animate");
						lineControls.start("animate");
					}
				},
				stopAnimation: () => {
					outerControls.start("normal");
					dollarControls.start("normal");
					lineControls.start("normal");
				},
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) {
					outerControls.start("animate");
					dollarControls.start("animate");
					lineControls.start("animate");
				} else onMouseEnter?.(e as any);
			},
			[outerControls, dollarControls, lineControls, reduced, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					outerControls.start("normal");
					dollarControls.start("normal");
					lineControls.start("normal");
				} else onMouseLeave?.(e as any);
			},
			[outerControls, dollarControls, lineControls, onMouseLeave],
		);

		const outerVariants: Variants = {
			normal: { strokeDashoffset: 0, scale: 1 },
			animate: {
				strokeDashoffset: [260, 20, 0],
				scale: [1, 0.98, 1.03, 1],
				transition: {
					duration: 1.2 * duration,
					ease: [0.2, 0.85, 0.25, 1],
					times: [0, 0.35, 0.7, 1],
				},
			},
		};

		const dollarVariants: Variants = {
			normal: { strokeDashoffset: 0, scale: 1 },
			animate: {
				strokeDashoffset: [140, 0],
				scale: [1, 1.06, 0.98, 1],
				transition: {
					duration: 0.9 * duration,
					ease: [0.22, 0.9, 0.28, 1],
					delay: 0.32,
					times: [0, 0.45, 0.8, 1],
				},
			},
		};

		const lineVariants: Variants = {
			normal: { strokeDashoffset: 0, scaleY: 1, opacity: 1 },
			animate: {
				strokeDashoffset: [16, 0],
				scaleY: [1, 1.16, 0.98, 1],
				opacity: [0.9, 1, 1],
				transition: {
					duration: 0.8 * duration,
					ease: [0.22, 0.9, 0.28, 1],
					delay: 0.18,
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
						d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
						initial="normal"
						animate={outerControls}
						variants={outerVariants}
						style={{ strokeDasharray: 260, transformOrigin: "12px 12px" }}
					/>
					<motion.path
						d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"
						initial="normal"
						animate={dollarControls}
						variants={dollarVariants}
						style={{ strokeDasharray: 140, strokeLinecap: "round" }}
					/>
					<motion.path
						d="M12 18V6"
						initial="normal"
						animate={lineControls}
						variants={lineVariants}
						style={{ strokeDasharray: 20, strokeLinecap: "round" }}
					/>
				</svg>
			</motion.div>
		);
	},
);

BadgeDollarIcon.displayName = "BadgeDollarIcon";
export { BadgeDollarIcon };
