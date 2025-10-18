"use client";

import { withAnimatedIconWrapper } from "@/components/AnimatedIconsWrapper";
import { cn } from "@/lib/utils";
import { AnimatedIconProps, AnimatedIconRef } from "@/types";
import type { Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const MapPinIcon = forwardRef<AnimatedIconRef, AnimatedIconProps>(
	(
		{ onMouseEnter, onMouseLeave, className, size = 28, speed = 1, ...props },
		ref,
	) => {
		const pathControls = useAnimation();
		const circleControls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (reduced) {
						pathControls.start("normal");
						circleControls.start("normal");
					} else {
						pathControls.start("animate");
						circleControls.start("animate");
					}
				},
				stopAnimation: () => {
					pathControls.start("normal");
					circleControls.start("normal");
				},
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) {
					pathControls.start("animate");
					circleControls.start("animate");
				} else onMouseEnter?.(e as any);
			},
			[pathControls, circleControls, reduced, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					pathControls.start("normal");
					circleControls.start("normal");
				} else onMouseLeave?.(e as any);
			},
			[pathControls, circleControls, onMouseLeave],
		);

		const pathVariants: Variants = {
			normal: { strokeDashoffset: 0, scale: 1 },
			animate: {
				strokeDashoffset: [120, 0],
				scale: [1, 1.05, 1],
				transition: { duration: 1.5 * speed, ease: "easeOut" },
			},
		};

		const circleVariants: Variants = {
			normal: { scale: 1, opacity: 1 },
			animate: {
				scale: [1, 1.2, 1],
				opacity: [1, 0.7, 1],
				transition: { duration: 0.9 * speed, ease: "easeOut", delay: 0.2 },
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
						d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
						initial="normal"
						animate={pathControls}
						variants={pathVariants}
						style={{ strokeDasharray: 120, strokeLinecap: "round" }}
					/>
					<motion.circle
						cx="12"
						cy="10"
						r="3"
						initial="normal"
						animate={circleControls}
						variants={circleVariants}
					/>
				</svg>
			</motion.div>
		);
	},
);

MapPinIcon.displayName = "MapPinIcon";
const icon = withAnimatedIconWrapper(MapPinIcon);
export { icon as MapPinIcon };
