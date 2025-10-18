"use client";

import { withAnimatedIconWrapper } from "@/components/AnimatedIconsWrapper";
import { cn } from "@/lib/utils";
import { AnimatedIconProps, AnimatedIconRef } from "@/types";
import type { Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const ArrowDownUpIcon = forwardRef<AnimatedIconRef, AnimatedIconProps>(
	(
		{ onMouseEnter, onMouseLeave, className, size = 28, speed = 1, ...props },
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

		const iconVariants: Variants = {
			normal: { scale: 1, rotate: 0 },
			animate: {
				scale: [1, 1.08, 0.96, 1],
				rotate: [0, -4, 2, 0],
				transition: { duration: 0.9 * speed, ease: "easeInOut" },
			},
		};

		const downArrowVariants: Variants = {
			normal: { y: 0, opacity: 1 },
			animate: {
				y: [-4, 2, 0],
				opacity: [0, 1],
				transition: {
					duration: 0.7 * speed,
					ease: "easeOut",
					delay: 0.1,
				},
			},
		};

		const upArrowVariants: Variants = {
			normal: { y: 0, opacity: 1 },
			animate: {
				y: [4, -2, 0],
				opacity: [0, 1],
				transition: {
					duration: 0.7 * speed,
					ease: "easeOut",
					delay: 0.15,
				},
			},
		};

		const lineVariants: Variants = {
			normal: { pathLength: 1 },
			animate: {
				pathLength: [0, 1],
				transition: { duration: 0.8 * speed, ease: "easeInOut" },
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
					variants={iconVariants}
				>
					<motion.path
						d="m3 16 4 4 4-4"
						variants={downArrowVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M7 20V4"
						variants={lineVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="m21 8-4-4-4 4"
						variants={upArrowVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M17 4v16"
						variants={lineVariants}
						initial="normal"
						animate={controls}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

ArrowDownUpIcon.displayName = "ArrowDownUpIcon";
const icon = withAnimatedIconWrapper(ArrowDownUpIcon);
export { icon as ArrowDownUpIcon };
