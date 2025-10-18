"use client";

import { withAnimatedIconWrapper } from "@/components/AnimatedIconsWrapper";
import { cn } from "@/lib/utils";
import { AnimatedIconProps, AnimatedIconRef } from "@/types";
import type { Transition } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const CopyIcon = forwardRef<AnimatedIconRef, AnimatedIconProps>(
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
		const defaultTransition: Transition = {
			type: "spring",
			stiffness: 160,
			damping: 17,
			mass: 1,
		};

		const boxVariants = {
			normal: { translateY: 0, translateX: 0, rotate: 0 },
			animate: { translateY: -3, translateX: -3, rotate: 360 },
		};

		const pathVariants = {
			normal: { x: 0, y: 0 },
			animate: { x: 3, y: 3 },
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
					<motion.rect
						width="14"
						height="14"
						x="8"
						y="8"
						rx="2"
						ry="2"
						variants={boxVariants}
						animate={controls}
						transition={{
							...defaultTransition,
							duration: 0.7 * speed,
						}}
					/>
					<motion.path
						d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
						variants={pathVariants}
						animate={controls}
						transition={defaultTransition}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

CopyIcon.displayName = "CopyIcon";

const icon = withAnimatedIconWrapper(CopyIcon);
export { icon as CopyIcon };
