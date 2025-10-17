"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface UserLockIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface UserLockIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	durationMultiplier?: number;
}

const UserLockIcon = forwardRef<UserLockIconHandle, UserLockIconProps>(
	({ onMouseEnter, onMouseLeave, className, size = 28, durationMultiplier = 1, ...props }, ref) => {
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
		const headBodyVariants: Variants = {
			normal: { scale: 1 },
			animate: {
				scale: [1, 1.05, 1],
				transition: { duration: 0.4 * durationMultiplier },
			},
		};

		const lockVariants: Variants = {
			normal: { x: 0, rotate: 0 },
			animate: {
				x: [0, -2, 2, -2, 2, 0],
				rotate: [0, -3, 3, -3, 3, 0],
				transition: { duration: 0.5 * durationMultiplier },
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
					<motion.circle
						cx="10"
						cy="7"
						r="4"
						variants={headBodyVariants}
						animate={controls}
						initial="normal"
					/>
					<motion.path
						d="M10.3 15H7a4 4 0 0 0-4 4v2"
						variants={headBodyVariants}
						animate={controls}
						initial="normal"
					/>
					<motion.path
						d="M15 15.5V14a2 2 0 0 1 4 0v1.5"
						variants={lockVariants}
						animate={controls}
						initial="normal"
					/>
					<motion.rect
						width="8"
						height="5"
						x="13"
						y="16"
						rx=".899"
						variants={lockVariants}
						animate={controls}
						initial="normal"
					/>
				</svg>
			</motion.div>
		);
	},
);

UserLockIcon.displayName = "UserLockIcon";
export { UserLockIcon };
