"use client";

import { withAnimatedIconWrapper } from "@/components/AnimatedIconsWrapper";
import { cn } from "@/lib/utils";
import { AnimatedIconProps, AnimatedIconRef } from "@/types";
import type { Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const BellPlusIcon = forwardRef<AnimatedIconRef, AnimatedIconProps>(
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
				rotate: [0, -12, 10, -6, 3, 0],
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

		const plusVariants: Variants = {
			normal: { scale: 1, opacity: 1, rotate: 0 },
			animate: {
				scale: [1, 1.3, 0.9, 1.1, 1],
				rotate: [0, 45, -45, 0],
				opacity: [1, 0.9, 1],
				transition: { duration: 1.4 * speed, ease: "easeInOut", repeat: 0 },
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
					<motion.path d="M15 8h6" variants={plusVariants} />
					<motion.path d="M18 5v6" variants={plusVariants} />
					<path d="M20.002 14.464a9 9 0 0 0 .738.863A1 1 0 0 1 20 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 8.75-5.332" />
				</motion.svg>
			</motion.div>
		);
	},
);

BellPlusIcon.displayName = "BellPlusIcon";
const icon = withAnimatedIconWrapper(BellPlusIcon);
export { icon as BellPlusIcon };
