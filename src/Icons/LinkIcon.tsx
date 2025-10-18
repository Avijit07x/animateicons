"use client";

import { withAnimatedIconWrapper } from "@/components/AnimatedIconsWrapper";
import { cn } from "@/lib/utils";
import { AnimatedIconProps, AnimatedIconRef } from "@/types";
import type { Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const LinkIcon = forwardRef<AnimatedIconRef, AnimatedIconProps>(
	(
		{ onMouseEnter, onMouseLeave, className, size = 28, speed = 1, ...props },
		ref,
	) => {
		const leftPartControls = useAnimation();
		const rightPartControls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (reduced) {
						leftPartControls.start("normal");
						rightPartControls.start("normal");
					} else {
						leftPartControls.start("animate");
						rightPartControls.start("animate");
					}
				},
				stopAnimation: () => {
					leftPartControls.start("normal");
					rightPartControls.start("normal");
				},
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) {
					leftPartControls.start("animate");
					rightPartControls.start("animate");
				} else onMouseLeave?.(e as any);
			},
			[leftPartControls, rightPartControls],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					leftPartControls.start("normal");
					rightPartControls.start("normal");
				} else onMouseLeave?.(e as any);
			},
			[leftPartControls, rightPartControls],
		);

		const linkVariantsLeft: Variants = {
			normal: { scale: 1, rotate: 0, x: 0 },
			animate: {
				x: [0, -2, 0],
				rotate: [0, -3, 0],
				transition: {
					duration: 0.9 * speed,
					ease: "easeInOut",
				},
			},
		};

		const linkVariantsRight: Variants = {
			normal: { scale: 1, rotate: 0, x: 0 },
			animate: {
				x: [0, 2, 0],
				rotate: [0, 3, 0],
				transition: {
					duration: 0.9 * speed,
					ease: "easeInOut",
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
						d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
						variants={linkVariantsRight}
						initial="normal"
						animate={rightPartControls}
					/>
					<motion.path
						d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
						variants={linkVariantsLeft}
						initial="normal"
						animate={leftPartControls}
					/>
				</svg>
			</motion.div>
		);
	},
);

LinkIcon.displayName = "LinkIcon";
const icon = withAnimatedIconWrapper(LinkIcon);
export { icon as LinkIcon };
