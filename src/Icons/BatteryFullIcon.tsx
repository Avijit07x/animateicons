"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface BatteryFullIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface BatteryFullIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	durationMultiplier?: number;
}

const BatteryFullIcon = forwardRef<BatteryFullIconHandle, BatteryFullIconProps>(
	(
		{
			onMouseEnter,
			onMouseLeave,
			className,
			size = 28,
			durationMultiplier = 1,
			...props
		},
		ref,
	) => {
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
				rotate: [0, -2, 2, 0],
				scale: [1, 1.05, 0.95, 1],
				transition: {
					duration: 1.5 * durationMultiplier,
					ease: [0.42, 0, 0.58, 1],
					repeat: 0,
				},
			},
		};

		const barVariants: Variants = {
			normal: { opacity: 1, scaleY: 1 },
			animate: (i: number) => ({
				opacity: [0.4, 1, 0.8],
				scaleY: [0.6, 1, 0.8],
				transition: {
					duration: 1 * durationMultiplier,
					ease: [0.42, 0, 0.58, 1],
					repeat: 0,
					delay: i * 0.25,
				},
			}),
		};

		const rectVariants: Variants = {
			normal: { opacity: 1 },
			animate: {
				opacity: [0.6, 1, 0.7, 1],
				transition: {
					duration: 1.2 * durationMultiplier,
					ease: [0.42, 0, 0.58, 1],
					repeat: 0,
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
					<motion.path d="M10 10v4" variants={barVariants} custom={0} />
					<motion.path d="M14 10v4" variants={barVariants} custom={1} />
					<motion.path d="M6 10v4" variants={barVariants} custom={2} />
					<motion.rect
						x="2"
						y="6"
						width="16"
						height="12"
						rx="2"
						variants={rectVariants}
					/>
					<motion.path d="M22 14v-4" variants={rectVariants} />
				</motion.svg>
			</motion.div>
		);
	},
);

BatteryFullIcon.displayName = "BatteryFullIcon";
export { BatteryFullIcon };
