"use client";

import { withAnimatedIconWrapper } from "@/components/AnimatedIconsWrapper";
import { cn } from "@/lib/utils";
import { AnimatedIconProps, AnimatedIconRef } from "@/types";
import type { Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const CircleChevronUpIcon = forwardRef<AnimatedIconRef, AnimatedIconProps>(
	(
		{ onMouseEnter, onMouseLeave, className, size = 28, speed = 1, ...props },
		ref,
	) => {
		const circleControls = useAnimation();
		const arrowControls = useAnimation();
		const isControlled = useRef(false);
		const tickControls = useAnimation();
		const reduced = useReducedMotion();

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (reduced) {
						circleControls.start("normal");
						tickControls.start("normal");
						arrowControls.start("normal");
					} else {
						circleControls.start("animate");
						tickControls.start("animate");
						arrowControls.start("animate");
					}
				},
				stopAnimation: () => {
					circleControls.start("normal");
					tickControls.start("normal");
					arrowControls.start("normal");
				},
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) {
					circleControls.start("animate");
					tickControls.start("animate");
					arrowControls.start("animate");
				} else {
					onMouseEnter?.(e as any);
				}
			},
			[circleControls, tickControls, reduced, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					circleControls.start("normal");
					tickControls.start("normal");
					arrowControls.start("normal");
				} else {
					onMouseLeave?.(e as any);
				}
			},
			[circleControls, tickControls, onMouseLeave],
		);
		const circleVariants: Variants = {
			normal: { scale: 1, opacity: 1 },
			animate: {
				scale: [1, 1.1, 0.9, 1.05, 1],
				opacity: 1,
				transition: {
					duration: 1.2 * speed,
					ease: "easeInOut",
				},
			},
		};

		const arrowVariants: Variants = {
			normal: { y: 0, opacity: 1 },
			animate: {
				y: [10, 0],
				opacity: [0, 1],
				transition: {
					duration: 0.6 * speed,
					ease: "easeOut",
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
				>
					<motion.circle
						cx="12"
						cy="12"
						r="10"
						animate={circleControls}
						initial="normal"
						variants={circleVariants}
					/>
					<motion.path
						d="m8 14 4-4 4 4"
						animate={arrowControls}
						initial="normal"
						variants={arrowVariants}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

CircleChevronUpIcon.displayName = "CircleChevronUpIcon";
const icon = withAnimatedIconWrapper(CircleChevronUpIcon);
export { icon as CircleChevronUpIcon };
