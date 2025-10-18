"use client";

import { withAnimatedIconWrapper } from "@/components/AnimatedIconsWrapper";
import { cn } from "@/lib/utils";
import { AnimatedIconProps, AnimatedIconRef } from "@/types";
import type { Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const ArrowUp01Icon = forwardRef<AnimatedIconRef, AnimatedIconProps>(
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
				transition: { duration: 0.8 * speed, ease: "easeInOut" },
			},
		};

		const arrowVariants: Variants = {
			normal: { y: 0, opacity: 1 },
			animate: {
				y: [6, -2, 0],
				opacity: [0, 1],
				transition: { duration: 0.6 * speed, ease: "easeOut" },
			},
		};

		const lineVariants: Variants = {
			normal: { pathLength: 1 },
			animate: {
				pathLength: [0, 1],
				transition: {
					duration: 0.7 * speed,
					ease: "easeInOut",
					delay: 0.1,
				},
			},
		};

		const rectVariants: Variants = {
			normal: { scale: 1, opacity: 1 },
			animate: {
				scale: [0.8, 1.1, 1],
				opacity: [0.7, 1, 1],
				transition: {
					duration: 0.6 * speed,
					ease: "easeOut",
					delay: 0.2,
				},
			},
		};

		const tVariants: Variants = {
			normal: { x: 0, opacity: 1 },
			animate: {
				x: [-6, 0],
				opacity: [0, 1],
				transition: {
					duration: 0.5 * speed,
					ease: "easeOut",
					delay: 0.3,
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
					variants={iconVariants}
				>
					<motion.path
						d="m3 8 4-4 4 4"
						variants={arrowVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M7 4v16"
						variants={lineVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.rect
						x="15"
						y="4"
						width="4"
						height="6"
						ry="2"
						variants={rectVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M17 20v-6h-2"
						variants={tVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M15 20h4"
						variants={tVariants}
						initial="normal"
						animate={controls}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

ArrowUp01Icon.displayName = "ArrowUp01Icon";
const icon = withAnimatedIconWrapper(ArrowUp01Icon);
export { icon as ArrowUp01Icon };
