"use client";

import { withAnimatedIconWrapper } from "@/components/AnimatedIconsWrapper";
import { cn } from "@/lib/utils";
import { AnimatedIconProps, AnimatedIconRef } from "@/types";
import type { Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const BellRingIcon = forwardRef<AnimatedIconRef, AnimatedIconProps>(
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
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					controls.start("normal");
				} else {
					onMouseLeave?.(e as any);
				}
			},
			[controls, onMouseLeave],
		);

		const bellVariants: Variants = {
			normal: { rotate: 0 },
			animate: {
				rotate: [0, -15, 13, -9, 6, -3, 0],
				transition: { duration: 1.4 * speed, ease: "easeInOut", repeat: 0 },
			},
		};

		const clapperVariants: Variants = {
			normal: { x: 0 },
			animate: {
				x: [0, -3, 3, -2, 2, 0],
				transition: { duration: 1.4 * speed, ease: "easeInOut", repeat: 0 },
			},
		};

		const waveVariants: Variants = {
			normal: { opacity: 1 },
			animate: {
				opacity: [1, 0.4, 1],
				transition: { duration: 1.4 * speed, repeat: 0, ease: "easeInOut" },
			},
		};

		return (
			<motion.div
				className={cn("relative inline-flex", className)}
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
					variants={bellVariants}
				>
					<motion.path
						d="M10.268 21a2 2 0 0 0 3.464 0"
						variants={clapperVariants}
					/>
					<motion.path d="M22 8c0-2.3-.8-4.3-2-6" variants={waveVariants} />
					<path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
					<motion.path d="M4 2C2.8 3.7 2 5.7 2 8" variants={waveVariants} />
				</motion.svg>
			</motion.div>
		);
	},
);

BellRingIcon.displayName = "BellRingIcon";
const icon = withAnimatedIconWrapper(BellRingIcon);
export { icon as BellRingIcon };
