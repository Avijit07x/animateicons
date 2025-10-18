"use client";

import { withAnimatedIconWrapper } from "@/components/AnimatedIconsWrapper";
import { cn } from "@/lib/utils";
import { AnimatedIconProps, AnimatedIconRef } from "@/types";
import type { Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const GeorgianLariIcon = forwardRef<AnimatedIconRef, AnimatedIconProps>(
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

		const svgVariants: Variants = {
			normal: { scale: 1, rotate: 0, y: 0 },
			animate: {
				scale: [1, 1.06, 1],
				rotate: [0, -2, 2, 0],
				y: [0, -1, 0],
				transition: { duration: 1.2 * speed, ease: "easeInOut" },
			},
		};

		const arcStroke: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [0, 1],
				opacity: [0.7, 1],
				transition: { duration: 0.6 * speed, ease: "easeInOut", delay: 0.06 },
			},
		};

		const leftVert: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [0, 1],
				opacity: [0.7, 1],
				transition: { duration: 0.55 * speed, ease: "easeInOut", delay: 0.16 },
			},
		};

		const rightVert: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [0, 1],
				opacity: [0.8, 1],
				transition: { duration: 0.55 * speed, ease: "easeInOut", delay: 0.26 },
			},
		};

		const baseStroke: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [0, 1],
				opacity: [0.8, 1],
				transition: { duration: 0.55 * speed, ease: "easeInOut", delay: 0.36 },
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
					className="lucide lucide-georgian-lari-icon lucide-georgian-lari"
				>
					<g opacity={0.35}>
						<path d="M11.5 21a7.5 7.5 0 1 1 7.35-9" />
						<path d="M13 12V3" />
						<path d="M4 21h16" />
						<path d="M9 12V3" />
					</g>

					<motion.path
						d="M11.5 21a7.5 7.5 0 1 1 7.35-9"
						pathLength={1}
						variants={arcStroke}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M9 12V3"
						pathLength={1}
						variants={leftVert}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M13 12V3"
						pathLength={1}
						variants={rightVert}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M4 21h16"
						pathLength={1}
						variants={baseStroke}
						initial="normal"
						animate={controls}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

GeorgianLariIcon.displayName = "GeorgianLariIcon";
const icon = withAnimatedIconWrapper(GeorgianLariIcon);
export { icon as GeorgianLariIcon };
