"use client";

import { withAnimatedIconWrapper } from "@/components/AnimatedIconsWrapper";
import { cn } from "@/lib/utils";
import { AnimatedIconProps, AnimatedIconRef } from "@/types";
import type { Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const MapPinCheckInsideIcon = forwardRef<AnimatedIconRef, AnimatedIconProps>(
	(
		{ onMouseEnter, onMouseLeave, className, size = 28, speed = 1, ...props },
		ref,
	) => {
		const pinControls = useAnimation();
		const checkControls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (reduced) {
						pinControls.start("normal");
						checkControls.start("normal");
					} else {
						pinControls.start("animate");
						checkControls.start("animate");
					}
				},
				stopAnimation: () => {
					pinControls.start("normal");
					checkControls.start("normal");
				},
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) {
					pinControls.start("animate");
					checkControls.start("animate");
				} else onMouseEnter?.(e as any);
			},
			[pinControls, checkControls, reduced, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					pinControls.start("normal");
					checkControls.start("normal");
				} else onMouseLeave?.(e as any);
			},
			[pinControls, checkControls, onMouseLeave],
		);

		const pinVariants: Variants = {
			normal: { strokeDashoffset: 0 },
			animate: {
				strokeDashoffset: [160, 0],
				transition: { duration: 1 * speed, ease: "easeInOut" },
			},
		};

		const checkVariants: Variants = {
			normal: { strokeDashoffset: 0, opacity: 1 },
			animate: {
				strokeDashoffset: [28, 0],
				opacity: [0, 1],
				transition: { duration: 1 * speed, ease: "easeOut", delay: 0.28 },
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
						animate={pinControls}
						variants={pinVariants}
						style={{ strokeDasharray: 160, strokeLinecap: "round" }}
					/>
					<motion.path
						d="m9 10 2 2 4-4"
						initial="normal"
						animate={checkControls}
						variants={checkVariants}
						style={{ strokeDasharray: 28, strokeLinecap: "round" }}
					/>
				</svg>
			</motion.div>
		);
	},
);

MapPinCheckInsideIcon.displayName = "MapPinCheckInsideIcon";
const icon = withAnimatedIconWrapper(MapPinCheckInsideIcon);
export { icon as MapPinCheckInsideIcon };
